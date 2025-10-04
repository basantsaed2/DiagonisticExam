import React, { useEffect, useState } from 'react';
import { useGet } from '../../Hooks/useGet';
import { Link } from 'react-router-dom';
import mainLogo from '../../assets/Images/mainLogo.png';

const Courses = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { refetch: refetchList, loading: loadingList, data: dataList } = useGet({ url: `${apiUrl}/user/dia_exam/lists` });
    const [diaList, setDiaList] = useState([]);

    // Refetch courses when component mounts
    useEffect(() => {
        refetchList();
    }, [refetchList]);

    // Store the data in state
    useEffect(() => {
        if (dataList && !loadingList) {
            setDiaList(dataList.courses || []);
        }
    }, [dataList, loadingList]);

    // Show loading state
    if (loadingList) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-200">
                <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-mainColor mx-auto mb-4"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading Courses...</p>
                </div>
            </div>
        );
    }

    // Show empty state if no courses are available
    if (!diaList || diaList.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
                <div className="text-center p-6 bg-white rounded-xl shadow-lg animate-fade-in">
                    <img src={mainLogo} alt="Main Logo" className="mx-auto h-24 mb-4 opacity-80" />
                    <p className="text-gray-600 text-xl font-semibold">No Diagnostic Exams Available</p>
                    <p className="text-gray-500 mt-2">Check back later for new courses!</p>
                    <Link
                        to="/"
                        className="mt-4 inline-block px-6 py-2 bg-mainColor text-white rounded-lg hover:bg-mainColor/90 transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-extrabold text-mainColor text-center mb-12 animate-fade-in">
                    Explore Our Diagnostic Exam Courses
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {diaList.map((course) => (
                        <Link
                            key={course.id}
                            to={`/exam/${course.id}`}
                            className="group bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                        >
                            <div className="relative h-56">
                                <img
                                    src={course.image_link || mainLogo}
                                    alt={course.course_name}
                                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end transition-all duration-300 group-hover:from-black/70">
                                    <div className="p-4 w-full">
                                        <p className="text-white text-lg font-semibold line-clamp-2">
                                            {course.course_name}
                                        </p>
                                        <p className="text-gray-200 text-sm mt-1 line-clamp-2">
                                            Explore {course.course_name}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Tailwind animation classes */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.6s ease forwards;
                }
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .group:hover .text-mainColor {
                    color: #1e40af; /* Slightly darker shade for hover */
                }
            `}</style>
        </div>
    );
};

export default Courses;