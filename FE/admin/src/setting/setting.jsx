import { Modal } from "antd";
import axios from "axios";
import { createBrowserHistory } from "history";
import { VITE_API_URL } from "./api";
export const TOKEN = "accessToken";

export const navigateHistory = createBrowserHistory();


export function setCookie(name, value, days = 7) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

export function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function deleteCookie(name) {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

export const DOMAIN =  VITE_API_URL || "http://localhost:8080";

export const http = axios.create({
  baseURL: DOMAIN,
  timeout: 10000,
  withCredentials: true,
});

http.interceptors.request.use((req) => {
  const token = localStorage.getItem(TOKEN);

  if (token && !req.url.includes(`/v1/admin-login`)) {
    req.headers = {
      ...req.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return req;
});

http.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err?.response?.status;
    const message = err?.response?.data?.message || "An error occurred!";

    switch (status) {
      case 401:
        localStorage.removeItem(TOKEN);
        if (location.pathname !== "/login") {
          navigateHistory.push("/login");
        }
        break;

      case 403:
        Modal.warning({
          title: "Warning",
          content: "You do not have permission to access this page!",
        });
        break;

      case 404:
        Modal.error({
          title: "Error",
          content: "The page you requested could not be found.",
        });
        break;

      case 500:
        Modal.error({
          title: "Error System",
          content: message,
        });
        break;

      default:
        break;
    }

    return Promise.reject(""); // Không hiển thị gì cả ở chỗ gọi API
  }
);


