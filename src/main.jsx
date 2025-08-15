import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./routes/App";
import Terms from "./routes/Terms";
import Privacy from "./routes/Privacy";
import Refund from "./routes/Refund";
import Booking from "./routes/Booking";
import { CourtProvider } from "./context/CourtContext";
import { BookingProvider } from "./context/BookingContext";
import BeautifulCourtsUI from "./routes/Courts";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/terms", element: <Terms /> },
  { path: "/privacy-policy", element: <Privacy /> },
  { path: "/refund-policy", element: <Refund /> },
  { path: "/book", element: <BeautifulCourtsUI /> },
  { path: "/booking", element: <Booking /> }
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CourtProvider>
      <BookingProvider>
        <RouterProvider router={router} />
      </BookingProvider>
    </CourtProvider>
  </React.StrictMode>
);
