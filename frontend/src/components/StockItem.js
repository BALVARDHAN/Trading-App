import { useContext } from "react";
import { Context } from "../socket/MarketContextProvider";

export default function StockItem({
  stockName,
  stockPrice,
  stockColor,
  instrumentKey,
}) {
  const { stockClick, choosedStock } = useContext(Context);
  return (
    <button
      onClick={() => {
        stockClick(instrumentKey);
      }}
      className={`text-stone-300 px-2 font-bold h-full w-full flex justify-between items-center hover:bg-neutral-900 focus:bg-neutral-900 ${
        choosedStock == instrumentKey ? "border border-cyan-500" : ""
      }`}
    >
      <div className="flex flex-col items-start">
        <p className="text-stone-300 font-medium text-base">{stockName}</p>
        <p className="font-normal text-xs text-stone-400">NSE EQ</p>
      </div>
      <p className={`font-medium text-base ${stockColor}`}>{stockPrice}</p>
    </button>
  );
}
