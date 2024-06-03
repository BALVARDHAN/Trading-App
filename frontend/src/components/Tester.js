import { useContext } from "react";
import { Context } from "../socket/MarketContextProvider";

export default function Tester() {
  const { connection, stockList } = useContext(Context);
  function handle() {
    console.log(stockList);
    console.log(connection);
  }
  return (
    <>
      <h1 className={connection ? "text-green-600" : "text-red-600"}>
        Balvardhan Parihar
      </h1>
      <button onClick={handle}>CLICK</button>
    </>
  );
}
