import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Courses from "./Pages/DiaExam/Courses";
import Login from "./Pages/Authentication/Login";
import ProtectedLogin from "./ProtectedData/ProtectedLogin";
import Exam from "./Pages/DiaExam/Exam";
import ExamResult from "./Pages/DiaExam/ExamResult";
import SignUp from "./Pages/Authentication/SignUp";
import BuyChapter from "./Pages/DiaExam/BuyChapter";


export const router = createBrowserRouter([
  {
    path: "",
    element: <App />,
    children: [
      // Public routes
      {
        path: "",
        element: <Courses />,
      },
      {
        path: "exam/:courseId",
        element: <Exam />,
      },
      {
        path: "exam/results/:examId",
        element: <ExamResult />,
      },
      {
        path:'buy_chapters',
        element: <BuyChapter/>
      },
      // Guest-only (auth pages)
      {
        path: "",
        element: <ProtectedLogin />, // checks if user exists → redirect to "/"
        children: [
          { path: "login", element: <Login /> },
          { path: "signup", element: <SignUp /> },
        ],
      },

      // Protected routes (require user login)
      // {
      //   path: "",
      //   element: <ProtectedLogin />, // checks if !user → redirect to "/login"
      //   children: [
      //     { path: "profile", element: <Profile /> },
      //     { path: "cart", element: <Cart /> },
      //     { path: "favorite_product", element: <FavoriteProducts /> },
      //     { path: "add_address", element: <AddNewAddress /> },
      //     { path: "check_out", element: <CheckOut /> },
      //     { path: "order_traking/:orderId", element: <OrderTraking /> },
      //     { path: "orders" , element: <MyOrderTracking /> },
      //   ],
      // },
    ],
  },
]);
