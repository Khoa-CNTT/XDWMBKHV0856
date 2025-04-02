import { Route, Routes } from "react-router-dom";
import HomeLayout from "../components/common/Layout/HomeLayout";
import NotFoundPage from "../pages/NotFoundPage";
import SuccessPage from "../pages/payment/SuccessPage";

const PaymentRoutes = () => {
  return (
    <HomeLayout>
      <Routes>
        <Route path="success" element={<SuccessPage />} />
        {/* <Route path="cancel" element={<CheckoutPage />} /> */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HomeLayout>
  );
};

export default PaymentRoutes;
