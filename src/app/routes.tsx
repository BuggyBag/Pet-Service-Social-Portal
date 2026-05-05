import { createBrowserRouter } from "react-router";
import Root from "./pages/Root";
import ScrollView from "./pages/ScrollView";
import MapView from "./pages/MapView";
import ProviderProfile from "./pages/ProviderProfile";
import ProviderDashboard from "./pages/ProviderDashboard";
import UserDashboard from "./pages/UserDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: ScrollView },
      { path: "browse", Component: ScrollView },
      { path: "search", Component: ScrollView },
      { path: "map", Component: MapView },
      { path: "provider/:id", Component: ProviderProfile },
      { path: "dashboard", Component: ProviderDashboard },
      { path: "account", Component: UserDashboard },
    ],
  },
]);
