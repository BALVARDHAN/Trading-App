import React, { createContext, useEffect, useState } from "react";
import proto from "./marketDataFeed.proto";
import { Buffer } from "buffer";
const protobuf = require("protobufjs");

export const Context = createContext({
  connection: false,
  stockList: {},
  choosedStock: null,
  stockClick: () => {},
  ordersList: [],
  onOrdersListArrival: () => {},
});

// Initialize Protobuf root
let protobufRoot = null;
const initProtobuf = async () => {
  protobufRoot = await protobuf.load(proto);
  console.log("Protobuf part initialization complete");
};

// Function to get WebSocket URL
const getUrl = async (token) => {
  const apiUrl = "https://api-v2.upstox.com/feed/market-data-feed/authorize";
  let headers = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const response = await fetch(apiUrl, {
    method: "GET",
    headers: headers,
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const res = await response.json();
  return res.data.authorizedRedirectUri;
};

// Helper functions for handling Blob and ArrayBuffer
const blobToArrayBuffer = async (blob) => {
  if ("arrayBuffer" in blob) return await blob.arrayBuffer();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject();
    reader.readAsArrayBuffer(blob);
  });
};

// Decode Protobuf messages
const decodeProfobuf = (buffer) => {
  if (!protobufRoot) {
    console.warn("Protobuf part not initialized yet!");
    return null;
  }
  const FeedResponse = protobufRoot.lookupType(
    "com.upstox.marketdatafeeder.rpc.proto.FeedResponse"
  );
  return FeedResponse.decode(buffer);
};

// MarketDataFeed component
export default function MarketContextProvider({ token, children }) {
  const [isConnected, setIsConnected] = useState(false);
  const [feedData, setFeedData] = useState({});
  const [selectedStock, setSelectedStock] = useState("NSE_EQ|INE742F01042");
  const [ordersListState, setOrdersListState] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3030/")
      .then((res) => res.json())
      .then((data) => setOrdersListState(data));
  }, []);

  function handleOrdersListArrival(orders) {
    setOrdersListState(orders);
  }

  function handleStockClick(instrument) {
    setSelectedStock(instrument);
  }

  function handleMessage(response) {
    setFeedData((currentData) => {
      let keys = Object.keys(response);
      keys.forEach((key) => {
        if (currentData[key]) {
          if (
            parseFloat(response[key]["ltpc"]["ltp"]) >
            parseFloat(currentData[key]["ltpc"]["ltp"])
          ) {
            response[key]["color"] = "text-green-500";
          } else if (
            parseFloat(response[key]["ltpc"]["ltp"]) <
            parseFloat(currentData[key]["ltpc"]["ltp"])
          ) {
            response[key]["color"] = "text-red-500";
          } else {
            response[key]["color"] = currentData[key]["color"];
          }
        }
      });
      return {
        ...currentData,
        ...response,
      };
    });
  }

  // Establish WebSocket connection
  useEffect(() => {
    const connectWebSocket = async (token) => {
      try {
        const wsUrl = await getUrl(token);
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          setIsConnected(true);
          console.log("Connected");
          const data = {
            guid: "someguid",
            method: "sub",
            data: {
              mode: "ltpc",
              instrumentKeys: [
                "NSE_EQ|INE742F01042",
                "NSE_EQ|INE021A01026",
                "NSE_EQ|INE238A01034",
                "NSE_EQ|INE917I01010",
                "NSE_EQ|INE918I01026",
                "NSE_EQ|INE296A01024",
                "NSE_EQ|INE397D01024",
                "NSE_EQ|INE029A01011",
                "NSE_EQ|INE216A01030",
                "NSE_EQ|INE059A01026",
                "NSE_EQ|INE522F01014",
                "NSE_EQ|INE089A01023",
                "NSE_EQ|INE066A01021",
                "NSE_EQ|INE129A01019",
                "NSE_EQ|INE047A01021",
                "NSE_EQ|INE860A01027",
                "NSE_EQ|INE040A01034",
                "NSE_EQ|INE158A01026",
              ],
            }, // Yaha ho gaya subscription
          };
          ws.send(Buffer.from(JSON.stringify(data)));
        };

        ws.onclose = () => {
          setIsConnected(false);
          console.log("Disconnected");
        };

        ws.onmessage = async (event) => {
          const arrayBuffer = await blobToArrayBuffer(event.data);
          let buffer = Buffer.from(arrayBuffer);
          let response = decodeProfobuf(buffer);
          response = response["feeds"];
          handleMessage(response);
        };

        ws.onerror = (error) => {
          setIsConnected(false);
          console.log("WebSocket error:", error);
        };

        return () => ws.close();
      } catch (error) {
        console.error("WebSocket connection error:", error);
      }
    };

    initProtobuf();
    connectWebSocket(token);
  }, [token]);

  const ctxValue = {
    connection: isConnected,
    stockList: feedData,
    choosedStock: selectedStock,
    stockClick: handleStockClick,
    ordersList: ordersListState,
    onOrdersListArrival: handleOrdersListArrival,
  };

  return <Context.Provider value={ctxValue}>{children}</Context.Provider>;
}
