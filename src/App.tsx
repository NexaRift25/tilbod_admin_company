import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';
import ProtectedRoute from './components/ProtectedRoute';
import CompanyLayout from './layouts/CompanyLayout';
import AdminLayout from './layouts/AdminLayout';
import LoginPage from './pages/Login';
import CompanyDashboardPage from './pages/company/Dashboard';
import CompaniesPage from './pages/company/Companies';
import RegisterCompanyPage from './pages/company/RegisterCompany';
import EditCompanyPage from './pages/company/EditCompany';
import CompanyDetailsPage from './pages/company/CompanyDetails';
import ProfilePage from './pages/company/Profile';
import AnalyticsPage from './pages/company/Analytics';
import SalesPage from './pages/company/Sales';
import GiftCardsPage from './pages/company/GiftCards';
import GiftCardDetailsPage from './pages/company/GiftCardDetails';
import OffersPage from './pages/company/Offers';
import CreateOfferPage from './pages/company/CreateOffer';
import EditOfferPage from './pages/company/EditOffer';
import OfferDetailsPage from './pages/company/OfferDetails';
import PendingApprovalsPage from './pages/company/PendingApprovals';
import PendingItemDetailsPage from './pages/company/PendingItemDetails';
import AdminDashboardPage from './pages/admin/Dashboard';
import AdminApprovalQueuePage from './pages/admin/ApprovalQueue';
import AdminApprovalDetailsPage from './pages/admin/ApprovalDetails';
import AdminCommissionApprovalPage from './pages/admin/CommissionApproval';
import AdminCompaniesPage from './pages/admin/Companies';
import AdminOffersPage from './pages/admin/Offers';
import AdminOfferDetailsPage from './pages/admin/OfferDetails';
import AdminUsersPage from './pages/admin/Users';
import AdminCommissionPricingPage from './pages/admin/CommissionPricing';
import AdminAnalyticsPage from './pages/admin/Analytics';
import AdminEventsSeasonsPage from './pages/admin/EventsSeasons';
import AdminCategoriesPage from './pages/admin/Categories';
import AdminProductCategoriesPage from './pages/admin/ProductCategories';
import AdminDiscountLabelsPage from './pages/admin/DiscountLabels';
import AdminFinancialPage from './pages/admin/Financial';
import AdminCompanyDetailsPage from './pages/admin/CompanyDetails';
import AdminEditCompanyPage from './pages/admin/EditCompany';
import AdminCreateCompanyPage from './pages/admin/CreateCompany';
import AdminCreateOfferPage from './pages/admin/CreateOffer';
import AdminSettingsPage from './pages/admin/Settings';
import UnauthorizedPage from './pages/Unauthorized';
import VerifyEmailPage from './pages/VerifyEmail';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Company Routes */}
          <Route 
            path="/company" 
            element={
              <ProtectedRoute allowedRoles={["company"]}>
                <CompanyLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<CompanyDashboardPage />} />
            <Route path="companies" element={<CompaniesPage />} />
            <Route path="companies/new" element={<RegisterCompanyPage />} />
            <Route path="companies/:id" element={<CompanyDetailsPage />} />
            <Route path="companies/:id/edit" element={<EditCompanyPage />} />
            <Route path="create-offer" element={<CreateOfferPage />} />
            <Route path="offers" element={<OffersPage />} />
            <Route path="offers/:id" element={<OfferDetailsPage />} />
            <Route path="offers/:id/edit" element={<EditOfferPage />} />
            <Route path="sales" element={<SalesPage />} />
            <Route path="gift-cards" element={<GiftCardsPage />} />
            <Route path="gift-cards/:id" element={<GiftCardDetailsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="pending-approvals" element={<PendingApprovalsPage />} />
            <Route path="pending-approvals/:type/:id" element={<PendingItemDetailsPage />} />
          </Route>

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="approval-queue" element={<AdminApprovalQueuePage />} />
            <Route path="approval-queue/:type/:id" element={<AdminApprovalDetailsPage />} />
            <Route path="approval-queue/:type/:id/commission" element={<AdminCommissionApprovalPage />} />
            <Route path="companies" element={<AdminCompaniesPage />} />
            <Route path="companies/create" element={<AdminCreateCompanyPage />} />
            <Route path="companies/:id" element={<AdminCompanyDetailsPage />} />
            <Route path="companies/:id/edit" element={<AdminEditCompanyPage />} />
            <Route path="offers" element={<AdminOffersPage />} />
            <Route path="offers/create" element={<AdminCreateOfferPage />} />
            <Route path="offers/:id" element={<AdminOfferDetailsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="commission-pricing" element={<AdminCommissionPricingPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="events-seasons" element={<AdminEventsSeasonsPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="product-categories" element={<AdminProductCategoriesPage />} />
            <Route path="discount-labels" element={<AdminDiscountLabelsPage />} />
            <Route path="financial" element={<AdminFinancialPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;

