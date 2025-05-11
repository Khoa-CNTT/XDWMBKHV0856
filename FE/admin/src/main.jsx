import '@ant-design/v5-patch-for-react-19';
import 'bootstrap/dist/css/bootstrap.min.css';
import { StrictMode } from 'react';
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import "./404page.css";
import App from "./App.jsx";
import "./index.css";
import "./login.css";
import { Store } from "./redux/Store";
import { navigateHistory } from "./setting/setting";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={Store}>
      <HistoryRouter history={navigateHistory}>
        <App />
      </HistoryRouter>
    </Provider>
  </StrictMode>
);
