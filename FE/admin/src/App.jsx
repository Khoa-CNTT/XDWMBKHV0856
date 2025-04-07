import { Route, Routes } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import AdminRoutes from "./routes/AdminRoutes";

function App() {
  return (
    <>
      <Routes>
        {/* Route dành cho admin  */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        {/* Page 404  */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
