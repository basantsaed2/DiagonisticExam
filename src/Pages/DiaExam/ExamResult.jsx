import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
    FaCheckCircle,
    FaArrowLeft,
    FaClock,
    FaChartBar,
    FaBook,
    FaAward,
    FaTimesCircle,
    FaFilePdf,
    FaLightbulb,
    FaShoppingCart,
    FaCheck,
    FaDollarSign
} from 'react-icons/fa';
import mainLogo from '../../assets/Images/mainLogo.png';
import { useGet } from '../../Hooks/useGet';
import PdfDocument from '../../Components/PdfDocument';
import ReportDocument from '../../Components/ReportDocument';
import { pdf } from '@react-pdf/renderer';
import { useSelector } from 'react-redux';

// Helper function to preload images and convert to base64 using CORS proxy
const preloadImages = async (mistakes) => {
    const processedMistakes = await Promise.all(
        mistakes.map(async (mistake) => {
            if (mistake.questions) {
                try {
                    // Try multiple CORS proxy options
                    const proxyUrls = [
                        `https://corsproxy.io/?${encodeURIComponent(mistake.questions)}`,
                        `https://api.allorigins.win/raw?url=${encodeURIComponent(mistake.questions)}`,
                        mistake.questions // Fallback to direct URL
                    ];
                    
                    let blob = null;
                    let lastError = null;
                    
                    // Try each proxy until one works
                    for (const proxyUrl of proxyUrls) {
                        try {
                            const response = await fetch(proxyUrl, {
                                mode: 'cors',
                                cache: 'no-cache'
                            });
                            
                            if (response.ok) {
                                blob = await response.blob();
                                console.log(`✓ Successfully loaded: ${mistake.questions.substring(0, 50)}...`);
                                break;
                            }
                        } catch (err) {
                            lastError = err;
                            continue; // Try next proxy
                        }
                    }
                    
                    if (!blob) {
                        throw lastError || new Error('All proxy attempts failed');
                    }
                    
                    return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            resolve({
                                ...mistake,
                                questions: reader.result // Base64 string
                            });
                        };
                        reader.onerror = () => {
                            console.error('FileReader error for:', mistake.questions);
                            resolve(mistake); // Return original if error
                        };
                        reader.readAsDataURL(blob);
                    });
                } catch (error) {
                    console.warn('⚠ Could not load image:', mistake.questions.substring(0, 50) + '...', error.message);
                    return mistake; // Return original if all attempts fail
                }
            }
            return mistake;
        })
    );
    return processedMistakes;
};

