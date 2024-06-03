import MarketContextProvider from "./socket/MarketContextProvider";
import "./App.css";
import StockPanel from "./components/StockPanel";
import MiddlePanel from "./components/MiddlePanel";
import OrderPanel from "./components/OrderPanel";

function App() {
  const auth_token =
    "eyJ0eXAiOiJKV1QiLCJrZXlfaWQiOiJza192MS4wIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiJBVTA0MDgiLCJqdGkiOiI2NjVkODI0ODA1M2FiYjBlY2YxMDNjMzciLCJpc011bHRpQ2xpZW50IjpmYWxzZSwiaWF0IjoxNzE3NDA0MjMyLCJpc3MiOiJ1ZGFwaS1nYXRld2F5LXNlcnZpY2UiLCJleHAiOjE3MTc0NTIwMDB9.qzg5Qpfq3DGvOE8kfha5pfxenKc45L-HZ10ugXmGL9Y";

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
