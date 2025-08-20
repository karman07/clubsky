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
import BookingLookupPage from "./routes/SearchBooking";
import MembershipPlans from "./routes/MembershipPlans";
import MembershipRegistrationSystem from "./routes/MembershipDetails";
import ClubPage from "./routes/ClubPage";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/terms", element: <Terms /> },
  { path: "/privacy-policy", element: <Privacy /> },
  { path: "/refund-policy", element: <Refund /> },
  { path: "/book", element: <ClubPage/>  },
  { path: "/booking/:id", element: <Booking /> },
  { path:"/search", element:<BookingLookupPage/>},
  {path:"/membership", element:<MembershipPlans/>},
  {path:"/membershipDetails/:planId", element:<MembershipRegistrationSystem/>},
  {path:"/club", element:<Booking />}
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
