import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                borderRadius: "18px",
                padding: "14px 16px",
                background: "#ffffff",
                color: "#1f2937",
                boxShadow: "0 12px 40px rgba(244, 114, 182, 0.18)",
              },
              success: {
                iconTheme: {
                  primary: "#db2777",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />
        </>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);