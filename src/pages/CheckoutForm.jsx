import React, { useState, useEffect, useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  FiCreditCard,
  FiLock,
  FiArrowLeft,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";
import { MdOutlineSchool, MdVerified } from "react-icons/md";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import axios from "axios";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ classData, amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();

  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
  });

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
        backgroundColor: "transparent",
      },
      invalid: {
        color: "#9e2146",
      },
    },
    hidePostalCode: true,
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Create payment intent on backend
      const intentResponse = await axios.post(
        `${import.meta.env.VITE_API}/create-payment-intent`,
        {
          amount: amount,
          classId: classData._id,
          studentUid: user.uid,
        }
      );

      if (!intentResponse.data.success) {
        throw new Error(intentResponse.data.message);
      }

      const { clientSecret } = intentResponse.data;

      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: billingDetails,
          },
        });

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // Process enrollment immediately after payment success
        try {
          const enrollmentResponse = await axios.post(
            `${import.meta.env.VITE_API}/process-enrollment`,
            {
              paymentIntentId: paymentIntent.id,
              classId: classData._id,
              studentUid: user.uid,
              studentName: billingDetails.name,
              studentEmail: billingDetails.email,
              amount: amount,
            }
          );

          if (!enrollmentResponse.data.success) {
            throw new Error(
              enrollmentResponse.data.message || "Enrollment failed"
            );
          }

          setSucceeded(true);
          setProcessing(false);
          toast.success(
            "Payment successful! You are now enrolled in the class."
          );

          // Call success callback
          onSuccess && onSuccess();

          // Redirect to enrolled classes after a short delay
          setTimeout(() => {
            navigate("/student-dashboard/my-enroll-classes");
          }, 2000);
        } catch (enrollmentError) {
          console.error("Enrollment error:", enrollmentError);
          setError(
            "Payment succeeded but enrollment failed. Please contact support."
          );
          setProcessing(false);
          toast.error(
            `Payment succeeded but enrollment failed. Please contact support with your payment ID: ${paymentIntent.id}`
          );
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Payment failed");
      setProcessing(false);
      toast.error("Payment failed. Please try again.");
    }
  };

  const handleCardChange = (event) => {
    setCardComplete(event.complete);
    setError(event.error ? event.error.message : "");
  };

  const handleBillingChange = (field, value) => {
    setBillingDetails((prev) => ({ ...prev, [field]: value }));
  };

  if (succeeded) {
    return (
      <div className="text-center py-8">
        <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
          <FiCheck className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Payment Successful!
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          You have been successfully enrolled in the class.
        </p>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-green-700 dark:text-green-400 text-sm">
            Redirecting you to your enrolled classes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Billing Details */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
          Billing Information
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={billingDetails.name}
              onChange={(e) => handleBillingChange("name", e.target.value)}
              className="w-full px-3 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-xl placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5D5CDE] focus:border-transparent transition-all duration-200"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={billingDetails.email}
              onChange={(e) => handleBillingChange("email", e.target.value)}
              className="w-full px-3 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-xl placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5D5CDE] focus:border-transparent transition-all duration-200"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>
      </div>

      {/* Card Details */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Card Information
        </label>
        <div className="border border-gray-300 dark:border-gray-600 rounded-xl p-4 bg-white dark:bg-gray-700">
          <CardElement
            options={cardElementOptions}
            onChange={handleCardChange}
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start space-x-3">
          <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 text-sm">
          <FiLock className="w-4 h-4" />
          <span>Your payment information is secure and encrypted</span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={
          !stripe || !cardComplete || processing || !billingDetails.name.trim()
        }
        className="w-full bg-gradient-to-r from-[#5D5CDE] to-[#4A4BC9] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-[#4A4BC9] hover:to-[#3A3AB9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5D5CDE] transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
      >
        {processing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Processing Payment...</span>
          </>
        ) : (
          <>
            <FiCreditCard className="w-5 h-5" />
            <span>Pay ${amount}</span>
          </>
        )}
      </button>
    </form>
  );
};

export const Payment = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const toast = useToast();

  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get class data from location state or fetch it
  useEffect(() => {
    if (location.state?.classData) {
      setClassData(location.state.classData);
      setLoading(false);
    } else if (id) {
      fetchClassData();
    } else {
      toast.error("No class information provided");
      navigate("/all-class");
    }
  }, [id, location.state]);

  const fetchClassData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/classes/${id}`
      );
      if (response.data.success) {
        setClassData(response.data.class);
      } else {
        throw new Error("Class not found");
      }
    } catch (error) {
      toast.error("Failed to load class information");
      navigate("/all-class");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    // Payment success handled in CheckoutForm
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5D5CDE]"></div>
              <span className="text-gray-600 dark:text-gray-300">
                Loading payment information...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Class information not found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Unable to load class details for payment.
            </p>
            <button
              onClick={() => navigate("/all-class")}
              className="bg-[#5D5CDE] hover:bg-[#4A4BC9] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Browse Classes
            </button>
          </div>
        </div>
      </div>
    );
  }

  const amount = location.state?.amount || classData.price;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-[#5D5CDE] dark:hover:text-[#5D5CDE] transition-colors duration-200"
          >
            <FiArrowLeft className="w-5 h-5 mr-2" />
            Back to Class Details
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Class Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Enrollment Summary
            </h2>

            {/* Class Info */}
            <div className="space-y-4 mb-6">
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <img
                  src={classData.image}
                  alt={classData.title}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src =
                      "https://i.ibb.co/GQzR5BLS/image-not-found.webp";
                  }}
                />
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {classData.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  Instructor: {classData.teacherName}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3">
                  {classData.description}
                </p>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center justify-between text-lg font-semibold text-gray-900 dark:text-white">
                <span>Total Amount</span>
                <span className="text-[#5D5CDE]">${amount}</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                One-time payment • Lifetime access
              </p>
            </div>

            {/* Benefits */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                What's included:
              </h4>
              <div className="space-y-2">
                {[
                  "Lifetime access to course materials",
                  "Certificate of completion",
                  "Direct instructor support",
                  "Community access",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <MdVerified className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 bg-[#5D5CDE] bg-opacity-10 rounded-2xl mx-auto mb-4">
                <MdOutlineSchool className="text-[#5D5CDE] text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Complete Payment
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Secure payment powered by Stripe
              </p>
            </div>

            <Elements stripe={stripePromise}>
              <CheckoutForm
                classData={classData}
                amount={amount}
                onSuccess={handlePaymentSuccess}
              />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
};
