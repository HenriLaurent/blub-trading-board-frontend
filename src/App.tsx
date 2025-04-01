import "./App.css";
import TradingBoard, { Trader } from "./components/TradingBoard";

function App() {
  const tradersData: Trader[] = [
    {
      rank: 1,
      user: "0x8923...4d21",
      tradingScore: 1250,
      buyVolume: 32450,
      sellVolume: 12230,
      currentBalance: 20220,
    },
    {
      rank: 2,
      user: "0x7128...9f32",
      tradingScore: 980,
      buyVolume: 28100,
      sellVolume: 10200,
      currentBalance: 17900,
    },
    {
      rank: 3,
      user: "0x7128...9f32",
      tradingScore: 980,
      buyVolume: 28100,
      sellVolume: 10200,
      currentBalance: 17900,
    },
    {
      rank: 4,
      user: "0x7128...9f32",
      tradingScore: 980,
      buyVolume: 28100,
      sellVolume: 10200,
      currentBalance: 17900,
    },
    // more traders...
  ];
  return (
    <div className="grainy-background flex min-h-screen items-center justify-center">
      <TradingBoard traders={tradersData} />
    </div>
  );
}

export default App;
