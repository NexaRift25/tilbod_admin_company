import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, Eye, EyeOff, Shield, Building2 } from "lucide-react";
import { Logo } from "@/components/ui/Header";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"admin" | "company">("company");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password, selectedRole);
      toast({
        variant: "success",
        title: "Login Successful",
        description: `Welcome back! Redirecting to ${selectedRole} dashboard...`,
        duration: 3000, // 3 seconds for success
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed. Please try again.";
      toast({
        variant: "error",
        title: "Login Failed",
        description: errorMessage,
        duration: 6000, // 6 seconds for error (longer to read)
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
        {/* Header Section */}
        <div className="flex flex-col items-center m-6 sm:m-8 lg:m-10">
          <Logo className="mb-3 sm:mb-4" />
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-2 sm:mt-4">Tilbod Platform</h2>
          <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">Sign in to your account</p>
        </div>

        {/* Role Selection */}
        <div className="bg-card-background border border-primary rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
          <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Select Account Type</h3>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setSelectedRole("company")}
              className={`p-3 sm:p-4 rounded-lg border transition-all ${
                selectedRole === "company"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-primary/50 text-gray-400 hover:border-primary/60"
              }`}
            >
              <Building2 size={20} className="mx-auto mb-1 sm:mb-2 sm:w-6 sm:h-6" />
              <p className="font-medium text-xs sm:text-sm">Company</p>
              <p className="text-xs opacity-75 hidden sm:block">Manage businesses & offers</p>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole("admin")}
              className={`p-3 sm:p-4 rounded-lg border transition-all ${
                selectedRole === "admin"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-primary/50 text-gray-400 hover:border-primary/60"
              }`}
            >
              <Shield size={20} className="mx-auto mb-1 sm:mb-2 sm:w-6 sm:h-6" />
              <p className="font-medium text-xs sm:text-sm">Admin</p>
              <p className="text-xs opacity-75 hidden sm:block">Platform management</p>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-card-background border border-primary rounded-xl sm:rounded-2xl p-6 sm:p-8 space-y-4 sm:space-y-6">
          {/* Email Field */}
          <div>
            <label className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-background border border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary transition-all text-sm sm:text-base"
                placeholder={selectedRole === "admin" ? "admin@tilbod.is" : "company@example.com"}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-background border border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary transition-all text-sm sm:text-base"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors p-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 sm:py-3 bg-primary text-dark font-semibold rounded-full hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {isLoading ? (
              <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-dark border-t-transparent rounded-full animate-spin mx-auto" />
            ) : (
              `Sign In as ${selectedRole === "admin" ? "Admin" : "Company"}`
            )}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-4 sm:mt-6 mb-8 bg-blue-500/10 border border-blue-500 rounded-lg p-3 sm:p-4">
          <h4 className="text-blue-500 font-semibold mb-2 text-sm sm:text-base">Demo Credentials</h4>
          <div className="text-xs sm:text-sm text-gray-300 space-y-1">
            <p><strong>Admin:</strong> admin@tilbod.is / password123</p>
            <p><strong>Company:</strong> company@example.com / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}

