import MarketContextProvider from "./socket/MarketContextProvider";
import "./App.css";
import StockPanel from "./components/StockPanel";
import MiddlePanel from "./components/MiddlePanel";
import OrderPanel from "./components/OrderPanel";

function App() {
  const auth_token = "";

  return (
    <div className="bg-slate-700 h-full flex items-stretch gap-3 p-6">
      <MarketContextProvider token={auth_token}>
        <StockPanel />
        <MiddlePanel />
        <OrderPanel />
      </MarketContextProvider>
    </div>
  );
}

export default App;
