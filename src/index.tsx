import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "tippy.js/dist/tippy.css";
import { AppKitProvider } from "./context/AppKitProvider";
import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

root.render(
    <React.StrictMode>
        <AppKitProvider>
            <App />
            <Toaster
                position="bottom-right"
                toastOptions={{ style: { background: "#111", color: "#fff" } }}
            />
        </AppKitProvider>
    </React.StrictMode>
);
