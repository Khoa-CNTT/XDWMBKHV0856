import '@ant-design/v5-patch-for-react-19';
import { StrictMode } from 'react';
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import "./admin.css";
import App from "./App.jsx";
import "./auth.css";
import "./index.css";
import { Store } from "./redux/Store";
import { navigateHistory } from "./setting/setting";
import "./swiper.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={Store}>
      <HistoryRouter history={navigateHistory}>
        <App />
      </HistoryRouter>
    </Provider>
  </StrictMode>
);
