import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./auth.css";
import "./index.css";
import "./swiper.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { CourseProvider } from "./contexts/CourseContext.jsx";
import { MyOrderProvider } from "./contexts/MyOrderContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CourseProvider>
          <MyOrderProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </MyOrderProvider>
        </CourseProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
