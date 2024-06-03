import { useContext } from "react";
import { Context } from "../socket/MarketContextProvider";
import { myMap } from "./mapInstruments";
import StockItem from "./StockItem";

export default function StockPanel() {
  const { stockList } = useContext(Context);
  const stockListKeys = Object.keys(stockList);

  return (
    <ul className="the-ul bg-slate-900 w-1/5 overflow-scroll">
      {stockListKeys.map((stock) => {
        return (
          <li key={stock} className="border-b border-neutral-700 h-16">
            <StockItem
              stockName={myMap[stock]}
              stockPrice={parseFloat(stockList[stock]["ltpc"]["ltp"]).toFixed(
                2
              )}
              stockColor={stockList[stock]["color"]}
              instrumentKey={stock}
            />
          </li>
        );
      })}
    </ul>
  );
}