const ExamResult = () => {
    const { state } = useLocation();
    const examData = state?.examData || null;
    const timer = state?.timer || 0; // 👈 receives the passed timer
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const user = useSelector(state => state.user?.data );

    const [pdfData, setPdfData] = useState(null);
    const [reportData, setReportData] = useState(null);
    const [downloadingPdf, setDownloadingPdf] = useState(false);
    const [downloadingReport, setDownloadingReport] = useState(false);
    const [processingImages, setProcessingImages] = useState(false);
    const [selectedChapters, setSelectedChapters] = useState([]);

    const { refetch: refetchPdf, loading: loadingPdf, data: dataPdf } = useGet({
        url: `${apiUrl}/user/education/diagnostic/pdf/${examData?.exam_history_id}`
    });

    const { refetch: refetchReport, loading: loadingReport, data: dataReport } = useGet({
        url: `${apiUrl}/user/education/diagnostic/dia_report/${examData?.exam_history_id}`
    });

    // Toggle chapter selection
    const handleChapterSelect = (chapterId) => {
        setSelectedChapters(prev => {
            if (prev.includes(chapterId)) {
                return prev.filter(id => id !== chapterId);
            } else {
                return [...prev, chapterId];
            }
        });
    };

    // Select all chapters
    const handleSelectAll = () => {
        if (examData?.recommanditions) {
            const allChapterIds = examData.recommanditions.map(chapter => chapter.id);
            setSelectedChapters(allChapterIds);
        }
    };

    // Clear all selections
    const handleClearAll = () => {
        setSelectedChapters([]);
    };

    useEffect(() => {
        if (dataPdf) {
            processImagesAndDownload(dataPdf, 'pdf');
        }
    }, [dataPdf]);

    useEffect(() => {
        if (dataReport) {
            processImagesAndDownload(dataReport, 'report');
        }
    }, [dataReport]);

    const processImagesAndDownload = async (data, type) => {
        setProcessingImages(true);
        
        try {
            // Preprocess data with images
            const processedData = { ...data };
            
            if (processedData.mistakes && processedData.mistakes.length > 0) {
                console.log(`Processing ${processedData.mistakes.length} images for ${type}...`);
                processedData.mistakes = await preloadImages(processedData.mistakes);
                
                // Count successful conversions
                const successCount = processedData.mistakes.filter(m => 
                    m.questions && m.questions.startsWith('data:')
                ).length;
                
                console.log(`✓ Successfully processed ${successCount}/${processedData.mistakes.length} images`);
                
                if (successCount === 0) {
                    console.warn('⚠ No images were successfully loaded. PDF will show URLs instead.');
                }
            }
            
            if (type === 'pdf') {
                setPdfData(processedData);
                await handleAutoDownload(processedData, 'pdf');
            } else {
                setReportData(processedData);
                await handleAutoDownload(processedData, 'report');
            }
        } catch (error) {
            console.error('Error processing images:', error);
            // Fallback: download without image processing
            alert('Some images could not be loaded due to server restrictions. The PDF will include image URLs instead.');
            if (type === 'pdf') {
                setPdfData(data);
                await handleAutoDownload(data, 'pdf');
            } else {
                setReportData(data);
                await handleAutoDownload(data, 'report');
            }
        } finally {
            setProcessingImages(false);
        }
    };

    const handleAutoDownload = async (data, type) => {
        if (type === 'pdf') {
            setDownloadingPdf(true);
        } else {
            setDownloadingReport(true);
        }

        try {
            const DocumentComponent = type === 'pdf' ? PdfDocument : ReportDocument;
            const blob = await pdf(<DocumentComponent data={data} mainLogo={mainLogo} user={user.nick_name || user.f_name || 'User'} />).toBlob();
            
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            
            const fileName = type === 'pdf' 
                ? `exam-results-${examData?.exam_name || 'results'}.pdf`
                : `detailed-report-${examData?.exam_name || 'report'}.pdf`;
            
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error(`Error generating ${type} PDF:`, error);
            alert(`Error generating PDF. Please try again.`);
        } finally {
            if (type === 'pdf') {
                setDownloadingPdf(false);
            } else {
                setDownloadingReport(false);
            }
        }
    };

    const handlePdfDownload = () => {
        if (!pdfData) {
            refetchPdf();
        } else {
            handleAutoDownload(pdfData, 'pdf');
        }
    };

    const handleReportDownload = () => {
        if (!reportData) {
            refetchReport();
        } else {
            handleAutoDownload(reportData, 'report');
        }
    };

    if (!examData) {
        return (
            <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md border border-gray-200">
                    <img src={mainLogo} alt="Main Logo" className="mx-auto h-16 mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">No Results Available</h3>
                    <p className="text-gray-600 mb-6">Unable to load exam results. Please try again.</p>
                    <Link
                        to="/courses"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-mainColor text-white rounded-lg hover:bg-mainColor/90 transition-colors font-medium"
                    >
                        <FaArrowLeft className="text-sm" />
                        Back to Courses
                    </Link>
                </div>
            </div>
        );
    }

    // Dynamic calculations
    const maxScore = examData.exam?.score || 800;
    const scorePercentage = (examData.score / maxScore) * 100;
    const passStatus =  examData.grade  || examData.score >= examData.pass_score;
    const correctAnswers = examData.right_question || 0;
    const totalQuestions = examData.total_question || 0;
    const wrongAnswers = totalQuestions - correctAnswers;
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="overflow-y-auto bg-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <img src={mainLogo} alt="Main Logo" className="mx-auto h-20 mb-6" />
                    <h1 className="text-4xl font-bold text-mainColor mb-3">Exam Results</h1>
                    <div className="inline-flex items-center gap-2 bg-mainColor/10 px-4 py-2 rounded-lg">
                        <FaAward className="text-mainColor" />
                        <p className="text-lg font-semibold text-gray-800">{examData.exam_name}</p>
                    </div>
                </div>

                {/* Main Score Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Score Overview */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                        <div className="flex flex-col items-center text-center">
                            {/* Progress Circle */}
                            <div className="relative w-40 h-40 mb-6">
                                <svg className="w-full h-full" viewBox="0 0 100 100">
                                    <circle
                                        className="text-gray-200"
                                        strokeWidth="8"
                                        stroke="currentColor"
                                        fill="transparent"
                                        r="40"
                                        cx="50"
                                        cy="50"
                                    />
                                    <circle
                                        className="text-mainColor"
                                        strokeWidth="8"
                                        strokeDasharray={`${scorePercentage * 2.5133} 251.33`}
                                        strokeDashoffset="0"
                                        strokeLinecap="round"
                                        stroke="currentColor"
                                        fill="transparent"
                                        r="40"
                                        cx="50"
                                        cy="50"
                                        transform="rotate(-90 50 50)"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-bold text-mainColor">
                                        {Math.round(scorePercentage)}%
                                    </span>
                                    <span className="text-sm text-gray-500 mt-1">Overall Score</span>
                                </div>
                            </div>

                            {/* Score Details */}
                            <div className="space-y-4 w-full">
                                <div className="bg-mainColor/5 p-4 rounded-xl">
                                    <p className="text-2xl font-bold text-mainColor">{examData.score.toFixed(2)}</p>
                                    <p className="text-sm text-gray-600">Points Achieved</p>
                                </div>
                                <div className={`p-4 rounded-xl ${passStatus ? 'bg-green-100' : 'bg-red-100'}`}>
                                    <p className={`text-xl font-bold ${passStatus ? 'text-green-600' : 'text-red-600'}`}>
                                        {passStatus ? 'PASSED' : 'NOT PASSED'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Pass Score: {examData.pass_score}/{maxScore}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                            <FaChartBar className="text-mainColor" />
                            Performance Overview
                        </h2>

                        <div className="space-y-6">
                            {/* Accuracy */}
                            <div className="bg-mainColor/5 p-4 rounded-xl">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-semibold text-gray-800">Accuracy</span>
                                    <span className="text-xl font-bold text-mainColor">
                                        {Math.round(accuracy)}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-mainColor h-2 rounded-full transition-all duration-1000"
                                        style={{ width: `${accuracy}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Question Breakdown */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-green-50 p-4 rounded-xl text-center border border-green-200">
                                    <FaCheckCircle className="text-green-600 text-2xl mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-green-600">{correctAnswers}</p>
                                    <p className="text-sm text-gray-600">Correct</p>
                                </div>
                                <div className="bg-red-50 p-4 rounded-xl text-center border border-red-200">
                                    <FaTimesCircle className="text-red-600 text-2xl mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-red-600">{wrongAnswers}</p>
                                    <p className="text-sm text-gray-600">Incorrect</p>
                                </div>
                            </div>

                            {/* Time & Total */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-mainColor/5 p-4 rounded-xl text-center">
                                    <FaClock className="text-mainColor text-xl mx-auto mb-2" />
                                    <p className="text-lg font-bold text-gray-800">{timer}</p>
                                    <p className="text-sm text-gray-600">Duration</p>
                                </div>
                                <div className="bg-mainColor/5 p-4 rounded-xl text-center">
                                    <FaBook className="text-mainColor text-xl mx-auto mb-2" />
                                    <p className="text-lg font-bold text-gray-800">{totalQuestions}</p>
                                    <p className="text-sm text-gray-600">Total Questions</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Exam Details */}
                {/* <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Exam Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-700">Completed On</span>
                            <span className="font-semibold text-mainColor">{formatDate(examData.exam?.updated_at)}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-700">Grade Status</span>
                            <span className={`font-semibold ${examData.grade ? 'text-green-600' : 'text-yellow-600'}`}>
                                {examData.grade ? 'Graded' : 'Processing'}
                            </span>
                        </div>
                    </div>
                </div> */}

                {/* Action Buttons */}
                <div className="flex flex-row gap-4 mb-12 justify-center items-center">
                    <button
                        onClick={handlePdfDownload}
                        disabled={loadingPdf || downloadingPdf || processingImages}
                        className="flex items-center gap-2 px-2 md:px-8 py-4 bg-mainColor text-white rounded-xl hover:bg-mainColor/90 transition-colors font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FaFilePdf className="text-sm" />
                        {processingImages ? 'Processing Images...' : 
                         loadingPdf || downloadingPdf ? 'Generating PDF...' : 'Download PDF'}
                    </button>

                    <button
                        onClick={handleReportDownload}
                        disabled={loadingReport || downloadingReport || processingImages}
                        className="flex items-center gap-2 px-2 md:px-8 py-4 bg-mainColor text-white rounded-xl hover:bg-mainColor/90 transition-colors font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FaFilePdf className="text-sm" />
                        {processingImages ? 'Processing Images...' : 
                         loadingReport || downloadingReport ? 'Generating Report...' : 'Download Report'}
                    </button>
                </div>

                {/* Recommendations Section */}
                {examData.recommanditions && examData.recommanditions.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-200">
                        <div className="flex flex-col md:flex-row gap-5 md:items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <FaLightbulb className="text-mainColor text-2xl" />
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Recommended Chapters</h2>
                                    <p className="text-gray-600">Select chapters to purchase and improve your skills</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSelectAll}
                                    className="px-4 py-2 bg-mainColor text-white rounded-lg hover:bg-mainColor/90 transition-colors text-sm"
                                >
                                    Select All
                                </button>
                                <button
                                    onClick={handleClearAll}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                                >
                                    Clear All
                                </button>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            {examData.recommanditions.map((chapter, index) => {
                                const isSelected = selectedChapters.includes(chapter.id);
                                const minDurationPrice = chapter.price?.find(p => p.price === chapter.min_price) || chapter.price?.[0];
                                
                                return (
                                    <div
                                        key={chapter.id}
                                        className={`group flex items-start p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                                            isSelected 
                                                ? 'border-mainColor bg-mainColor/10' 
                                                : 'border-gray-200 bg-mainColor/5 hover:border-mainColor/50'
                                        }`}
                                        onClick={() => handleChapterSelect(chapter.id)}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => handleChapterSelect(chapter.id)}
                                            className="mt-1 h-5 w-5 text-mainColor rounded focus:ring-mainColor"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        
                                        <div className="ml-4 flex-1">
                                            <h3 className="font-semibold text-gray-800 group-hover:text-mainColor transition-colors">
                                                {chapter.chapter_name}
                                            </h3>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <FaClock className="text-mainColor" />
                                                    <span>Min: {minDurationPrice?.duration || ''} days</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <FaDollarSign className="text-mainColor" />
                                                    <span>From: ${chapter.min_price}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* <div className="text-right">
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                                isSelected ? 'bg-mainColor border-mainColor' : 'border-gray-300'
                                            }`}>
                                                {isSelected && <FaCheck className="text-white text-xs" />}
                                            </div>
                                        </div> */}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Buy Selected Chapters Button */}
                        {selectedChapters.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex flex-col md:flex-row gap-5 md:items-center justify-between">
                                    <div>
                                        <p className="text-lg font-semibold text-gray-800">
                                            {selectedChapters.length} chapter(s) selected
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            Continue to customize durations and complete purchase
                                        </p>
                                    </div>
                                    <Link
                                        to="/buy_chapters"
                                        state={{ 
                                            examData: examData,
                                            selectedChapterIds: selectedChapters 
                                        }}
                                        className="flex items-center gap-2 px-6 py-3 bg-mainColor text-white rounded-lg hover:bg-mainColor/90 transition-colors font-semibold shadow-lg hover:shadow-xl"
                                    >
                                        <FaShoppingCart />
                                        Continue to Purchase
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* No Chapters Selected Message */}
                {examData.recommanditions && examData.recommanditions.length > 0 && selectedChapters.length === 0 && (
                    <div className="text-center py-8">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 inline-block">
                            <FaLightbulb className="text-yellow-500 text-2xl mx-auto mb-3" />
                            <p className="text-yellow-700 font-medium">
                                Select chapters above to purchase and improve your skills
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamResult;