import { Link } from "react-router-dom";
import { Shield, ArrowLeft, Home } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-card-background border border-primary/50 rounded-2xl p-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="text-red-500" size={40} />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-4">
            Access Denied
          </h1>

          {/* Description */}
          <p className="text-gray-400 mb-8">
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              to="/login"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-dark font-semibold rounded-lg hover:bg-primary/90 transition-all duration-300"
            >
              <ArrowLeft size={18} />
              Back to Login
            </Link>
            
            <Link
              to="/"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-primary/50 text-primary font-semibold rounded-lg hover:bg-primary/5 transition-all duration-300"
            >
              <Home size={18} />
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
