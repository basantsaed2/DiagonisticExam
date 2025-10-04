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
              const isAuth = location.pathname === '/login' || location.pathname === '/signup';
              const profile = location.pathname === '/profile';


              if (user && isAuth) {
                     navigate('/', { replace: true });
                     return;
              }

              if (!user && (profile)) {
                     if (!isToastShown) {
                            auth.toastError('You must be logged in to continue');
                            setIsToastShown(true);
                     }
                     navigate('/login', { replace: true });
              }
       }, [user, location.pathname, isToastShown, navigate, auth]);

       return <Outlet />;
};

export default ProtectedLogin;

