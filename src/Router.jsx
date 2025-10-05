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
import ForgetPassword from "./Pages/Authentication/ForgetPassword";


export const router = createBrowserRouter([
  {
    path: "",
    element: <App />,
    children: [
      // Guest-only (auth pages)
      {
        path: "",
        element: <ProtectedLogin />, // checks if user exists → redirect to "/"
        children: [
          { path: "/", element: <Login /> },
          { path: "signup", element: <SignUp /> },
          { path: "forget_password", element: <ForgetPassword /> },
        ],
      },

      // Protected routes (require user login)
      {
        path: "",
        element: <ProtectedLogin />, // checks if !user → redirect to "/login"
        children: [
          {
            path: "courses",
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
            path: 'buy_chapters',
            element: <BuyChapter />
          },
        ],
      },
    ],
  },
]);
