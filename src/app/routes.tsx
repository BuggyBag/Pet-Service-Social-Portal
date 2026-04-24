import { createBrowserRouter } from "react-router";
import Root from "./pages/Root";
import PreferenceSelector from "./pages/PreferenceSelector";
import MapView from "./pages/MapView";
import ScrollView from "./pages/ScrollView";
import ProviderProfile from "./pages/ProviderProfile";
import SearchResults from "./pages/SearchResults";
import ProviderDashboard from "./pages/ProviderDashboard";
import UserDashboard from "./pages/UserDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: PreferenceSelector },
      { path: "browse", Component: ScrollView },
      { path: "map", Component: MapView },
      { path: "provider/:id", Component: ProviderProfile },
      { path: "search", Component: SearchResults },
      { path: "dashboard", Component: ProviderDashboard },
      { path: "account", Component: UserDashboard },
    ],
  },
]);