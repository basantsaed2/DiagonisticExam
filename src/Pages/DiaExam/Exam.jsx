// import React, { useEffect, useState, useRef } from 'react';
// import { useGet } from '../../Hooks/useGet';
// import { Link, useNavigate, useParams } from 'react-router-dom';
// import { FaClock, FaChevronLeft, FaChevronRight, FaDivide, FaCheck, FaPaperPlane } from 'react-icons/fa';
// import mainLogo from '../../assets/Images/mainLogo.png';
// import { usePost } from '../../Hooks/usePost';

// const Exam = () => {
//     const { courseId } = useParams();
//     const apiUrl = import.meta.env.VITE_API_BASE_URL;
//     const { refetch: refetchExam, loading: loadingExam, data: dataExam } = useGet({
//         url: `${apiUrl}/user/dia_exam/show_exam/${courseId}`
//     });
//     const { postData, loadingPost, response } = usePost({
//         url: `${apiUrl}/user/dia_exam/grade_exam`,
//     });

//     const [diaExam, setDiaExam] = useState([]);
//     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//     const [answers, setAnswers] = useState({});
//     const [timeElapsed, setTimeElapsed] = useState(0);
//     const [gridInValues, setGridInValues] = useState({});
//     const [numerator, setNumerator] = useState('');
//     const [denominator, setDenominator] = useState('');
//     const [showSubmitModal, setShowSubmitModal] = useState(false);
//     const questionBarRef = useRef(null);
//     const navigate = useNavigate();

//     // Refetch exam when component mounts
//     useEffect(() => {
//         refetchExam();
//     }, [refetchExam]);

//     // Store exam data in state
//     useEffect(() => {
//         if (dataExam && !loadingExam) {
//             setDiaExam(dataExam.exam || []);
//         }
//     }, [dataExam, loadingExam]);

//     // Redirect to results page with response data
//     useEffect(() => {
//         if (response && response.data && !loadingPost) {
//             navigate(`/exam/results/${response.data.exam?.id}`, { state: { examData: response.data , timer: formatTime(timeElapsed) } });
//         }
//     }, [response, loadingPost, navigate]);

//     // Timer logic to count up
//     useEffect(() => {
//         const timer = setInterval(() => {
//             setTimeElapsed((prev) => prev + 1);
//         }, 1000);
//         return () => clearInterval(timer);
//     }, []);

//     // Initialize question bar scroll
//     useEffect(() => {
//         if (questionBarRef.current) {
//             questionBarRef.current.scrollLeft = 0;
//         }
//     }, [diaExam]);

//     // Scroll to current question in question bar
//     useEffect(() => {
//         if (questionBarRef.current) {
//             const currentQuestionElement = questionBarRef.current.children[currentQuestionIndex];
//             if (currentQuestionElement) {
//                 currentQuestionElement.scrollIntoView({
//                     behavior: 'smooth',
//                     inline: 'center',
//                     block: 'nearest'
//                 });
//             }
//         }
//     }, [currentQuestionIndex]);

//     // Reset fraction inputs when question changes AND populate from stored values
//     useEffect(() => {
//         const currentQuestionId = diaExam[currentQuestionIndex]?.id;

//         if (currentQuestionId) {
//             const storedFraction = gridInValues[currentQuestionId];

//             if (storedFraction && typeof storedFraction === 'string') {
//                 if (storedFraction.includes('/')) {
//                     // It's a fraction like "1/2"
//                     const [num, denom] = storedFraction.split('/');
//                     setNumerator(num || '');
//                     setDenominator(denom || '');
//                 } else {
//                     // It's a whole number
//                     setNumerator(storedFraction);
//                     setDenominator('');
//                 }
//             } else {
//                 // No stored value, reset inputs
//                 setNumerator('');
//                 setDenominator('');
//             }
//         } else {
//             // Fallback reset
//             setNumerator('');
//             setDenominator('');
//         }
//     }, [currentQuestionIndex, diaExam, gridInValues]);

//     // Handle answer selection for MCQ - store the mcq_num value (A, B, C, D)
//     const handleMCQAnswer = (questionId, mcqNum) => {
//         setAnswers((prev) => ({ ...prev, [questionId]: mcqNum }));
//     };

//     // Calculate fraction result safely
//     const calculateFractionResult = (value) => {
//         if (!value || typeof value !== 'string') return '';

//         try {
//             if (value.includes('/')) {
//                 const parts = value.split('/');
//                 if (parts.length !== 2) return '';

//                 const num = parseFloat(parts[0]);
//                 const denom = parseFloat(parts[1]);

//                 if (isNaN(num) || isNaN(denom)) return '';
//                 if (denom === 0) return '∞';

//                 const result = num / denom;
//                 return Number.isInteger(result) ? result.toString() : result.toFixed(3);
//             } else {
//                 // It's a whole number or decimal
//                 const num = parseFloat(value);
//                 return isNaN(num) ? '' : num.toString();
//             }
//         } catch {
//             return '';
//         }
//     };

//     // Handle Grid-in fraction input
//     const handleGridInFraction = (questionId, num, denom) => {
//         setNumerator(num);
//         setDenominator(denom);

//         let finalValue = '';
//         let fractionDisplayValue = '';

//         if (num && denom && denom !== '0') {
//             fractionDisplayValue = `${num}/${denom}`;
//             const calculatedValue = calculateFractionResult(fractionDisplayValue);
//             finalValue = calculatedValue || '';
//         } else if (num && (!denom || denom === '')) {
//             // If only numerator is provided, treat as whole number
//             fractionDisplayValue = num;
//             finalValue = num;
//         }

//         setGridInValues(prev => ({ ...prev, [questionId]: fractionDisplayValue }));
//         setAnswers((prev) => ({ ...prev, [questionId]: finalValue }));
//     };

//     // Clear fraction inputs
//     const clearFraction = (questionId) => {
//         setNumerator('');
//         setDenominator('');
//         setAnswers((prev) => ({ ...prev, [questionId]: '' }));
//         setGridInValues(prev => ({ ...prev, [questionId]: '' }));
//     };

//     // Format time for display
//     const formatTime = (seconds) => {
//         const hours = Math.floor(seconds / 3600);
//         const minutes = Math.floor((seconds % 3600) / 60);
//         const secs = seconds % 60;
//         return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//     };

//     // Handle form submission
//     const handleSubmit = () => {
//         const formData = new FormData();
//         let exam_id = '';

//         // Add answers in correct order based on question sequence
//         diaExam.forEach((question, index) => {
//             if (question && question.id) {
//                 let answer = answers[question.id] || '';

//                 // If it's a fraction string, calculate the decimal value
//                 if (answer && typeof answer === 'string' && answer.includes('/')) {
//                     const calculated = calculateFractionResult(answer);
//                     answer = calculated || '';
//                 }

//                 formData.append(`answers[${index}]`, answer);
//                 if (index === 0) {
//                     exam_id = question.pivot?.diagnostic_exam_id || courseId;
//                 }
//             }
//         });

//         // Add timer
//         formData.append('timer', formatTime(timeElapsed));
//         formData.append('exam_id', exam_id);

//         postData(formData, "Exam submitted successfully");
//         setShowSubmitModal(false);
//     };

//     // Check if current question is the last one
//     const isLastQuestion = currentQuestionIndex === diaExam.length - 1;

//     // Show loading state
//     if (loadingExam) {
//         return (
//             <div className="min-h-screen flex justify-center items-center bg-white">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-mainColor mx-auto mb-4"></div>
//                     <p className="text-gray-600 font-medium text-lg">Loading Exam Questions...</p>
//                 </div>
//             </div>
//         );
//     }

//     // Show empty state if no exams are available
// if (!diaExam || diaExam.length === 0) {
//     return (
//         <div className="min-h-screen flex items-center justify-center bg-white">
//             <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md mx-4">
//                 <img src={mainLogo} alt="Main Logo" className="mx-auto h-20 mb-6" />
//                 <h3 className="text-2xl font-bold text-gray-900 mb-3">No Exam Available</h3>
//                 <p className="text-gray-600 mb-6">The exam you're looking for is not available at the moment.</p>
//                 <Link
//                     to="/courses"
//                     className="inline-flex items-center px-6 py-3 bg-mainColor text-white rounded-lg hover:bg-mainColor/90 transition-colors font-medium"
//                 >
//                     Back to Courses
//                 </Link>
//             </div>
//         </div>
//     );
// }

//     // Safe access to current question
//     const currentQuestion = diaExam[currentQuestionIndex];

//     // If currentQuestion is undefined, show error or reset to first question
// if (!currentQuestion) {
//     return (
//         <div className="min-h-screen flex items-center justify-center bg-white">
//             <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md mx-4">
//                 <h3 className="text-2xl font-bold text-gray-900 mb-3">Exam Error</h3>
//                 <p className="text-gray-600 mb-6">There was an error loading the exam questions.</p>
//                 <Link
//                     to="/courses"
//                     className="inline-flex items-center px-6 py-3 bg-mainColor text-white rounded-lg hover:bg-mainColor/90 transition-colors font-medium"
//                 >
//                     Back to Courses
//                 </Link>
//             </div>
//         </div>
//     );
// }

//     const totalQuestions = diaExam.length;
//     const currentAnswer = answers[currentQuestion.id];
//     const currentGridInValue = gridInValues[currentQuestion.id];
//     const calculatedResult = calculateFractionResult(currentGridInValue);

//     return (
//         <div className="min-h-screen bg-white py-6 px-4 md:px-6 lg:px-8">
//             <div className="max-w-7xl mx-auto">
//                 {/* Title */}
//                 <h1 className="text-3xl md:text-4xl font-extrabold text-mainColor text-center">
//                     Diagnostic Exam
//                 </h1>

//                 {/* Header Section */}
//                 <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
//                     <div className="flex flex-row justify-between items-center gap-4">
//                         {/* Question Progress */}
//                         <div className="flex items-center gap-4">
//                             <div className="bg-mainColor/10 text-mainColor px-4 py-2 rounded-lg font-semibold">
//                                 Question {currentQuestionIndex + 1} of {totalQuestions}
//                             </div>
//                         </div>

//                         {/* Timer */}
//                         <div className="flex items-center gap-3 bg-mainColor/10 px-4 py-2 rounded-lg">
//                             <FaClock className="text-mainColor text-lg" />
//                             <span className="text-xl font-bold text-gray-800 font-mono">
//                                 {formatTime(timeElapsed)}
//                             </span>
//                         </div>
//                     </div>

//                     {/* Question Navigation Bar */}
//                     <div className="mt-4">
//                         <div className="flex gap-5 mb-2">
//                             <span className="text-sm text-gray-600 font-medium">Questions:</span>
//                             <span className="text-sm text-gray-600">
//                                 {Object.keys(answers).length} / {totalQuestions} answered
//                             </span>
//                         </div>
//                         <div
//                             ref={questionBarRef}
//                             className="flex overflow-x-auto gap-2 py-3 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
//                         >
//                             {diaExam.map((question, index) => {
//                                 const uniqueKey = question?.id ? `${question.id}-${index}` : `question-${index}`;

