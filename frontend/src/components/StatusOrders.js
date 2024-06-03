import { useContext } from "react";
import { Context } from "../socket/MarketContextProvider";

export default function StatusOrders({ ordersList }) {
  return (
    <table className="w-full text-stone-300">
      <thead>
        <tr className="flex py-1 border-y border-slate-600 text-md">
          <th className="basis-1/6 text-left">Stock</th>
          <th className="basis-1/6 text-left">Status</th>
          <th className="basis-1/6 text-left">Side</th>
          <th className="basis-1/6 text-left">Quantity</th>
          <th className="basis-1/6 text-left">Price</th>
          <th className="basis-1/6 text-left">Type</th>
          <th className="basis-1/6 text-left">Stop Loss</th>
        </tr>
      </thead>
      <tbody>
        {ordersList.map((tuple) => {
          if (tuple) {
            let textColor;
            if (tuple.status === "Success") {
              textColor = "text-green-600";
            } else if (tuple.status === "Failed") {
              textColor = "text-red-600";
            } else {
              textColor = "text-yellow-600";
            }
            return (
              <tr key={tuple._id} className="flex odd:bg-slate-800">
                <td className="basis-1/6 text-left">{tuple.stockName}</td>
                <td className={`basis-1/6 text-left ${textColor}`}>
                  {tuple.status}
                </td>
                <td className="basis-1/6 text-left">
                  {tuple.buying ? "Buy" : "Sell"}
                </td>
                <td className="basis-1/6 text-left">{tuple.quantity}</td>
                <td className="basis-1/6 text-left">{tuple.price}</td>
                <td className="basis-1/6 text-left">{tuple.orderType}</td>
                <td className="basis-1/6 text-left">
                  {tuple.stopLoss ? tuple.stopLoss : "--"}
                </td>
              </tr>
            );
          }
        })}
      </tbody>
    </table>
  );
}
