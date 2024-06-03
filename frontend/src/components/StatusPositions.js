import { useContext, useEffect, useState } from "react";
import { Context } from "../socket/MarketContextProvider";

export default function StatusPositions({ ordersList }) {
  const { stockList } = useContext(Context);
  let array = [];
  let ids = [];
  let tempOrdersList = [];

  let chomu = ordersList.map((tuple) => {
    let tempo = { ...tuple };
    tempo.opnl = 0;
    return tempo;
  });

  chomu.map((tuple) => {
    if (tuple) {
      if (tuple.status === "Success") {
        if (!ids.includes(tuple._id)) {
          if (array.includes(tuple.instrumentKey)) {
            tempOrdersList.map((item) => {
              if (item.instrumentKey === tuple.instrumentKey) {
                if (item.quantity > 0 && tuple.quantity < 0) {
                  item.opnl += tuple.quantity * -1 * (tuple.price - item.price);
                } else if (item.quantity < 0 && tuple.quantity > 0) {
                  item.opnl += tuple.quantity * (item.price - tuple.price);
                } else {
                  item.price = (item.price + tuple.price) / 2;
                }
                item.quantity += tuple.quantity;
              }
            });
          } else {
            array.push(tuple.instrumentKey);
            tempOrdersList.push(tuple);
          }
          ids.push(tuple._id);
        }
      }
    }
  });

  return (
    <table className="w-full text-stone-300">
      <thead>
        <tr className="flex py-1 border-y border-slate-600">
          <th className="basis-1/6 text-left">Stock</th>
          <th className="basis-1/6 text-left">Net Qty</th>
          <th className="basis-1/6 text-left">Avg Price</th>
          <th className="basis-1/6 text-left">LTP</th>
          <th className="basis-1/6 text-left">P&L</th>
          <th className="basis-1/6 text-left">Overall P&L</th>
        </tr>
      </thead>
      <tbody>
        {tempOrdersList.map((tuple) => {
          if (tuple) {
            return (
              <tr key={tuple._id} className="flex odd:bg-slate-800">
                <td className="basis-1/6 text-left">{tuple.stockName}</td>
                <td className="basis-1/6 text-left">{tuple.quantity}</td>
                <td className="basis-1/6 text-left">
                  {parseFloat(tuple.price).toFixed(2)}
                </td>
                <td className="basis-1/6 text-left">
                  {parseFloat(
                    stockList[tuple.instrumentKey]["ltpc"]["ltp"]
                  ).toFixed(2)}
                </td>
                <td
                  className={`basis-1/6 text-left ${
                    tuple.quantity *
                      (stockList[tuple.instrumentKey]["ltpc"]["ltp"] -
                        tuple.price) >
                    0
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {parseFloat(
                    tuple.quantity *
                      (stockList[tuple.instrumentKey]["ltpc"]["ltp"] -
                        tuple.price)
                  ).toFixed(2)}
                </td>
                <td
                  className={`basis-1/6 text-left font-bold text-md ${
                    parseFloat(tuple.opnl).toFixed(2) > 0
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {parseFloat(tuple.opnl).toFixed(2)}
                </td>
              </tr>
            );
          }
        })}
      </tbody>
    </table>
  );
}
