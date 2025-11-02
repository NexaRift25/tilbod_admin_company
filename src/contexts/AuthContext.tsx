"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export type UserRole = "user" | "company" | "admin";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isVerified: boolean;
  phone?: string;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  registrationNumber: string;
  taxId: string;
  category: string;
  status: "pending" | "approved" | "rejected" | "revision";
  revisionCount: number;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  companies: Company[];
  isLoading: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  loginWithGoogle: (role?: UserRole) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  addCompany: (company: Company) => void;
  updateCompany: (companyId: string, data: Partial<Company>) => void;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  role: UserRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("tilbod_user");
    const storedCompanies = localStorage.getItem("tilbod_companies");
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedCompanies) {
      setCompanies(JSON.parse(storedCompanies));
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("tilbod_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("tilbod_user");
    }
  }, [user]);

  // Save companies to localStorage when they change
  useEffect(() => {
    if (companies.length > 0) {
      localStorage.setItem("tilbod_companies", JSON.stringify(companies));
    }
  }, [companies]);

  const login = async (email: string, _password: string, role?: UserRole) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Use the selected role directly (any email/password is accepted)
      if (!role) {
        throw new Error("Please select an account type (Admin or Company)");
      }

      // Mock user data based on selected role
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        firstName: role === "admin" ? "Admin" : "John",
        lastName: role === "admin" ? "User" : "Doe",
        role: role,
        isVerified: true,
        createdAt: new Date().toISOString(),
      };

      setUser(mockUser);

      // Mock companies for company users
      if (mockUser.role === "company") {
        const mockCompanies: Company[] = [
          {
            id: "1",
            name: "Blue Lagoon Spa",
            registrationNumber: "550289-2349",
            taxId: "TAX-001",
            category: "Wellness & Spa",
            status: "approved",
            revisionCount: 0,
            createdAt: "2024-11-15T10:00:00Z",
          },
          {
            id: "2",
            name: "Hotel Aurora",
            registrationNumber: "560123-4567",
            taxId: "TAX-002",
            category: "Hotels & Accommodation",
            status: "pending",
            revisionCount: 0,
            createdAt: "2025-01-10T14:30:00Z",
          },
        ];
        setCompanies(mockCompanies);
        localStorage.setItem("tilbod_companies", JSON.stringify(mockCompanies));
      }

      // Redirect based on role
      switch (mockUser.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "company":
          navigate("/company/dashboard");
          break;
        default:
          navigate("/dashboard");
          break;
      }
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (role?: UserRole) => {
    setIsLoading(true);
    try {
      // Simulate Google OAuth
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email: "user@gmail.com",
        firstName: role === "admin" ? "Admin" : "Google",
        lastName: role === "admin" ? "User" : "User",
        role: role || "user",
        isVerified: true,
        createdAt: new Date().toISOString(),
      };

      setUser(mockUser);

      // Redirect based on role
      switch (mockUser.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "company":
          navigate("/company/dashboard");
          break;
        default:
          navigate("/dashboard");
          break;
      }
    } catch (error) {
      console.error("Google login failed", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setCompanies([]);
    localStorage.removeItem("tilbod_user");
    localStorage.removeItem("tilbod_companies");
    navigate("/login");
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        isVerified: false,
        phone: data.phone,
        createdAt: new Date().toISOString(),
      };

      setUser(newUser);

      // Redirect to verification page or dashboard
      navigate("/verify-email");
    } catch (error) {
      console.error("Registration failed", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  const addCompany = (company: Company) => {
    if (companies.length < 10) {
      setCompanies([...companies, company]);
    } else {
      throw new Error("Maximum 10 companies allowed per user");
    }
  };

  const updateCompany = (companyId: string, data: Partial<Company>) => {
    setCompanies(
      companies.map((company) =>
        company.id === companyId ? { ...company, ...data } : company
      )
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        companies,
        isLoading,
        login,
        loginWithGoogle,
        logout,
        register,
        updateUser,
        addCompany,
        updateCompany,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

