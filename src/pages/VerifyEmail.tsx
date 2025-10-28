import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, CheckCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function VerifyEmailPage() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast({
        variant: "success",
        title: "Email Sent",
        description: "Verification email has been sent successfully!",
        duration: 4000, // 4 seconds
      });
    } catch (error) {
      toast({
        variant: "error",
        title: "Failed to Send Email",
        description: "Please try again later.",
        duration: 6000, // 6 seconds for error
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleMarkAsVerified = () => {
    if (user) {
      updateUser({ isVerified: true });
      toast({
        variant: "success",
        title: "Email Verified",
        description: "Your email has been verified successfully!",
        duration: 3000, // 3 seconds
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-card-background border border-primary/50 rounded-2xl p-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="text-primary" size={40} />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-4">
            Verify Your Email
          </h1>

          {/* Description */}
          <div className="text-gray-400 mb-8 space-y-2">
            <p>
              We've sent a verification link to:
            </p>
            <p className="text-primary font-semibold">
              {user?.email}
            </p>
            <p className="text-sm">
              Please check your email and click the verification link to activate your account.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleResendEmail}
              disabled={isResending}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-dark font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isResending ? (
                <>
                  <RefreshCw className="animate-spin" size={18} />
                  Sending...
                </>
              ) : (
                <>
                  <Mail size={18} />
                  Resend Email
                </>
              )}
            </button>

            <button
              onClick={handleMarkAsVerified}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-primary/50 text-primary font-semibold rounded-lg hover:bg-primary/5 transition-all duration-300"
            >
              <CheckCircle size={18} />
              I've Verified My Email
            </button>
            
            <Link
              to="/login"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-500/50 text-gray-400 font-semibold rounded-lg hover:bg-gray-500/5 transition-all duration-300"
            >
              <ArrowLeft size={18} />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
