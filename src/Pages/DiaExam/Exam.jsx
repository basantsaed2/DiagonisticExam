import React, { useEffect, useState, useRef } from 'react';
import { useGet } from '../../Hooks/useGet';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaClock, FaChevronLeft, FaChevronRight, FaDivide, FaCheck, FaPaperPlane } from 'react-icons/fa';
import mainLogo from '../../assets/Images/mainLogo.png';
import { usePost } from '../../Hooks/usePost';

const Exam = () => {
    const { courseId } = useParams();
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { refetch: refetchExam, loading: loadingExam, data: dataExam } = useGet({
        url: `${apiUrl}/user/dia_exam/show_exam/${courseId}`
    });
    const { postData, loadingPost, response } = usePost({
        url: `${apiUrl}/user/dia_exam/grade_exam`,
    });

    const [diaExam, setDiaExam] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [gridInValues, setGridInValues] = useState({});
    const [numerator, setNumerator] = useState('');
    const [denominator, setDenominator] = useState('');
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const questionBarRef = useRef(null);
    const navigate = useNavigate();

    // Refetch exam when component mounts
    useEffect(() => {
        refetchExam();
    }, [refetchExam]);

    // Store exam data in state
    useEffect(() => {
        if (dataExam && !loadingExam) {
            setDiaExam(dataExam.exam || []);
        }
    }, [dataExam, loadingExam]);

    // Redirect to results page with response data
    useEffect(() => {
        if (response && response.data && !loadingPost) {
            navigate(`/exam/results/${response.data.exam?.id}`, { state: { examData: response.data } });
        }
    }, [response, loadingPost, navigate]);


    // Timer logic to count up
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeElapsed((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Initialize question bar scroll
    useEffect(() => {
        if (questionBarRef.current) {
            questionBarRef.current.scrollLeft = 0;
        }
    }, [diaExam]);

    // Scroll to current question in question bar
    useEffect(() => {
        if (questionBarRef.current) {
            const currentQuestionElement = questionBarRef.current.children[currentQuestionIndex];
            if (currentQuestionElement) {
                currentQuestionElement.scrollIntoView({
                    behavior: 'smooth',
                    inline: 'center',
                    block: 'nearest'
                });
            }
        }
    }, [currentQuestionIndex]);

    // Reset fraction inputs when question changes
    useEffect(() => {
        setNumerator('');
        setDenominator('');
    }, [currentQuestionIndex]);

    // Handle answer selection for MCQ - store the mcq_num value (A, B, C, D)
    const handleMCQAnswer = (questionId, mcqNum) => {
        setAnswers((prev) => ({ ...prev, [questionId]: mcqNum }));
    };

    // Handle Grid-in fraction input
    const handleGridInFraction = (questionId, num, denom) => {
        setNumerator(num);
        setDenominator(denom);

        if (num && denom && denom !== '0') {
            const fractionValue = `${num}/${denom}`;
            setAnswers((prev) => ({ ...prev, [questionId]: fractionValue }));
            setGridInValues(prev => ({ ...prev, [questionId]: fractionValue }));
        } else if (num && (!denom || denom === '')) {
            // If only numerator is provided, treat as whole number
            setAnswers((prev) => ({ ...prev, [questionId]: num }));
            setGridInValues(prev => ({ ...prev, [questionId]: num }));
        } else {
            setAnswers((prev) => ({ ...prev, [questionId]: '' }));
            setGridInValues(prev => ({ ...prev, [questionId]: '' }));
        }
    };

    // Calculate fraction result safely
    const calculateFractionResult = (value) => {
        if (!value || typeof value !== 'string') return '';

        try {
            if (value.includes('/')) {
                const parts = value.split('/');
                if (parts.length !== 2) return '';

                const num = parseFloat(parts[0]);
                const denom = parseFloat(parts[1]);

                if (isNaN(num) || isNaN(denom)) return '';
                if (denom === 0) return '∞';

                const result = num / denom;
                return Number.isInteger(result) ? result.toString() : result.toFixed(3);
            } else {
                // It's a whole number or decimal
                const num = parseFloat(value);
                return isNaN(num) ? '' : num.toString();
            }
        } catch {
            return '';
        }
    };

    // Clear fraction inputs
    const clearFraction = (questionId) => {
        setNumerator('');
        setDenominator('');
        setAnswers((prev) => ({ ...prev, [questionId]: '' }));
        setGridInValues(prev => ({ ...prev, [questionId]: '' }));
    };

    // Format time for display
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Handle form submission
    const handleSubmit = () => {
        const formData = new FormData();
        let exam_id = '';

        // Add answers in correct order based on question sequence
        diaExam.forEach((question, index) => {
            if (question && question.id) { // Add null check
                const answer = answers[question.id] || '';
                formData.append(`answers[${index}]`, answer);
                if (index === 0) {
                    exam_id = question.pivot?.diagnostic_exam_id || courseId; // Fallback to courseId
                }
            }
        });

        // Add timer
        formData.append('timer', formatTime(timeElapsed));
        formData.append('exam_id', exam_id);

        postData(formData, "Exam submitted successfully");
        setShowSubmitModal(false);
    };

    // Check if current question is the last one
    const isLastQuestion = currentQuestionIndex === diaExam.length - 1;

    // Show loading state
    if (loadingExam) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-mainColor mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium text-lg">Loading Exam Questions...</p>
                </div>
            </div>
        );
    }

    // Show empty state if no exams are available
    if (!diaExam || diaExam.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md mx-4">
                    <img src={mainLogo} alt="Main Logo" className="mx-auto h-20 mb-6" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No Exam Available</h3>
                    <p className="text-gray-600 mb-6">The exam you're looking for is not available at the moment.</p>
                    <Link
                        to="/courses"
                        className="inline-flex items-center px-6 py-3 bg-mainColor text-white rounded-lg hover:bg-mainColor/90 transition-colors font-medium"
                    >
                        Back to Courses
                    </Link>
                </div>
            </div>
        );
    }

    // Safe access to current question
    const currentQuestion = diaExam[currentQuestionIndex];

    // If currentQuestion is undefined, show error or reset to first question
    if (!currentQuestion) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md mx-4">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Exam Error</h3>
                    <p className="text-gray-600 mb-6">There was an error loading the exam questions.</p>
                    <Link
                        to="/courses"
                        className="inline-flex items-center px-6 py-3 bg-mainColor text-white rounded-lg hover:bg-mainColor/90 transition-colors font-medium"
                    >
                        Back to Courses
                    </Link>
                </div>
            </div>
        );
    }

    const totalQuestions = diaExam.length;
    const currentAnswer = answers[currentQuestion.id];
    const calculatedResult = calculateFractionResult(currentAnswer);

    return (
        <div className="min-h-screen bg-white py-6 px-4 md:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-extrabold text-mainColor text-center">
                    Diagnostic Exam
                </h1>

                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex flex-row justify-between items-center gap-4">
                        {/* Question Progress */}
                        <div className="flex items-center gap-4">
                            <div className="bg-mainColor/10 text-mainColor px-4 py-2 rounded-lg font-semibold">
                                Question {currentQuestionIndex + 1} of {totalQuestions}
                            </div>
                        </div>

                        {/* Timer */}
                        <div className="flex items-center gap-3 bg-mainColor/10 px-4 py-2 rounded-lg">
                            <FaClock className="text-mainColor text-lg" />
                            <span className="text-xl font-bold text-gray-800 font-mono">
                                {formatTime(timeElapsed)}
                            </span>
                        </div>
                    </div>

                    {/* Question Navigation Bar */}
                    <div className="mt-4">
                        <div className="flex gap-5 mb-2">
                            <span className="text-sm text-gray-600 font-medium">Questions:</span>
                            <span className="text-sm text-gray-600">
                                {Object.keys(answers).length} / {totalQuestions} answered
                            </span>
                        </div>
                        <div
                            ref={questionBarRef}
                            className="flex overflow-x-auto gap-2 py-3 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                        >
                            {diaExam.map((question, index) => {
                                // Create unique key using both id and index to avoid duplicates
                                const uniqueKey = question?.id ? `${question.id}-${index}` : `question-${index}`;

                                return (
                                    <button
                                        key={uniqueKey}
                                        onClick={() => setCurrentQuestionIndex(index)}
                                        className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-semibold transition-all duration-300 transform hover:scale-105
                                            ${index === currentQuestionIndex
                                                ? 'bg-mainColor text-white shadow-lg scale-110'
                                                : question && answers[question.id]
                                                    ? 'bg-green-500 text-white shadow-md'
                                                    : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-mainColor hover:text-mainColor'
                                            }`}
                                    >
                                        {index + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        {/* Question Section */}
                        <div className="lg:w-3/4 p-2 md:p-6 border-r border-gray-200">
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                                    Question {currentQuestionIndex + 1}
                                </h3>
                                {currentQuestion.q_image ? (
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <img
                                            src={currentQuestion.q_image}
                                            alt={`Question ${currentQuestionIndex + 1}`}
                                            className="w-full object-contain rounded-lg"
                                            onError={(e) => {
                                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjAgMTIwSDE4MFYxODBIMTIwVjEyMFoiIGZpbGw9IiM5Q0EwQUIiLz4KPHRleHQgeD0iMjAwIiB5PSIxNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzZCNzU3RCI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD4KPC9zdmc+';
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 rounded-lg p-6 min-h-[200px]">
                                        <div
                                            className="text-gray-800 text-lg leading-relaxed prose max-w-none"
                                            dangerouslySetInnerHTML={{ __html: currentQuestion.question || 'No question content available' }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Answer Section */}
                        <div className="lg:w-1/4 p-2 md:p-6">
                            <h3 className="text-lg font-semibold text-gray-700 mb-6">Your Answer</h3>

                            {currentQuestion.ans_type === 'MCQ' ? (
                                <div className="space-y-3">
                                    {currentQuestion.mcq && currentQuestion.mcq.map((option) => {
                                        // Create unique key for MCQ options
                                        const optionKey = option?.id ? `option-${option.id}` : `option-${Math.random()}`;

                                        return (
                                            <label
                                                key={optionKey}
                                                className={`flex items-center p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer group
                                                    ${answers[currentQuestion.id] === option.mcq_num
                                                        ? 'bg-mainColor/10 border-mainColor shadow-md'
                                                        : 'bg-white border-gray-200 hover:border-mainColor hover:bg-mainColor/5'
                                                    }`}
                                            >
                                                <div className="relative h-5 w-5">
                                                    <input
                                                        type="radio"
                                                        name={`question-${currentQuestion.id}`}
                                                        checked={answers[currentQuestion.id] === option.mcq_num}
                                                        onChange={() => handleMCQAnswer(currentQuestion.id, option.mcq_num)}
                                                        className="appearance-none h-5 w-5 border-2 rounded-full border-gray-300 checked:border-mainColor focus:outline-none focus:ring-0 transition-colors"
                                                    />
                                                    {answers[currentQuestion.id] === option.mcq_num && (
                                                        <FaCheck className="absolute top-1 left-1 text-mainColor text-sm" />
                                                    )}
                                                </div>
                                                <span className="ml-4 text-gray-800 font-medium text-lg">
                                                    {option.mcq_num}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Grid-in Fraction Input */}
                                    <div className="bg-gray-50 rounded-xl p-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-4">
                                            Enter your answer as a fraction:
                                        </label>

                                        <div className="flex items-center justify-center gap-3 mb-4">
                                            {/* Numerator Input */}
                                            <input
                                                type="number"
                                                value={numerator}
                                                onChange={(e) => handleGridInFraction(currentQuestion.id, e.target.value, denominator)}
                                                placeholder="0"
                                                className="w-20 px-3 py-3 border-2 border-gray-300 rounded-lg focus:border-mainColor focus:ring-2 focus:ring-mainColor/20 text-center text-lg font-semibold"
                                            />

                                            {/* Division Symbol */}
                                            <div className="flex flex-col items-center">
                                                <div className="w-10 h-0.5 bg-gray-400 mb-1"></div>
                                                <FaDivide className="text-gray-500 text-sm" />
                                                <div className="w-10 h-0.5 bg-gray-400 mt-1"></div>
                                            </div>

                                            {/* Denominator Input */}
                                            <input
                                                type="number"
                                                value={denominator}
                                                onChange={(e) => handleGridInFraction(currentQuestion.id, numerator, e.target.value)}
                                                placeholder="0"
                                                className="w-20 px-3 py-3 border-2 border-gray-300 rounded-lg focus:border-mainColor focus:ring-2 focus:ring-mainColor/20 text-center text-lg font-semibold"
                                            />
                                        </div>

                                        {/* Clear Button */}
                                        <button
                                            onClick={() => clearFraction(currentQuestion.id)}
                                            className="w-full py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium mt-2"
                                        >
                                            Clear
                                        </button>
                                    </div>

                                    {/* Result Display */}
                                    {(numerator || denominator) && (
                                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                            <div className="text-center">
                                                <span className="text-green-800 font-medium block mb-2">Your fraction:</span>
                                                <div className="flex items-center justify-center gap-4">
                                                    <span className="text-green-900 font-bold text-2xl">
                                                        {numerator || '0'}
                                                    </span>
                                                    <span className="text-green-900 font-bold text-xl">/</span>
                                                    <span className="text-green-900 font-bold text-2xl">
                                                        {denominator || '0'}
                                                    </span>
                                                </div>
                                                {calculatedResult && (
                                                    <div className="mt-3 pt-3 border-t border-green-200">
                                                        <span className="text-green-700 font-medium">Decimal value: </span>
                                                        <span className="text-green-900 font-bold text-lg">
                                                            {calculatedResult}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-6">
                    <button
                        onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
                        disabled={currentQuestionIndex === 0}
                        className="flex items-center gap-2 px-4 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium"
                    >
                        <FaChevronLeft className="text-sm" />
                        Previous
                    </button>

                    <div className="text-sm text-gray-500 font-medium">
                        Question {currentQuestionIndex + 1} of {totalQuestions}
                    </div>

                    {isLastQuestion ? (
                        <button
                            onClick={() => setShowSubmitModal(true)}
                            className="flex items-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
                        >
                            <FaPaperPlane className="text-xs" />
                            Submit
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentQuestionIndex((prev) => Math.min(prev + 1, totalQuestions - 1))}
                            className="flex items-center gap-2 px-4 py-3 bg-mainColor text-white rounded-xl hover:bg-mainColor/90 transition-colors font-medium"
                        >
                            Next
                            <FaChevronRight className="text-sm" />
                        </button>
                    )}
                </div>
            </div>

            {/* Submit Confirmation Modal */}
            {showSubmitModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Submit Exam</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to submit your exam? You have answered{' '}
                            <span className="font-semibold text-mainColor">
                                {Object.keys(answers).length} out of {totalQuestions}
                            </span>{' '}
                            questions.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowSubmitModal(false)}
                                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loadingPost}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                            >
                                {loadingPost ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Exam;