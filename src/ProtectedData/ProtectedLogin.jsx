import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/Auth';
import { useSelector } from 'react-redux';

const ProtectedLogin = () => {
       const auth = useAuth();
       const navigate = useNavigate();
       const location = useLocation();
       const user = useSelector((state) => state.user?.data);

       const [isToastShown, setIsToastShown] = useState(false);

       useEffect(() => {
              const isAuth = location.pathname === '/' || location.pathname === '/signup' || location.pathname === '/forget_password';
              const courses = location.pathname === 'courses';
              const exam = location.pathname === 'exam/:courseId';
              const examResult = location.pathname === 'exam/results/:examId';
              const buyCourses = location.pathname === 'exam/:courseId';

              if (user && isAuth) {
                     navigate('/courses', { replace: true });
                     return;
              }

              if (!user && (courses || exam || examResult || buyCourses )) {
                     if (!isToastShown) {
                            auth.toastError('You must be logged in to continue');
                            setIsToastShown(true);
                     }
                     navigate('/', { replace: true });
              }
       }, [user, location.pathname, isToastShown, navigate, auth]);

       return <Outlet />;
};

export default ProtectedLogin;

