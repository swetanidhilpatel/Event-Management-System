import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, Router, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Contact from "./Pages/Contact.jsx";
import BookNow from "./Pages/BookNow.jsx";
import ParticipantsList from "./Admin Pages/ParticipantsList.jsx";      
import Login from "./Pages/Login.jsx";
import SignUp from "./Pages/SignUp.jsx";
import PaymentPage from "./Pages/PaymentPage.jsx";
import ConfirmPage from "./Pages/ConfirmPage.jsx";
import TermsAndConditions from "./Pages/TermsAndConditions.jsx";
import Cancel from "./Pages/Cancel.jsx";
import Error from "./Components/utils/Error.jsx";
import ParticipantsAdd from "./Admin Pages/ParticipantsAdd.jsx";
import AdminAddConfirmPage from "./Admin Pages/AdminAddConfirmPage.jsx";
import Logo from "./Pages/Logo.jsx";
import AdminTicketScanner from "./Admin Pages/AdminTicketScanner.jsx";
import AdminScannedTickets from "./Admin Pages/AdminScannedTickets.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/booknow",
        element: <BookNow/>
      },
      {
        path: "/participants",
        element: <ParticipantsList/>
      },
      {
        path: "/paymentpage",
        element: <PaymentPage/>
      },
      {
        path: "/paymentconfirm",
        element: <ConfirmPage/>
      },
      {
        path: "/terms",
        element: <TermsAndConditions/>
      },
      {
        path: "/cancel",
        element: <Cancel/>
      },
      {
        path: "/participantsadd",
        element: <ParticipantsAdd/>,
      },
      {
        path : "/adminaddtickets",
        element: <AdminAddConfirmPage/>,
      },
      {
        path : "/adminscannedtickets",
        element: <AdminScannedTickets/>,
      },
      {
        path : "/adminticketscanner",
        element: <AdminTicketScanner/>,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
