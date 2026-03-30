import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import "./index.css";
import "./i18n";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login/*", element: <SignInPage /> },
  { path: "/sign-up/*", element: <SignUpPage /> },
], { basename: "/Herb-Blockchain/" });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/Herb-Blockchain/" afterSignInUrl="/Herb-Blockchain/" afterSignUpUrl="/Herb-Blockchain/">
      <RouterProvider router={router} />
    </ClerkProvider>
  </React.StrictMode>
);