//                                 return (
//                                     <button
//                                         key={uniqueKey}
//                                         onClick={() => setCurrentQuestionIndex(index)}
//                                         className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-semibold transition-all duration-300 transform hover:scale-105
//                                             ${index === currentQuestionIndex
//                                                 ? 'bg-mainColor text-white shadow-lg scale-110'
//                                                 : question && answers[question.id]
//                                                     ? 'bg-green-500 text-white shadow-md'
//                                                     : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-mainColor hover:text-mainColor'
//                                             }`}
//                                     >
//                                         {index + 1}
//                                     </button>
//                                 );
//                             })}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Main Content */}
//                 <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//                     <div className="flex flex-col lg:flex-row">
//                         {/* Question Section */}
//                         <div className="lg:w-3/4 p-2 md:p-6 border-r border-gray-200">
//                             <div className="mb-6">
//                                 <h3 className="text-lg font-semibold text-gray-700 mb-4">
//                                     Question {currentQuestionIndex + 1}
//                                 </h3>
//                                 {currentQuestion.q_image ? (
//                                     <div className="bg-gray-50 rounded-lg p-4">
//                                         <img
//                                             src={currentQuestion.q_image}
//                                             alt={`Question ${currentQuestionIndex + 1}`}
//                                             className="w-full object-contain rounded-lg"
//                                             onError={(e) => {
//                                                 e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjAgMTIwSDE4MFYxODBIMTIwVjEyMFoiIGZpbGw9IiM5Q0EwQUIiLz4KPHRleHQgeD0iMjAwIiB5PSIxNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzZCNzU3RCI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD4KPC9zdmc+';
//                                             }}
//                                         />
//                                     </div>
//                                 ) : (
//                                     <div className="bg-gray-50 rounded-lg p-6 min-h-[200px]">
//                                         <div
//                                             className="text-gray-800 text-lg leading-relaxed prose max-w-none"
//                                             dangerouslySetInnerHTML={{ __html: currentQuestion.question || 'No question content available' }}
//                                         />
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Answer Section */}
//                         <div className="lg:w-1/4 p-2 md:p-6">
//                             <h3 className="text-lg font-semibold text-gray-700 mb-6">Your Answer</h3>

//                             {currentQuestion.ans_type === 'MCQ' ? (
//                                 <div className="space-y-3">
//                                     {currentQuestion.mcq && currentQuestion.mcq.map((option) => {
//                                         const optionKey = option?.id ? `option-${option.id}` : `option-${Math.random()}`;

//                                         return (
//                                             <label
//                                                 key={optionKey}
//                                                 className={`flex items-center p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer group
//                                                     ${answers[currentQuestion.id] === option.mcq_num
//                                                         ? 'bg-mainColor/10 border-mainColor shadow-md'
//                                                         : 'bg-white border-gray-200 hover:border-mainColor hover:bg-mainColor/5'
//                                                     }`}
//                                             >
//                                                 <div className="relative h-5 w-5">
//                                                     <input
//                                                         type="radio"
//                                                         name={`question-${currentQuestion.id}`}
//                                                         checked={answers[currentQuestion.id] === option.mcq_num}
//                                                         onChange={() => handleMCQAnswer(currentQuestion.id, option.mcq_num)}
//                                                         className="appearance-none h-5 w-5 border-2 rounded-full border-gray-300 checked:border-mainColor focus:outline-none focus:ring-0 transition-colors"
//                                                     />
//                                                     {answers[currentQuestion.id] === option.mcq_num && (
//                                                         <FaCheck className="absolute top-1 left-1 text-mainColor text-sm" />
//                                                     )}
//                                                 </div>
//                                                 <span className="ml-4 text-gray-800 font-medium text-lg">
//                                                     {option.mcq_num}
//                                                 </span>
//                                             </label>
//                                         );
//                                     })}
//                                 </div>
//                             ) : (
//                                 <div className="space-y-6">
//                                     {/* Grid-in Fraction Input */}
//                                     <div className="bg-gray-50 rounded-xl p-6">
//                                         <label className="block text-sm font-medium text-gray-700 mb-4">
//                                             Enter your answer as a fraction:
//                                         </label>

//                                         <div className="flex items-center justify-center gap-3 mb-4">
//                                             {/* Numerator Input */}
//                                             <input
//                                                 type="number"
//                                                 value={numerator}
//                                                 onChange={(e) => handleGridInFraction(currentQuestion.id, e.target.value, denominator)}
//                                                 placeholder="0"
//                                                 className="w-20 px-3 py-3 border-2 border-gray-300 rounded-lg focus:border-mainColor focus:ring-2 focus:ring-mainColor/20 text-center text-lg font-semibold"
//                                             />

//                                             {/* Division Symbol */}
//                                             <div className="flex flex-col items-center">
//                                                 <div className="w-10 h-0.5 bg-gray-400 mb-1"></div>
//                                                 <FaDivide className="text-gray-500 text-sm" />
//                                                 <div className="w-10 h-0.5 bg-gray-400 mt-1"></div>
//                                             </div>

//                                             {/* Denominator Input */}
//                                             <input
//                                                 type="number"
//                                                 value={denominator}
//                                                 onChange={(e) => handleGridInFraction(currentQuestion.id, numerator, e.target.value)}
//                                                 placeholder="0"
//                                                 className="w-20 px-3 py-3 border-2 border-gray-300 rounded-lg focus:border-mainColor focus:ring-2 focus:ring-mainColor/20 text-center text-lg font-semibold"
//                                             />
//                                         </div>

