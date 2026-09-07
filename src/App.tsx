import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { DigitalReceiptModal } from './components/common/DigitalReceiptModal';
import { ToastContainer } from './components/common/ToastContainer';
import { AuthModal } from './components/auth/AuthModal';
import { OwnerOnboardingWizard } from './components/auth/OwnerOnboardingWizard';

// Owner Views
import { DashboardView } from './components/owner/DashboardView';
import { RoomsManagementView } from './components/owner/RoomsManagementView';
import { TenantsManagementView } from './components/owner/TenantsManagementView';
import { PaymentVerificationView } from './components/owner/PaymentVerificationView';
import { BillingInvoicingView } from './components/owner/BillingInvoicingView';
import { PaymentsLedgerView } from './components/owner/PaymentsLedgerView';
import { UtilitiesManagementView } from './components/owner/UtilitiesManagementView';
import { ExpensesView } from './components/owner/ExpensesView';
import { FinancialReportsView } from './components/owner/FinancialReportsView';
import { MaintenanceManagementView } from './components/owner/MaintenanceManagementView';
import { AnnouncementsView } from './components/owner/AnnouncementsView';
import { StaffManagementView } from './components/owner/StaffManagementView';
import { TenantInquiriesView } from './components/owner/TenantInquiriesView';
import { SubscriptionView } from './components/owner/SubscriptionView';
import { PropertySettingsView } from './components/owner/PropertySettingsView';
import { HelpSupportView } from './components/owner/HelpSupportView';

const MainLayout: React.FC = () => {
  const { isOnboarding, activeTab } = useApp();

  // If owner is explicitly in onboarding wizard mode
  if (isOnboarding) {
    return (
      <div className="min-h-screen bg-[#071014] text-[#F1F5F9]">
        <OwnerOnboardingWizard />
        <ToastContainer />
      </div>
    );
  }

  // Render appropriate view based on active tab
  const renderCurrentView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'rooms':
        return <RoomsManagementView />;
      case 'tenants':
        return <TenantsManagementView />;
      case 'verification':
        return <PaymentVerificationView />;
      case 'billing':
      case 'invoices':
        return <BillingInvoicingView />;
      case 'payments':
        return <PaymentsLedgerView />;
      case 'utilities':
        return <UtilitiesManagementView />;
      case 'expenses':
        return <ExpensesView />;
      case 'reports':
        return <FinancialReportsView />;
      case 'maintenance':
        return <MaintenanceManagementView />;
      case 'announcements':
        return <AnnouncementsView />;
      case 'staff':
        return <StaffManagementView />;
      case 'applications':
        return <TenantInquiriesView />;
      case 'subscription':
        return <SubscriptionView />;
      case 'properties':
      case 'settings':
        return <PropertySettingsView />;
      case 'help':
        return <HelpSupportView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen bg-[#071014] text-[#F1F5F9] font-sans antialiased overflow-hidden selection:bg-teal-500/30 selection:text-teal-200">
      {/* High Density Left Sidebar */}
      <Sidebar />

      {/* Main App Canvas */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#071014]">
        {/* Top High Density Header */}
        <Header />

        {/* Dynamic Scrollable Content Workspace */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="max-w-[1600px] mx-auto">
            {renderCurrentView()}
          </div>
        </main>
      </div>

      {/* Global Modals, Drawers & Overlays */}
      <GlobalSearchModal />
      <NotificationDrawer />
      <DigitalReceiptModal />
      <AuthModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
