import { createBrowserRouter } from "react-router";
import Root from "./pages/Root";
import PreferenceSelector from "./pages/PreferenceSelector";
import MapView from "./pages/MapView";
import ScrollView from "./pages/ScrollView";
import ProviderProfile from "./pages/ProviderProfile";
import SearchResults from "./pages/SearchResults";
import ProviderDashboard from "./pages/ProviderDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: ScrollView },
      { path: "preferences", Component: PreferenceSelector },
      { path: "map", Component: MapView },
      { path: "browse", Component: ScrollView },
      { path: "provider/:id", Component: ProviderProfile },
      { path: "search", Component: SearchResults },
      { path: "dashboard", Component: ProviderDashboard },
    ],
  },
]);