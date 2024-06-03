import StatusPanel from "./StatusPanel";
import ChartPanel from "./ChartPanel";
import { Context } from "../socket/MarketContextProvider";
import { useContext, useMemo } from "react";
export default function MiddlePanel() {
  const { choosedStock } = useContext(Context);
  const Key = useMemo(() => choosedStock, [choosedStock]);
  return (
    <div className="w-3/5 bg-slate-700 flex flex-col gap-3">
      <div className="h-2/3 bg-slate-900 ">
        <ChartPanel instrumentKey={Key} />
      </div>
      <div className="h-1/3 bg-slate-900 p-2">
        <StatusPanel />
      </div>
    </div>
  );
}
