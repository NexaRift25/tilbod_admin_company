import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import CompanyLayout from './layouts/CompanyLayout';
import LoginPage from './pages/Login';
import CompanyDashboardPage from './pages/company/Dashboard';
import CompaniesPage from './pages/company/Companies';
import RegisterCompanyPage from './pages/company/RegisterCompany';
import ProfilePage from './pages/company/Profile';
import AnalyticsPage from './pages/company/Analytics';
import SalesPage from './pages/company/Sales';
import OffersPage from './pages/company/Offers';
import CreateOfferPage from './pages/company/CreateOffer';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/company/dashboard" replace />} />
          
          {/* Company Routes */}
          <Route path="/company" element={<CompanyLayout />}>
            <Route path="dashboard" element={<CompanyDashboardPage />} />
            <Route path="companies" element={<CompaniesPage />} />
            <Route path="companies/new" element={<RegisterCompanyPage />} />
            <Route path="create-offer" element={<CreateOfferPage />} />
            <Route path="offers" element={<OffersPage />} />
            <Route path="sales" element={<SalesPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

