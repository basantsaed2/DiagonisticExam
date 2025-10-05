import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCheckCircle, FaSpinner, FaUpload } from "react-icons/fa";
import mainLogo from "../../assets/Images/mainLogo.png";
import { useGet } from "../../Hooks/useGet";
import { usePost } from "../../Hooks/usePost";
import { useAuth } from "../../Context/Auth";

const BuyChapter = () => {
    const { state } = useLocation();
    const examData = state?.examData || null;
    const selectedChapterIds = state?.selectedChapterIds || [];
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const auth = useAuth();
    const navigate = useNavigate();

    const { refetch: refetchPaymentMethod, loading: loadingPaymentMethod, data: dataPaymentMethod } = useGet({
        url: `${apiUrl}/user/payment_methods_list`,
    });

    const { refetch: refetchCurrencies, loading: loadingCurrencies, data: dataCurrencies } = useGet({
        url: `${apiUrl}/user/currencies_list`,
    });

    const { postData, loading: loadingPost, response } = usePost({
        url: `${apiUrl}/user/courses/buy_chapters`,
    });

    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

    const [currencies, setCurrencies] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState("");

    const [chapterDurations, setChapterDurations] = useState({});
    const [receiptFile, setReceiptFile] = useState(null);
    const [receiptPreview, setReceiptPreview] = useState(null);

    useEffect(() => {
        refetchPaymentMethod();
        refetchCurrencies();
    }, [refetchPaymentMethod, refetchCurrencies]);

    useEffect(() => {
        if (dataPaymentMethod && !loadingPaymentMethod) {
            setPaymentMethods(dataPaymentMethod.payment_methods || []);
            if (dataPaymentMethod.payment_methods?.length > 0) {
                setSelectedPaymentMethod(dataPaymentMethod.payment_methods[0].id.toString());
            }
        }
    }, [dataPaymentMethod, loadingPaymentMethod]);

    useEffect(() => {
        if (dataCurrencies && !loadingCurrencies) {
            setCurrencies(dataCurrencies.currencies || []);
            if (dataCurrencies.currencies?.length > 0) {
                // Set USD as default selected currency
                const usdCurrency = dataCurrencies.currencies.find(c => c.currency === "USD");
                if (usdCurrency) {
                    setSelectedCurrency(usdCurrency.id.toString());
                } else {
                    setSelectedCurrency(dataCurrencies.currencies[0].id.toString());
                }
            }
        }
    }, [dataCurrencies, loadingCurrencies]);

    useEffect(() => {
        if (response && response.data && !loadingPost) {
            if (selectedPaymentDetails.payment === "Paymob" && selectedPaymentDetails.id === 10) {
                // Open payment link in a new tab
                window.open(response.data?.payment_link, '_blank');
            } else {
                auth.toastSuccess("Purchase successful!");
                navigate('/courses');
            }
        }
    }, [response, loadingPost, navigate]);

    useEffect(() => {
        if (examData?.recommanditions?.length > 0 && selectedChapterIds.length > 0) {
            const initialDurations = {};
            examData.recommanditions.forEach((chapter) => {
                if (selectedChapterIds.includes(chapter.id)) {
                    const minDuration = chapter.price.reduce(
                        (min, p) => (p.duration < min.duration ? p : min),
                        chapter.price[0]
                    );
                    initialDurations[chapter.id] = minDuration.duration;
                }
            });
            setChapterDurations(initialDurations);
        }
    }, [examData, selectedChapterIds]);

    // Calculate total amount in USD (original)
    const calculateTotalAmount = () => {
        return selectedChapterIds
            .reduce((total, chapterId) => {
                const chapter = examData.recommanditions.find((c) => c.id === chapterId);
                if (!chapter) return total;
                const selectedPrice = chapter.price.find(
                    (p) => p.duration === chapterDurations[chapterId]
                );
                return total + (selectedPrice ? parseFloat(selectedPrice.price) : 0);
            }, 0)
            .toFixed(2);
    };

    // Calculate total amount in selected currency
    const calculateTotalInSelectedCurrency = () => {
        const totalUSD = parseFloat(calculateTotalAmount());
        const selectedCurr = currencies.find(c => c.id.toString() === selectedCurrency);

        if (!selectedCurr) return "0.00";

        // Convert USD to selected currency
        const amountInSelectedCurrency = (totalUSD * selectedCurr.amount).toFixed(2);
        return amountInSelectedCurrency;
    };

    // Calculate total amount in EGP
    const calculateTotalInEGP = () => {
        const totalUSD = parseFloat(calculateTotalAmount());
        const egpCurrency = currencies.find(c => c.currency === "EGP");

        if (!egpCurrency) return "0.00";

        return (totalUSD * egpCurrency.amount).toFixed(2);
    };

    const handleDurationChange = (chapterId, duration) => {
        setChapterDurations((prev) => ({
            ...prev,
            [chapterId]: parseInt(duration),
        }));
    };

    const handleReceiptUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                auth.toastError("Please upload an image file (PNG, JPG, JPEG)");
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                auth.toastError("File size too large. Please upload an image smaller than 5MB");
                return;
            }

            setReceiptFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setReceiptPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeReceipt = () => {
        setReceiptFile(null);
        setReceiptPreview(null);
    };

    const handlePurchase = async () => {
        if (!selectedPaymentMethod) {
            auth.toastError("Please select a payment method.");
            return;
        }
        if (selectedChapterIds.length === 0) {
            auth.toastError("No chapters selected.");
            return;
        }

        const selectedMethod = paymentMethods.find(
            (method) => method.id.toString() === selectedPaymentMethod
        );

        if (
            selectedMethod &&
            selectedMethod.payment !== "Paymob" &&
            selectedMethod.id !== 10 &&
            !receiptFile
        ) {
            auth.toastError("Please upload a payment receipt.");
            return;
        }

        // Prepare form data - always use USD amount for backend
        const payload = {
            course_id: examData.exam?.course_id || "18",
            amount: calculateTotalAmount(), // Send USD amount
            payment_method_id: selectedPaymentMethod,
            chapters: selectedChapterIds.map((chapterId, index) => ({
                [`chapters[${index}][chapter_id]`]: chapterId,
                [`chapters[${index}][duration]`]: chapterDurations[chapterId],
            })),
        };

        if (receiptFile && selectedMethod.payment !== "Paymob" && selectedMethod.id !== 10) {
            payload.image = receiptPreview;
        }

        const flattenedPayload = {
            course_id: payload.course_id,
            amount: payload.amount,
            payment_method_id: payload.payment_method_id,
        };
        payload.chapters.forEach((chapter, index) => {
            flattenedPayload[`chapters[${index}][chapter_id]`] = chapter[`chapters[${index}][chapter_id]`];
            flattenedPayload[`chapters[${index}][duration]`] = chapter[`chapters[${index}][duration]`];
        });
        if (payload.image) {
            flattenedPayload.image = payload.image;
        }

        try {
            await postData(flattenedPayload);
            setReceiptFile(null);
            setReceiptPreview(null);
        } catch (error) {
            console.error("Purchase failed:", error);
            auth.toastError("Failed to process purchase. Please try again.");
        }
    };

    if (loadingPaymentMethod || !examData) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-200">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-mainColor mx-auto mb-4"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    if (!paymentMethods.length || selectedChapterIds.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
                <div className="text-center p-6 bg-white rounded-xl shadow-lg animate-fade-in">
                    <img src={mainLogo} alt="Main Logo" className="mx-auto h-24 mb-4 opacity-80" />
                    <p className="text-gray-600 text-xl font-semibold">
                        {paymentMethods.length ? "No Chapters Selected" : "No Payment Methods Available"}
                    </p>
                    <p className="text-gray-500 mt-2">Please try again or select chapters from the exam results.</p>
                    <Link
                        to="/exam-result"
                        state={{ examData }}
                        className="mt-4 inline-flex items-center gap-2 px-6 py-2 bg-mainColor text-white rounded-lg hover:bg-mainColor/90 transition-colors"
                    >
                        <FaArrowLeft />
                        Back to Exam Results
                    </Link>
                </div>
            </div>
        );
    }

    const selectedChapters = examData.recommanditions.filter((chapter) =>
        selectedChapterIds.includes(chapter.id)
    );

    const selectedPaymentDetails = paymentMethods.find(method =>
        method.id.toString() === selectedPaymentMethod
    );

    const requiresReceiptUpload = selectedPaymentDetails &&
        selectedPaymentDetails.payment !== "Paymob" &&
        selectedPaymentDetails.id !== 10;

    const selectedCurrencyObj = currencies.find(c => c.id.toString() === selectedCurrency);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-8 px-4 sm:px-6 lg:px-8">
            <div className="w-full">
                <div className="w-full bg-white rounded-2xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <img src={mainLogo} alt="Main Logo" className="mx-auto h-16 mb-4" />
                        <h1 className="text-3xl font-bold text-mainColor">Purchase Chapters</h1>
                        <p className="text-gray-600 mt-2">Review and purchase your selected chapters</p>
                        <div className="mt-4 bg-mainColor/10 inline-flex items-center gap-2 px-4 py-2 rounded-lg">
                            <span className="font-semibold text-gray-700">{examData.exam_name}</span>
                            <span className="text-gray-500">•</span>
                            <span className="text-mainColor font-semibold">{selectedChapters.length} chapters selected</span>
                        </div>
                    </div>

                    <div className="flex lg:flex-row flex-col gap-8 mb-8">
                        {/* Selected Chapters Section */}
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Selected Chapters</h2>
                            <div className="grid gap-4">
                                {selectedChapters.map((chapter) => (
                                    <div
                                        key={chapter.id}
                                        className="p-6 rounded-xl border-2 border-mainColor/20 bg-mainColor/5"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-800 text-lg">{chapter.chapter_name}</h3>
                                                <p className="text-gray-500 mt-1">Minimum price: ${chapter.min_price}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <select
                                                    value={chapterDurations[chapter.id] || ""}
                                                    onChange={(e) => handleDurationChange(chapter.id, e.target.value)}
                                                    className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-mainColor focus:border-mainColor min-w-[180px]"
                                                >
                                                    {chapter.price.map((p) => (
                                                        <option key={p.id} value={p.duration}>
                                                            {p.duration} days - ${p.price}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="text-right">
                                                    <span className="text-lg font-bold text-mainColor">
                                                        $
                                                        {chapter.price.find(p => p.duration === chapterDurations[chapter.id])?.price ||
                                                            chapter.min_price}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Methods Section */}
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Payment Method</h2>
                            <div className="grid gap-4">
                                {paymentMethods.map((method) => (
                                    <div key={method.id}>
                                        <label
                                            className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPaymentMethod === method.id.toString()
                                                ? "border-mainColor bg-mainColor/10"
                                                : "border-gray-200 bg-gray-50 hover:border-mainColor/50"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value={method.id}
                                                checked={selectedPaymentMethod === method.id.toString()}
                                                onChange={() => setSelectedPaymentMethod(method.id.toString())}
                                                className="h-5 w-5 text-mainColor border-gray-300 focus:ring-mainColor"
                                            />
                                            <div className="ml-3 flex items-center gap-3">
                                                <img
                                                    src={method.logo_link}
                                                    alt={method.payment}
                                                    className="h-8 w-8 object-contain"
                                                    onError={(e) => {
                                                        e.target.src = mainLogo;
                                                        e.target.className = "h-8 w-8 object-contain opacity-50";
                                                    }}
                                                />
                                                <span className="text-gray-800 font-medium text-lg">{method.payment}</span>
                                            </div>
                                        </label>

                                        {selectedPaymentMethod === method.id.toString() && (
                                            <div className="mt-3 p-4 bg-red-50 rounded-xl border border-red-200">
                                                <h3 className="text-lg text-black mb-2">Payment Instructions</h3>
                                                <p className="text-gray-900 font-semibold">{method.description}</p>

                                                {/* Receipt Upload Section */}
                                                {requiresReceiptUpload && (
                                                    <div className="mt-4">
                                                        {!receiptPreview ? (
                                                            <div className="border-2 border-dashed border-red-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={handleReceiptUpload}
                                                                    className="hidden"
                                                                    id="receipt-upload"
                                                                />
                                                                <label
                                                                    htmlFor="receipt-upload"
                                                                    className="cursor-pointer block"
                                                                >
                                                                    <FaUpload className="text-red-400 text-2xl mx-auto mb-2" />
                                                                    <p className="text-red-600 text-sm">
                                                                        Click to upload receipt
                                                                    </p>
                                                                </label>
                                                            </div>
                                                        ) : (
                                                            <div className="border-2 border-green-300 rounded-lg p-4 bg-green-50">
                                                                <div className="flex items-center justify-between mb-3">
                                                                    <span className="text-sm font-medium text-green-700">
                                                                        Receipt Preview
                                                                    </span>
                                                                    <button
                                                                        onClick={removeReceipt}
                                                                        className="text-red-500 hover:text-red-700 text-sm"
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                </div>
                                                                <img
                                                                    src={receiptPreview}
                                                                    alt="Receipt preview"
                                                                    className="w-full max-w-xs h-32 object-contain rounded border mx-auto"
                                                                />
                                                                <p className="text-green-600 text-xs mt-2 text-center">
                                                                    ✓ Receipt uploaded successfully
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Paymob Note */}
                                                {/* {!requiresReceiptUpload && (
                                                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                                        <p className="text-green-700 text-sm text-center">
                                                            ✓ No receipt needed for Paymob payment
                                                        </p>
                                                    </div>
                                                )} */}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Currency Selection Section */}
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-semibold text-gray-800">Total in Other Currencies</h3>
                                    <select
                                        value={selectedCurrency}
                                        onChange={(e) => setSelectedCurrency(e.target.value)}
                                        className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {currencies.map((currency) => (
                                            <option key={currency.id} value={currency.id}>
                                                {currency.currency}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="bg-white rounded-lg p-3 border border-blue-300">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-blue-600">
                                            {calculateTotalInSelectedCurrency()} {selectedCurrencyObj?.currency}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            ${calculateTotalAmount()} USD • {calculateTotalInEGP()} EGP
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Total Amount Section (USD) */}
                    <div className="mb-8 p-6 bg-mainColor/5 rounded-xl border border-mainColor/20">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Total Amount (USD)</h2>
                        <p className="text-3xl font-bold text-mainColor">${calculateTotalAmount()}</p>
                        {/* <p className="text-lg text-gray-600 mt-2">
                            Equivalent to: <span className="font-semibold">{calculateTotalInEGP()} EGP</span>
                        </p> */}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col lg:flex-row gap-4 justify-center items-center">
                        <Link
                            to={-1}
                            state={{ examData }}
                            className="flex items-center gap-2 px-8 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                        >
                            <FaArrowLeft />
                            Back to Selection
                        </Link>
                        <button
                            onClick={handlePurchase}
                            disabled={loadingPost || selectedChapterIds.length === 0 || !selectedPaymentMethod || (requiresReceiptUpload && !receiptFile)}
                            className="flex items-center gap-2 px-8 py-3 bg-mainColor text-white rounded-lg hover:bg-mainColor/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loadingPost ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <FaCheckCircle />
                                    Complete Purchase (${calculateTotalAmount()})
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyChapter;