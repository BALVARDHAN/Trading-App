import { useState, useEffect, useContext } from "react";
import { Context } from "../socket/MarketContextProvider";
import StatusOrders from "./StatusOrders";
import StatusPositions from "./StatusPositions";
const axios = require("axios");

export default function StatusPanel() {
  const [selectedButton, setSelectedButton] = useState("orders");
  const { stockList, ordersList, onOrdersListArrival } = useContext(Context);

  function handleShowContent(content) {
    setSelectedButton(content);
  }

  function handleHoldings() {
    const url =
      "https://api.upstox.com/v2/historical-candle/intraday/NSE_EQ|INE040A01034/1minute";

    fetch(url, {
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  }

  ordersList.map((item) => {
    if (item) {
      if (item.status === "Pending") {
        if (stockList[item.instrumentKey]) {
          if (
            (item.buying &&
              item.price >= stockList[item.instrumentKey]["ltpc"]["ltp"]) ||
            (!item.buying &&
              item.price <= stockList[item.instrumentKey]["ltpc"]["ltp"])
          ) {
            fetch("http://localhost:3030/status", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: item._id,
              }),
            })
              .then((res) => res.json())
              .then((data) => {
                onOrdersListArrival(data);
              });
          }
        }
      }
    }
  });

  return (
    <div className="flex flex-col overflow-hidden h-full">
      <div className="flex gap-2 font-semibold pb-2 ">
        <button
          className={`w-1/3 py-1 font-bold ${
            selectedButton === "orders"
              ? "bg-slate-400 text-stone-900"
              : "bg-slate-800 text-stone-500"
          }`}
          onClick={() => {
            handleShowContent("orders");
          }}
        >
          Orders
        </button>
        <button
          className={`w-1/3 py-1 ${
            selectedButton === "positions"
              ? "bg-slate-400 text-stone-900"
              : "bg-slate-800 text-stone-500"
          }`}
          onClick={() => {
            handleShowContent("positions");
          }}
        >
          Positions
        </button>
        <button
          className={`w-1/3 py-1 ${
            selectedButton === "holdings"
              ? "bg-slate-400 text-stone-900"
              : "bg-slate-800 text-stone-500"
          }`}
          onClick={handleHoldings}
        >
          Holdings
        </button>
      </div>
      <div className="h-full overflow-scroll the-ul">
        {selectedButton === "orders" ? (
          <StatusOrders ordersList={ordersList} />
        ) : (
          <StatusPositions ordersList={ordersList} />
        )}
      </div>
    </div>
  );
}
