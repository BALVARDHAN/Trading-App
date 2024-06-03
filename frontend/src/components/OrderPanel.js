import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../socket/MarketContextProvider";
import { myMap } from "./mapInstruments";

export default function OrderPanel() {
  const price = useRef("");
  const quant = useRef("");
  const { choosedStock, stockList, onOrdersListArrival } = useContext(Context);
  const [orderDetails, setOrderDetails] = useState({
    stockName: myMap[choosedStock],
    instrumentKey: choosedStock,
    status: "Pending",
    buying: true,
    orderType: "Limit",
    quantity: 0,
    price: 0,
    stopLoss: 0,
  });

  function handleBuySell(type) {
    let bool = type === "buy";
    setOrderDetails((prev) => {
      return {
        ...prev,
        buying: bool,
        quantity: "",
        price: "",
        stopLoss: "",
      };
    });
  }
  function handleQuantityEvent(event) {
    const notAllowedKeys = [".", "+", "-", "e"];
    if (notAllowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
  function handlePriceEvent(event) {
    const notAllowedKeys = ["+", "-", "e"];
    if (notAllowedKeys.includes(event.key)) {
      event.preventDefault();
    }
    let temp = String(event.target.value);
    temp = temp.split("").reverse().join();
    if (temp.indexOf(".") > 2) {
      const re = /^[0-9]$/;
      if (re.test(event.key)) {
        event.preventDefault();
      }
    }
  }
  function handleOrderTypeEvent(type) {
    setOrderDetails((prev) => {
      return {
        ...prev,
        orderType: type,
      };
    });
  }
  function handleSubmit() {
    if (
      orderDetails["orderType"] === "Market" ||
      orderDetails["orderType"] === "SL-Market"
    ) {
      orderDetails["price"] = stockList[choosedStock]["ltpc"]["ltp"];
    }
    if (!orderDetails["buying"]) {
      orderDetails["quantity"] = orderDetails["quantity"] * -1;
    }
    fetch("http://localhost:3030/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderDetails),
    })
      .then((res) => res.json())
      .then((data) => onOrdersListArrival(data));
  }
  function handleQuantityChange(event) {
    setOrderDetails((prev) => {
      return {
        ...prev,
        quantity: event.target.value,
      };
    });
  }
  function handlePriceChange(event) {
    setOrderDetails((prev) => {
      return {
        ...prev,
        price: event.target.value,
      };
    });
  }
  function handleStopLossChange(event) {
    setOrderDetails((prev) => {
      return {
        ...prev,
        stopLoss: event.target.value,
      };
    });
  }

  useEffect(() => {
    setOrderDetails((prev) => {
      return {
        ...prev,
        stockName: myMap[choosedStock],
        instrumentKey: choosedStock,
        quantity: "",
        price: "",
        stopLoss: "",
        buying: true,
        orderType: "Limit",
      };
    });
  }, [choosedStock]);

  return (
    <div className="w-1/5 h-full bg-slate-900 flex flex-col justify-between">
      <div className="p-4">
        <div className="flex justify-start items-center">
          <h1 className="text-xl text-stone-300 pr-2 mr-2 border-r border-r-neutral-600">
            {myMap[choosedStock]}
          </h1>
          <p className="font-normal text-sm text-stone-400">NSE EQ</p>
        </div>
        <h1
          className={`my-2 text-3xl font-semibold ${
            stockList[choosedStock]
              ? stockList[choosedStock]["color"]
              : "text-stone-400"
          }`}
        >
          {stockList[choosedStock]
            ? parseFloat(stockList[choosedStock]["ltpc"]["ltp"]).toFixed(2)
            : "Loading"}
        </h1>
        <div className="flex mt-10 text-md font-semibold tracking-widest bg-slate-800">
          <button
            className={`w-1/2 ${
              orderDetails["buying"]
                ? "bg-emerald-600 text-stone-300"
                : "bg-slate-800 text-stone-500"
            } py-2 `}
            onClick={() => {
              handleBuySell("buy");
            }}
          >
            Buy
          </button>
          <button
            className={`w-1/2 ${
              orderDetails["buying"]
                ? "bg-slate-800 text-stone-500"
                : "bg-red-500 text-stone-300"
            } py-2 `}
            onClick={() => {
              handleBuySell("sell");
            }}
          >
            Sell
          </button>
        </div>
        <div className="flex flex-col gap-3 mt-10">
          <input
            className="bg-neutral-700 py-2  pl-3 text-stone-300 placeholder-stone-400 outline-none"
            placeholder="Quantity"
            type="number"
            onKeyDown={handleQuantityEvent}
            onChange={handleQuantityChange}
            value={orderDetails.quantity}
            ref={quant}
          />
          <input
            className="bg-neutral-700 py-2  pl-3 text-stone-300 placeholder-stone-400 outline-none"
            type="number"
            onKeyDown={handlePriceEvent}
            onChange={handlePriceChange}
            placeholder={
              orderDetails["orderType"] === "Market" ||
              orderDetails["orderType"] === "SL-Market"
                ? stockList[choosedStock]["ltpc"]["ltp"]
                : "Price"
            }
            disabled={
              orderDetails["orderType"] === "Market" ||
              orderDetails["orderType"] === "SL-Market"
                ? true
                : false
            }
            value={orderDetails.price}
            ref={price}
          />
        </div>
        <div className="mt-10 border-b border-neutral-700"></div>
        <p className="mt-5 text-stone-300 text-lg">Order Type</p>
        <div className="flex gap-2 mt-3 font-semibold text-sm">
          <button
            className={`w-1/4 py-1 ${
              orderDetails["orderType"] === "Limit"
                ? "bg-slate-400 text-stone-900"
                : "bg-slate-800 text-stone-500"
            }`}
            onClick={() => {
              handleOrderTypeEvent("Limit");
            }}
          >
            Limit
          </button>
          <button
            className={`w-1/4 py-1 ${
              orderDetails["orderType"] === "Market"
                ? "bg-slate-400 text-stone-900"
                : "bg-slate-800 text-stone-500"
            }`}
            onClick={() => {
              handleOrderTypeEvent("Market");
            }}
          >
            Market
          </button>
          <button
            className={`w-1/4 py-1 ${
              orderDetails["orderType"] === "SL-Limit"
                ? "bg-slate-400 text-stone-900"
                : "bg-slate-800 text-stone-500"
            }`}
            onClick={() => {
              handleOrderTypeEvent("SL-Limit");
            }}
          >
            SL-Limit
          </button>
          <button
            className={`w-1/4 py-1 ${
              orderDetails["orderType"] === "SL-Market"
                ? "bg-slate-400 text-stone-900"
                : "bg-slate-800 text-stone-500"
            }`}
            onClick={() => {
              handleOrderTypeEvent("SL-Market");
            }}
          >
            SL-Market
          </button>
        </div>
        {orderDetails["orderType"] === "SL-Limit" ||
        orderDetails["orderType"] === "SL-Market" ? (
          <input
            className="w-full mt-6 bg-neutral-700 py-2 rounded-md pl-3 text-stone-300 placeholder-stone-400 outline-none"
            placeholder="Stop-Loss"
            type="number"
            onKeyDown={handlePriceEvent}
            onChange={handleStopLossChange}
          />
        ) : null}
      </div>
      <button
        className={`py-3 text-stone-300 text-xl font-semibold ${
          orderDetails["buying"] ? "bg-emerald-600" : "bg-red-500"
        }`}
        onClick={handleSubmit}
      >{`Place ${orderDetails["buying"] ? "Buy" : "Sell"} Order`}</button>
    </div>
  );
}
