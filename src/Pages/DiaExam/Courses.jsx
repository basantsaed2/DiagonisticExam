// import React, { useEffect, useState } from 'react';
// import { useGet } from '../../Hooks/useGet';
// import { Link } from 'react-router-dom';
// import mainLogo from '../../assets/Images/mainLogo.png';

// const Courses = () => {
//     const apiUrl = import.meta.env.VITE_API_BASE_URL;
//     const { refetch: refetchList, loading: loadingList, data: dataList } = useGet({ url: `${apiUrl}/user/dia_exam/lists` });
//     const [diaList, setDiaList] = useState([]);

//     // Refetch courses when component mounts
//     useEffect(() => {
//         refetchList();
//     }, [refetchList]);

//     // Store the data in state
//     useEffect(() => {
//         if (dataList && !loadingList) {
//             setDiaList(dataList.courses || []);
//         }
//     }, [dataList, loadingList]);

//     // Show loading state
//     if (loadingList) {
//         return (
//             <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-200">
//                 <div className="relative">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-mainColor mx-auto mb-4"></div>
//                     <p className="mt-4 text-gray-600 font-medium">Loading Courses...</p>
//                 </div>
//             </div>
//         );
//     }

//     // Show empty state if no courses are available
//     if (!diaList || diaList.length === 0) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
//                 <div className="text-center p-6 bg-white rounded-xl shadow-lg animate-fade-in">
//                     <img src={mainLogo} alt="Main Logo" className="mx-auto h-24 mb-4 opacity-80" />
//                     <p className="text-gray-600 text-xl font-semibold">No Diagnostic Exams Available</p>
//                     <p className="text-gray-500 mt-2">Check back later for new courses!</p>
//                     <Link
//                         to="/"
//                         className="mt-4 inline-block px-6 py-2 bg-mainColor text-white rounded-lg hover:bg-mainColor/90 transition-colors"
//                     >
//                         Back to Home
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-16 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-7xl mx-auto">
//                 <h1 className="text-3xl md:text-4xl font-extrabold text-mainColor text-center mb-12 animate-fade-in">
//                     Explore Our Diagnostic Exam Courses
//                 </h1>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                     {diaList.map((course) => (
//                         <Link
//                             key={course.id}
//                             to={`/exam/${course.id}`}
//                             className="group bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
//                         >
//                             <div className="relative h-56">
//                                 <img
//                                     src={course.image_link || mainLogo}
//                                     alt={course.course_name}
//                                     className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
//                                 />
//                                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end transition-all duration-300 group-hover:from-black/70">
//                                     <div className="p-4 w-full">
//                                         <p className="text-white text-lg font-semibold line-clamp-2">
//                                             {course.course_name}
//                                         </p>
//                                         <p className="text-gray-200 text-sm mt-1 line-clamp-2">
//                                             Explore {course.course_name}
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </Link>
//                     ))}
//                 </div>
//             </div>

//             {/* Tailwind animation classes */}
//             <style jsx>{`
//                 @keyframes fadeIn {
//                     from { opacity: 0; transform: translateY(20px); }
//                     to { opacity: 1; transform: translateY(0); }
//                 }
//                 .animate-fade-in {
//                     animation: fadeIn 0.6s ease forwards;
//                 }
//                 .line-clamp-2 {
//                     display: -webkit-box;
//                     -webkit-line-clamp: 2;
//                     -webkit-box-orient: vertical;
//                     overflow: hidden;
//                 }
//                 .group:hover .text-mainColor {
//                     color: #1e40af; /* Slightly darker shade for hover */
//                 }
//             `}</style>
//         </div>
//     );
// };

// export default Courses;


import React, { useEffect, useState } from 'react';
import { useGet } from '../../Hooks/useGet';
import { Link } from 'react-router-dom';
import mainLogo from '../../assets/Images/mainLogo.png';
import Select from 'react-select';
import {
    FiSearch, FiCheck, FiHome, FiArrowRight
} from 'react-icons/fi';
import { HiOutlineAcademicCap } from 'react-icons/hi';

