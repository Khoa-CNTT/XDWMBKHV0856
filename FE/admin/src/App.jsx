import { Route, Routes } from "react-router-dom";
import LoginAdmin from "./pages/login/LoginAdmin";
import NotFoundPage from "./pages/NotFoundPage";
import AdminRoutes from "./routes/AdminRoutes";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginAdmin/>}/>
        {/* Route dành cho admin  */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        {/* Page 404  */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
