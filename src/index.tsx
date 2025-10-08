import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "tippy.js/dist/tippy.css";
import { AppKitProvider } from "./context/AppKitProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

root.render(
    <React.StrictMode>
        <AppKitProvider>
            <App />
            <ToastContainer position="bottom-right" newestOnTop theme="dark" />
        </AppKitProvider>
    </React.StrictMode>
);