const Courses = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { refetch: refetchList, loading: loadingList, data: dataList } = useGet({ url: `${apiUrl}/user/dia_exam/lists` });
    const [diaList, setDiaList] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const mainColor = '#cf202f';
    const secondColor = "#f7c6c5";

    useEffect(() => {
        refetchList();
    }, [refetchList]);

    useEffect(() => {
        if (dataList && !loadingList) {
            setDiaList(dataList.courses || []);
        }
    }, [dataList, loadingList]);

    const courseOptions = diaList.map(course => ({
        value: course.id,
        label: course.course_name,
        image: course.image_link || mainLogo,
    }));

    const CustomOption = ({ innerProps, label, data, isSelected }) => (
        <div
            {...innerProps}
            className={`p-4 flex items-center space-x-4 cursor-pointer transition-all duration-200 ${isSelected
                    ? 'bg-red-50 border-l-4'
                    : 'hover:bg-gray-50 border-l-4 border-transparent'
                }`}
            style={{ borderLeftColor: isSelected ? mainColor : 'transparent' }}
        >
            <div className="relative flex-shrink-0">
                <img
                    src={data.image}
                    alt={label}
                    className="w-12 h-12 object-contain rounded-xl shadow-sm"
                />
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 truncate">{label}</h3>
            </div>
            {isSelected && (
                <div className="w-6 h-6 bg-gradient-to-r from-red-600 to-pink-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiCheck size={12} className="text-white" />
                </div>
            )}
        </div>
    );

    const handleCourseSelect = (selectedOption) => {
        setSelectedCourse(selectedOption);
    };

    if (loadingList) {
        return (
            <div className="h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 to-red-50">
                <div className="text-center">
                    <div className="relative inline-block">
                        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-mainColor mx-auto"></div>
                    </div>
                    <p className="mt-4 text-gray-600 font-medium">Loading Courses</p>
                    <p className="text-sm text-gray-400 mt-1">Preparing your learning experience</p>
                </div>
            </div>
        );
    }

    if (!diaList || diaList.length === 0) {
        return (
            <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-red-50">
                <div className="text-center p-8 max-w-md">
                    <div className="w-24 h-24 bg-gradient-to-r from-red-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <HiOutlineAcademicCap size={48} className="text-red-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">No Courses Available</h3>
                    <p className="text-gray-500 mb-6 leading-relaxed">
                        We're working on bringing you new diagnostic exams. Please check back soon for updates.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-pink-200 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                        <FiHome size={18} className="mr-2" />
                        Return to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gradient-to-br from-gray-50 to-red-50 py-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="max-w-4xl mx-auto h-full flex flex-col">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-mainColor mb-4">
                        Diagnostic Exams
                    </h1>
                    <p className="text-sm md:text-md text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        "Select a course to begin your diagnostic assessment and discover your learning path"
                    </p>
                </div>

                {/* Main Selection Card */}
                <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8 mb-4 border border-gray-100">
                    <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-pink-200 rounded-xl flex items-center justify-center mr-4 shadow-md">
                            <FiSearch size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Find Your Course</h2>
                            <p className="text-gray-500">Browse {diaList.length} available diagnostic exams</p>
                        </div>
                    </div>

                    <Select
                        options={courseOptions}
                        value={selectedCourse}
                        onChange={handleCourseSelect}
                        components={{
                            Option: CustomOption,
                        }}
                        placeholder={
                            <div className="flex items-center text-gray-400">
                                <FiSearch size={20} className="mr-3" />
                                Search for a course...
                            </div>
                        }
                        isSearchable={true}
                        className="react-select-container"
                        classNamePrefix="react-select"
                    />
                </div>

                {/* Selected Course Card */}
                {selectedCourse && (
                    <div className="bg-gradient-to-r from-red-600 to-pink-200 rounded-2xl shadow-2xl p-4 mb-8 transform transition-all duration-300 hover:scale-[1.02]">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-6 lg:space-y-0">
                            <div className="flex items-center space-x-6">
                                <div className="relative bg-white">
                                    <img
                                        src={selectedCourse.image}
                                        alt={selectedCourse.label}
                                        className="w-16 h-16 object-contain rounded-2xl shadow-2xl border-4 border-white border-opacity-20"
                                    />
                                    <div className="absolute -inset-2 bg-white bg-opacity-10 rounded-2xl blur-sm"></div>
                                </div>
                                <div className="text-white">
                                    <h3 className="text-2xl font-bold mb-2">{selectedCourse.label}</h3>
                                </div>
                            </div>
                            <Link
                                to={`/exam/${selectedCourse.value}`}
                                className="inline-flex items-center px-8 py-4 bg-white text-red-600 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group"
                            >
                                Start Exam
                                <FiArrowRight size={20} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Custom styles for react-select */}
            <style jsx>{`
        :global(.react-select__control) {
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 8px 12px;
          min-height: 60px;
          transition: all 0.3s ease;
          background: white;
          font-size: 16px;
        }
        :global(.react-select__control:hover) {
          border-color: #cf202f;
          box-shadow: 0 4px 20px rgba(207, 32, 47, 0.1);
        }
        :global(.react-select__control--is-focused) {
          border-color: #cf202f !important;
          box-shadow: 0 4px 25px rgba(207, 32, 47, 0.15) !important;
        }
        :global(.react-select__menu) {
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }
        :global(.react-select__option--is-selected) {
          background-color: #fef2f2 !important;
        }
        :global(.react-select__option--is-focused) {
          background-color: #f8fafc !important;
        }
      `}</style>
        </div>
    );
};

export default Courses;