//                                         {/* Clear Button */}
//                                         <button
//                                             onClick={() => clearFraction(currentQuestion.id)}
//                                             className="w-full py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium mt-2"
//                                         >
//                                             Clear
//                                         </button>
//                                     </div>

//                                     {/* Result Display */}
//                                     {(numerator || denominator) && (
//                                         <div className="bg-green-50 border border-green-200 rounded-xl p-4">
//                                             <div className="text-center">
//                                                 <span className="text-green-800 font-medium block mb-2">Your fraction:</span>
//                                                 <div className="flex items-center justify-center gap-4">
//                                                     <span className="text-green-900 font-bold text-2xl">
//                                                         {numerator || '0'}
//                                                     </span>
//                                                     <span className="text-green-900 font-bold text-xl">/</span>
//                                                     <span className="text-green-900 font-bold text-2xl">
//                                                         {denominator || '0'}
//                                                     </span>
//                                                 </div>
//                                                 {calculatedResult && (
//                                                     <div className="mt-3 pt-3 border-t border-green-200">
//                                                         <span className="text-green-700 font-medium">Decimal value: </span>
//                                                         <span className="text-green-900 font-bold text-lg">
//                                                             {calculatedResult}
//                                                         </span>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Navigation Buttons */}
//                 <div className="flex justify-between items-center mt-6">
//                     <button
//                         onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
//                         disabled={currentQuestionIndex === 0}
//                         className="flex items-center gap-2 px-4 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium"
//                     >
//                         <FaChevronLeft className="text-sm" />
//                         Previous
//                     </button>

//                     <div className="text-sm text-gray-500 font-medium">
//                         Question {currentQuestionIndex + 1} of {totalQuestions}
//                     </div>

//                     {isLastQuestion ? (
//                         <button
//                             onClick={() => setShowSubmitModal(true)}
//                             className="flex items-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
//                         >
//                             <FaPaperPlane className="text-xs" />
//                             Submit
//                         </button>
//                     ) : (
//                         <button
//                             onClick={() => setCurrentQuestionIndex((prev) => Math.min(prev + 1, totalQuestions - 1))}
//                             className="flex items-center gap-2 px-4 py-3 bg-mainColor text-white rounded-xl hover:bg-mainColor/90 transition-colors font-medium"
//                         >
//                             Next
//                             <FaChevronRight className="text-sm" />
//                         </button>
//                     )}
//                 </div>
//             </div>

//             {/* Submit Confirmation Modal */}
//             {showSubmitModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//                     <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
//                         <h3 className="text-xl font-bold text-gray-900 mb-4">Submit Exam</h3>
//                         <p className="text-gray-600 mb-6">
//                             Are you sure you want to submit your exam? You have answered{' '}
//                             <span className="font-semibold text-mainColor">
//                                 {Object.keys(answers).length} out of {totalQuestions}
//                             </span>{' '}
//                             questions.
//                         </p>
//                         <div className="flex gap-3">
//                             <button
//                                 onClick={() => setShowSubmitModal(false)}
//                                 className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={handleSubmit}
//                                 disabled={loadingPost}
//                                 className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
//                             >
//                                 {loadingPost ? 'Submitting...' : 'Submit'}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Exam;

