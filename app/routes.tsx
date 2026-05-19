import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './components/Layout';
import { CustomerList } from './components/CustomerList';
import { CustomerProfile } from './components/CustomerProfile';
import { ConversationPage } from './components/ConversationPage';
import { CashierPage } from './components/CashierPage';
import { CashbookPage } from './components/CashbookPage';
import { TreatmentSessionPage } from './components/TreatmentSessionPage';
import { TagManagementPage } from './components/tags/TagManagementPage';
import { SettingsPage } from './components/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, element: <Navigate to="/customers" replace /> },
      { path: 'customers', Component: CustomerList },
      { path: 'customers/:id', Component: CustomerProfile },
      { path: 'customers/:id/conversation', Component: ConversationPage },
      { path: 'treatment-session', Component: TreatmentSessionPage },
      { path: 'cashier', Component: CashierPage },
      { path: 'cashbook', Component: CashbookPage },
      { path: 'tags', Component: TagManagementPage },
      { path: 'settings', Component: SettingsPage },
    ],
  },
]);
