import { createBrowserRouter } from "react-router";
import Root from "./pages/Root";
import TradingBoardPage from "./pages/TradingBoard";
import AuthSuccessPage from "./pages/AuthSuccess";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: TradingBoardPage },
      { path: "auth/success", Component: AuthSuccessPage },
    ],
  },
]);
