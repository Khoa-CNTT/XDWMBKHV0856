import { Route, Routes } from "react-router-dom";
import HomeLayout from "../components/common/Layout/HomeLayout";
import NotFoundPage from "../pages/NotFoundPage";
import SuccessPage from "../pages/payment/SuccessPage";

const PaymentRoutes = () => {
  return (
    <Routes>
      <Route element={<HomeLayout />}>
        <Route path="success" element={<SuccessPage />} />
        {/* <Route path="cancel" element={<CheckoutPage />} /> */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default PaymentRoutes;