import React, { useEffect, useState, useRef } from 'react';
import { useGet } from '../../Hooks/useGet';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaClock, FaChevronLeft, FaChevronRight, FaDivide, FaCheck, FaPaperPlane, FaSquareRootAlt, FaSuperscript, FaPercentage, FaCalculator, FaHashtag } from 'react-icons/fa';
import { PiMathOperationsBold } from 'react-icons/pi';
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
    const [showMathOperator, setShowMathOperator] = useState(false);
    const [currentExpression, setCurrentExpression] = useState('');
    const [selectedOperator, setSelectedOperator] = useState(null);
    const [operatorValue, setOperatorValue] = useState('');
    const [fractionNum, setFractionNum] = useState('');
    const [fractionDen, setFractionDen] = useState('');
    const [directNumber, setDirectNumber] = useState('');
    const [activeTab, setActiveTab] = useState('number');
    const questionBarRef = useRef(null);
    const navigate = useNavigate();

    // Math operators with their templates
    const mathOperators = [
        {
            symbol: '√',
            name: 'square root',
            display: '√',
            template: '√({value})',
            description: 'Square Root',
            inputType: 'single',
            placeholder: '√( )',
            icon: FaSquareRootAlt
        },
        {
            symbol: '∛',
            name: 'cube root',
            display: '∛',
            template: '∛({value})',
            description: 'Cube Root',
            inputType: 'single',
            placeholder: '∛( )',
            icon: FaSquareRootAlt
        },
        {
            symbol: 'e',
            name: 'euler',
            display: 'e^',
            template: 'e^{value}',
            description: 'Euler\'s Number Power',
            inputType: 'single',
            placeholder: 'e^',
            icon: FaSuperscript
        },
        {
            symbol: 'log',
            name: 'logarithm',
            display: 'log',
            template: 'log({value})',
            description: 'Logarithm Base 10',
            inputType: 'single',
            placeholder: 'log( )',
            icon: FaCalculator
        },
        {
            symbol: 'ln',
            name: 'natural log',
            display: 'ln',
            template: 'ln({value})',
            description: 'Natural Logarithm',
            inputType: 'single',
            placeholder: 'ln( )',
            icon: FaCalculator
        },
        {
            symbol: '| |',
            name: 'absolute',
            display: '|x|',
            template: '|{value}|',
            description: 'Absolute Value',
            inputType: 'single',
            placeholder: '| |',
            icon: FaHashtag
        },
        {
            symbol: '/',
            name: 'fraction',
            display: 'a/b',
            template: '{numerator}/{denominator}',
            description: 'Fraction',
            inputType: 'fraction',
            placeholder: 'a/b',
            icon: FaDivide
        },
        {
            symbol: '^',
            name: 'exponent',
            display: 'x^y',
            template: '({base})^{exponent}',
            description: 'Exponent',
            inputType: 'single',
            needsBase: true,
            placeholder: 'x^y',
            icon: FaSuperscript
        },
        {
            symbol: 'π',
            name: 'pi',
            display: 'π',
            template: 'π',
            description: 'Pi Constant',
            inputType: 'constant',
            placeholder: 'π',
            icon: FaHashtag
        },
        {
            symbol: '%',
            name: 'modulo',
            display: 'mod',
            template: '({value}) % {modulus}',
            description: 'باقي القسمة',
            inputType: 'modulo',
            placeholder: 'a % b',
            icon: FaPercentage
        },
    ];

    useEffect(() => {
        refetchExam();
    }, [refetchExam]);

    useEffect(() => {
        if (dataExam && !loadingExam) {
            setDiaExam(dataExam.exam || []);
        }
    }, [dataExam, loadingExam]);

    useEffect(() => {
        if (response && response.data && !loadingPost) {
            navigate(`/exam/results/${response.data.exam?.id}`, { state: { examData: response.data, timer: formatTime(timeElapsed) } });
        }
    }, [response, loadingPost, navigate]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeElapsed((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (questionBarRef.current) {
            questionBarRef.current.scrollLeft = 0;
        }
    }, [diaExam]);

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

    useEffect(() => {
        const currentQuestionId = diaExam[currentQuestionIndex]?.id;
        if (currentQuestionId) {
            const storedValue = gridInValues[currentQuestionId];
            if (storedValue && typeof storedValue === 'string') {
                if (storedValue.includes('/')) {
                    const [num, denom] = storedValue.split('/');
                    setNumerator(num || '');
                    setDenominator(denom || '');
                    setCurrentExpression('');
                } else {
                    setCurrentExpression(storedValue);
                    setNumerator('');
                    setDenominator('');
                }
            } else {
                setNumerator('');
                setDenominator('');
                setCurrentExpression('');
            }
        } else {
            setNumerator('');
            setDenominator('');
            setCurrentExpression('');
        }
    }, [currentQuestionIndex, diaExam, gridInValues]);

    // Auto-calculate when operator value changes
    useEffect(() => {
        if (selectedOperator && operatorValue && selectedOperator.inputType === 'single') {
            const timeoutId = setTimeout(() => {
                applyOperator(selectedOperator, operatorValue);
            }, 500);
            return () => clearTimeout(timeoutId);
        }
    }, [operatorValue, selectedOperator]);

    // Auto-calculate when fraction values change
    useEffect(() => {
        if (selectedOperator && selectedOperator.inputType === 'fraction' && fractionNum && fractionDen && fractionDen !== '0') {
            const timeoutId = setTimeout(() => {
                applyOperator(selectedOperator, '');
            }, 500);
            return () => clearTimeout(timeoutId);
        }
    }, [fractionNum, fractionDen, selectedOperator]);

    // Auto-calculate when modulo values change
    useEffect(() => {
        if (selectedOperator && selectedOperator.inputType === 'modulo' && operatorValue && fractionNum) {
            const timeoutId = setTimeout(() => {
                applyOperator(selectedOperator, operatorValue);
            }, 500);
            return () => clearTimeout(timeoutId);
        }
    }, [operatorValue, fractionNum, selectedOperator]);

    const handleMCQAnswer = (questionId, mcqNum) => {
        setAnswers((prev) => ({ ...prev, [questionId]: mcqNum }));
    };

    const calculateExpressionResult = (expression) => {
        if (!expression || typeof expression !== 'string') return '';

        try {
            let jsExpression = expression
                .replace(/√/g, 'Math.sqrt')
                .replace(/∛/g, 'Math.cbrt')
                .replace(/π/g, 'Math.PI')
                .replace(/e\^/g, 'Math.exp')
                .replace(/log/g, 'Math.log10')
                .replace(/ln/g, 'Math.log')
                .replace(/\|(.*?)\|/g, 'Math.abs($1)')
                .replace(/\^/g, '**')
                .replace(/mod/g, '%'); // Handle modulo

            // Handle e^ specifically (Math.exp takes one argument)
            if (jsExpression.includes('Math.exp')) {
                jsExpression = jsExpression.replace(/Math.exp(\d+(\.\d+)?)/g, 'Math.exp($1)');
            }

            if (jsExpression.includes('/')) {
                const parts = jsExpression.split('/');
                if (parts.length === 2) {
                    const num = eval(parts[0]);
                    const denom = eval(parts[1]);
                    if (denom !== 0) {
                        jsExpression = `(${num})/(${denom})`;
                    }
                }
            }

            let result = eval(jsExpression);

            if (isNaN(result)) return '';
            if (!isFinite(result)) return result > 0 ? '∞' : '-∞';

            if (Number.isInteger(result)) {
                return result.toString();
            } else {
                const tolerance = 1e-10;
                for (let denom = 1; denom <= 100; denom++) {
                    for (let num = -1000; num <= 1000; num++) {
                        const fractionValue = num / denom;
                        if (Math.abs(result - fractionValue) < tolerance) {
                            return num + '/' + denom;
                        }
                    }
                }
                return Math.abs(result - Math.round(result)) < tolerance ?
                    Math.round(result).toString() :
                    result.toFixed(3);
            }
        } catch (error) {
            return '';
        }
    };

    const handleOperatorSelect = (operator) => {
        setSelectedOperator(operator);
        setOperatorValue('');
        setFractionNum('');
        setFractionDen('');
        setShowMathOperator(false);

        if (operator.inputType === 'constant') {
            applyOperator(operator, '');
        }
    };

    const applyOperator = (operator, value) => {
        let newExpression = '';

        if (operator.inputType === 'constant') {
            newExpression = operator.symbol;
        } else if (operator.inputType === 'fraction') {
            if (fractionNum && fractionDen && fractionDen !== '0') {
                newExpression = `${fractionNum}/${fractionDen}`;
            }
        } else if (operator.inputType === 'modulo') {
            if (operatorValue && fractionNum) {
                newExpression = `${operatorValue} % ${fractionNum}`;
            }
        } else if (operator.needsBase) {
            if (value && currentExpression) {
                newExpression = `(${currentExpression})^{${value}}`;
            }
        } else {
            if (value) {
                if (operator.symbol === 'e') {
                    newExpression = `e^${value}`;
                } else {
                    newExpression = operator.template.replace('{value}', value);
                }
            }
        }

        if (newExpression) {
            setCurrentExpression(newExpression);
            updateAnswerWithExpression(newExpression);
        }
    };

    const handleDirectNumberSubmit = () => {
        if (directNumber) {
            setCurrentExpression(directNumber);
            updateAnswerWithExpression(directNumber);
            setDirectNumber('');
        }
    };

    const updateAnswerWithExpression = (expression) => {
        const currentQuestionId = diaExam[currentQuestionIndex]?.id;
        if (!currentQuestionId) return;

        const calculatedValue = calculateExpressionResult(expression);

        setGridInValues(prev => ({
            ...prev,
            [currentQuestionId]: expression
        }));

        setAnswers((prev) => ({
            ...prev,
            [currentQuestionId]: calculatedValue
        }));
    };

    const handleGridInFraction = (questionId, num, denom) => {
        setNumerator(num);
        setDenominator(denom);

        let finalValue = '';
        let fractionDisplayValue = '';

        if (num && denom && denom !== '0') {
            fractionDisplayValue = `${num}/${denom}`;
            const calculatedValue = calculateExpressionResult(fractionDisplayValue);
            finalValue = calculatedValue || fractionDisplayValue;
        } else if (num && (!denom || denom === '')) {
            fractionDisplayValue = num;
            finalValue = num;
        }

        setGridInValues(prev => ({ ...prev, [questionId]: fractionDisplayValue }));
        setAnswers((prev) => ({ ...prev, [currentQuestionId]: finalValue }));
    };

    const clearInput = (questionId) => {
        setNumerator('');
        setDenominator('');
        setCurrentExpression('');
        setSelectedOperator(null);
        setOperatorValue('');
        setFractionNum('');
        setFractionDen('');
        setDirectNumber('');
        setAnswers((prev) => ({ ...prev, [questionId]: '' }));
        setGridInValues(prev => ({ ...prev, [questionId]: '' }));
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSubmit = () => {
        const formData = new FormData();
        let exam_id = '';
        diaExam.forEach((question, index) => {
            if (question && question.id) {
                let answer = answers[question.id] || '';
                formData.append(`answers[${index}]`, answer);
                if (index === 0) {
                    exam_id = question.pivot?.diagnostic_exam_id || courseId;
                }
            }
        });
        formData.append('timer', formatTime(timeElapsed));
        formData.append('exam_id', exam_id);
        postData(formData, "Exam submitted successfully");
        setShowSubmitModal(false);
    };

    const isLastQuestion = currentQuestionIndex === diaExam.length - 1;

    if (loadingExam) {
        return (
            <div className="h-screen flex justify-center items-center bg-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-mainColor mx-auto mb-2"></div>
                    <p className="text-gray-600 font-medium text-base">Loading Exam...</p>
                </div>
            </div>
        );
    }

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

    const currentQuestion = diaExam[currentQuestionIndex];
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
    const currentGridInValue = gridInValues[currentQuestion.id];
    const calculatedResult = calculateExpressionResult(currentGridInValue);

    return (
        <div className="h-full bg-white px-2 md:px-4 lg:px-6 flex flex-col">
            <div className="w-full h-full flex flex-col">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow p-4 mb-2 flex-shrink-0">
                    <div className="flex flex-row justify-between items-center gap-2">
                        <div className="bg-mainColor/10 text-mainColor px-3 py-1 rounded-lg font-semibold text-sm">
                            Question {currentQuestionIndex + 1}/{totalQuestions}
                        </div>
                        <div className="flex items-center gap-2 bg-mainColor/10 px-3 py-1 rounded-lg">
                            <FaClock className="text-mainColor text-sm" />
                            <span className="text-base font-bold text-gray-800 font-mono">
                                {formatTime(timeElapsed)}
                            </span>
                        </div>
                    </div>
                    <div className="mt-2">
                        <div className="flex gap-3 mb-1">
                            <span className="text-xs text-gray-600 font-medium">Questions:</span>
                            <span className="text-xs text-gray-600">
                                {Object.keys(answers).length}/{totalQuestions} answered
                            </span>
                        </div>
                        <div
                            ref={questionBarRef}
                            className="flex overflow-x-auto gap-1 py-1 px-1 scrollbar-thin scrollbar-thumb-red-300 scrollbar-track-red-100"
                        >
                            {diaExam.map((question, index) => {
                                const uniqueKey = question?.id ? `${question.id}-${index}` : `question-${index}`;
                                return (
                                    <button
                                        key={uniqueKey}
                                        onClick={() => setCurrentQuestionIndex(index)}
                                        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-semibold transition-all duration-200 transform hover:scale-105
                                            ${index === currentQuestionIndex
                                                ? 'bg-mainColor text-white shadow'
                                                : question && answers[question.id]
                                                    ? 'bg-green-500 text-white shadow'
                                                    : 'bg-white border border-gray-300 text-gray-700 hover:border-mainColor hover:text-mainColor'
                                            } text-sm`}
                                    >
                                        {index + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-xl shadow flex-1 flex flex-col">
                    <div className="flex flex-col lg:flex-row">
                        {/* Question Section */}
                        <div className="lg:w-3/4 p-2 border-r border-gray-200 flex-1">
                            <h3 className="text-base font-semibold text-gray-700 mb-2">
                                Question {currentQuestionIndex + 1}
                            </h3>
                            {currentQuestion.q_image ? (
                                <div className="bg-gray-50 w-full rounded-lg p-2">
                                    <img
                                        src={currentQuestion.q_image}
                                        alt={`Question ${currentQuestionIndex + 1}`}
                                        className="w-full h-auto max-h-64 object-fit rounded-lg"
                                    />
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-lg p-3 h-32 overflow-hidden">
                                    <div
                                        className="text-gray-800 text-base leading-tight prose max-w-none"
                                        dangerouslySetInnerHTML={{ __html: currentQuestion.question || 'No question content available' }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Answer Section */}
                        <div className="lg:w-1/4 p-2 md:p-4 flex-shrink-0">
                            <h3 className="text-base font-semibold text-gray-700 mb-3">Your Answer</h3>

                            {currentQuestion.ans_type === 'MCQ' ? (
                                <div className="space-y-2">
                                    {currentQuestion.mcq && currentQuestion.mcq.map((option) => {
                                        const optionKey = option?.id ? `option-${option.id}` : `option-${Math.random()}`;
                                        return (
                                            <label
                                                key={optionKey}
                                                className={`flex items-center p-2 rounded-lg border transition-all duration-200 cursor-pointer
                                                    ${answers[currentQuestion.id] === option.mcq_num
                                                        ? 'bg-mainColor/10 border-mainColor shadow'
                                                        : 'bg-white border-gray-200 hover:border-mainColor hover:bg-mainColor/5'
                                                    }`}
                                            >
                                                <div className="relative h-4 w-4">
                                                    <input
                                                        type="radio"
                                                        name={`question-${currentQuestion.id}`}
                                                        checked={answers[currentQuestion.id] === option.mcq_num}
                                                        onChange={() => handleMCQAnswer(currentQuestion.id, option.mcq_num)}
                                                        className="appearance-none h-4 w-4 border rounded-full border-gray-300 checked:border-mainColor focus:outline-none transition-colors"
                                                    />
                                                    {answers[currentQuestion.id] === option.mcq_num && (
                                                        <FaCheck className="absolute top-0.5 left-0.5 text-mainColor text-xs" />
                                                    )}
                                                </div>
                                                <span className="ml-2 text-gray-800 font-medium text-base">
                                                    {option.mcq_num}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {/* Tab Navigation - Creative Labels */}
                                    <div className="w-full flex bg-gray-100 rounded-lg p-1">
                                        <button
                                            onClick={() => setActiveTab('number')}
                                            className={`flex-1 py-2 px-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1 ${activeTab === 'number'
                                                ? 'bg-white text-mainColor shadow-sm'
                                                : 'text-gray-600 hover:text-gray-800'
                                                }`}
                                        >
                                            <FaHashtag className="text-xs" />
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('expression')}
                                            className={`flex-1 py-2 px-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1 ${activeTab === 'expression'
                                                ? 'bg-white text-mainColor shadow-sm'
                                                : 'text-gray-600 hover:text-gray-800'
                                                }`}
                                        >
                                            <PiMathOperationsBold className="text-sm" />
                                        </button>
                                    </div>

                                    {/* Number Tab Content */}
                                    {activeTab === 'number' && (
                                        <div className="space-y-3">
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                                <input
                                                    type="number"
                                                    value={directNumber}
                                                    onChange={(e) => setDirectNumber(e.target.value)}
                                                    placeholder="Enter number..."
                                                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:border-blue-500 text-center text-base font-semibold"
                                                />
                                                <button
                                                    onClick={handleDirectNumberSubmit}
                                                    disabled={!directNumber}
                                                    className="w-full mt-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm disabled:opacity-50"
                                                >
                                                    Set Answer
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Expression Tab Content - COMPACT DESIGN */}
                                    {activeTab === 'expression' && (
                                        <div className="space-y-2">
                                            {/* Operator Selection - Compact */}
                                            <div className="relative">
                                                <button
                                                    onClick={() => setShowMathOperator(!showMathOperator)}
                                                    className="w-full py-2 bg-gray-50 border border-gray-300 rounded-lg hover:border-mainColor transition-colors text-sm flex items-center justify-center gap-2"
                                                >
                                                    <PiMathOperationsBold className="text-mainColor" />
                                                    <span className="text-gray-700">
                                                        {selectedOperator ? selectedOperator.display : 'Select Function'}
                                                    </span>
                                                </button>

                                                {showMathOperator && (
                                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-2 grid grid-cols-3 gap-1 max-h-40 overflow-y-auto">
                                                        {mathOperators.map((operator, index) => {
                                                            const IconComponent = operator.icon;
                                                            return (
                                                                <button
                                                                    key={index}
                                                                    onClick={() => handleOperatorSelect(operator)}
                                                                    className="p-2 bg-white hover:bg-mainColor/10 rounded border border-gray-200 transition-colors text-center"
                                                                    title={operator.description}
                                                                >
                                                                    <IconComponent className="text-mainColor text-sm mx-auto mb-1" />
                                                                    <div className="text-xs font-semibold text-gray-800">
                                                                        {operator.display}
                                                                    </div>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>

                                            {selectedOperator && selectedOperator.inputType === 'single' && (
                                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-sm font-medium text-green-800 whitespace-nowrap">
                                                            {selectedOperator.display}
                                                        </span>
                                                        <input
                                                            type="number"
                                                            value={operatorValue}
                                                            onChange={(e) => setOperatorValue(e.target.value)}
                                                            placeholder="Value"
                                                            className="w-full px-2 py-1 border border-green-300 rounded text-center text-sm font-semibold"
                                                        />
                                                    </div>
                                                    {operatorValue && (
                                                        <div className="text-xs text-green-600 text-center">
                                                            Auto-calculating...
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {/* Fraction Input - Compact */}
                                            {selectedOperator && selectedOperator.inputType === 'fraction' && (
                                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                                                    <div className="flex items-center justify-center gap-2 mb-2">
                                                        <input
                                                            type="number"
                                                            value={fractionNum}
                                                            onChange={(e) => setFractionNum(e.target.value)}
                                                            placeholder="Num"
                                                            className="w-12 px-2 py-1 border border-purple-300 rounded text-center text-sm font-semibold"
                                                        />
                                                        <FaDivide className="text-purple-500 text-xs" />
                                                        <input
                                                            type="number"
                                                            value={fractionDen}
                                                            onChange={(e) => setFractionDen(e.target.value)}
                                                            placeholder="Den"
                                                            className="w-12 px-2 py-1 border border-purple-300 rounded text-center text-sm font-semibold"
                                                        />
                                                    </div>
                                                    {(fractionNum || fractionDen) && (
                                                        <div className="text-xs text-purple-600 text-center">
                                                            Auto-calculating...
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {/* Modulo Input */}
                                            {selectedOperator && selectedOperator.inputType === 'modulo' && (
                                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                                                    <div className="flex items-center justify-center gap-2 mb-2">
                                                        <input
                                                            type="number"
                                                            value={operatorValue}
                                                            onChange={(e) => setOperatorValue(e.target.value)}
                                                            placeholder="Num"
                                                            className="w-12 px-2 py-1 border border-purple-300 rounded text-center text-sm font-semibold"
                                                        />
                                                         %
                                                        <input
                                                            type="number"
                                                            value={fractionNum}
                                                            onChange={(e) => setFractionNum(e.target.value)}
                                                            placeholder="Den"
                                                            className="w-12 px-2 py-1 border border-purple-300 rounded text-center text-sm font-semibold"
                                                        />
                                                    </div>

                                                    {(operatorValue || fractionNum) && (
                                                        <div className="text-xs text-orange-600 text-center mb-2">
                                                            Auto-calculating...
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Result Display - Compact */}
                                    {calculatedResult && (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                                            <div className="text-center">
                                                <div className="text-green-900 font-bold text-sm">
                                                    {(activeTab === 'number' && directNumber >= 0) ? calculatedResult : `${currentExpression} = ${calculatedResult}`}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {/* Clear Button */}
                                    <button
                                        onClick={() => clearInput(currentQuestion.id)}
                                        className="w-full py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
                                    >
                                        Clear
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-2 flex-shrink-0">
                    <button
                        onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
                        disabled={currentQuestionIndex === 0}
                        className="flex items-center gap-1 px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium text-sm"
                    >
                        <FaChevronLeft className="text-xs" />
                        Previous
                    </button>
                    <div className="text-xs text-gray-500 font-medium">
                        Question {currentQuestionIndex + 1}/{totalQuestions}
                    </div>
                    {isLastQuestion ? (
                        <button
                            onClick={() => setShowSubmitModal(true)}
                            className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                        >
                            <FaPaperPlane className="text-xs" />
                            Submit
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentQuestionIndex((prev) => Math.min(prev + 1, totalQuestions - 1))}
                            className="flex items-center gap-1 px-3 py-2 bg-mainColor text-white rounded-lg hover:bg-mainColor/90 transition-colors font-medium text-sm"
                        >
                            Next
                            <FaChevronRight className="text-xs" />
                        </button>
                    )}
                </div>
            </div>

            {/* Submit Confirmation Modal */}
            {showSubmitModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
                    <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Submit Exam</h3>
                        <p className="text-gray-600 mb-4 text-sm">
                            Sure to submit? Answered{' '}
                            <span className="font-semibold text-mainColor">
                                {Object.keys(answers).length}/{totalQuestions}
                            </span>{' '}
                            questions.
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowSubmitModal(false)}
                                className="flex-1 px-3 py-1 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loadingPost}
                                className="flex-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm disabled:opacity-50"
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