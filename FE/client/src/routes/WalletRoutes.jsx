// src/App.jsx
import { Routes, Route } from "react-router-dom";
import ProfileAndWallet from "../pages/teacher/wallet/ProfileAndWallet";
import History from "../pages/teacher/wallet/History";

function WalletRoutes() {
  return (
    <Routes>
      <Route path="/profile" element={<ProfileAndWallet />} />
      <Route path="/history" element={<History />} />
    </Routes>
  );
}

export default WalletRoutes;
