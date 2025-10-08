import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { FaUser } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Add useLocation
import mainLogo from '../assets/Images/mainLogo.png';
import { useAuth } from '../Context/Auth';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Add this hook
    const user = useSelector(state => state.user?.data);
    const [pages] = useState(['/', '/signup', '/forget_password']);
    const auth = useAuth();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Sync login state with user data
    useEffect(() => {
        setIsLoggedIn(!!user?.token);
    }, [user?.token]);

    const handleLogout = () => {
        auth.logout();
        setIsMobileMenuOpen(false);
        navigate('/');
    };

    const { t } = useTranslation();

    // Check if current path should hide navbar
    const shouldHideNavbar = () => {
        // Exact path matches
        if (pages.some(page => location.pathname === page)) {
            return true;
        }
        
        // Hide for all exam routes (using regex)
        if (location.pathname.startsWith('/exam/')) {
            return true;
        }
        
        return false;
    };

    return (
        <>
            {shouldHideNavbar() ? null : (
                <nav className="shadow-lg relative z-40 bg-white text-mainColor">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo on the left */}
                            <div className="flex-shrink-0">
                                <Link to="/">
                                    <img
                                        src={mainLogo}
                                        alt="Maths House Logo"
                                        className="h-12 w-auto object-contain"
                                    />
                                </Link>
                            </div>

                            {/* User Profile and Actions - Desktop */}
                            <div className="flex items-center space-x-4">
                                {isLoggedIn && user ? (
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                            {user.image_link && user.image !== "default.png" ? (
                                                <img
                                                    src={user.image_link}
                                                    alt={user.nick_name || user.f_name || 'User'}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <FaUser className="h-6 w-6 text-gray-600" />
                                            )}
                                        </div>
                                        <span className="text-sm font-medium">{user.nick_name || user.f_name || 'User'}</span>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 px-3 py-2 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors duration-200"
                                        >
                                            <LogOut size={16} />
                                            <span>Logout</span>
                                        </button>
                                    </div>

                                ) : (
                                    <div className="flex items-center space-x-4">
                                        <Link
                                            to="/"
                                            className="text-sm hover:text-secondColor transition-colors duration-200"
                                        >
                                            {t('login')}
                                        </Link>
                                        <Link
                                            to="/signup"
                                            className="text-sm bg-secondColor hover:bg-opacity-90 text-white px-4 py-2 rounded-lg transition duration-200"
                                        >
                                            {t('signup')}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>
            )}
        </>
    );
};

export default Navbar;