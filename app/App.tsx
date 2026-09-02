import SiteContent from "./components/SiteContent";
import PanelClient from "./panel/PanelClient";

export default function App() {
  const isPanel = window.location.pathname.replace(/\/+$/, "") === "/panel";
  document.title = isPanel ? "Elys Prime | Yönetim Paneli" : "Elys Prime | Bulki Yapı";
  return isPanel ? <PanelClient /> : <SiteContent />;
}
