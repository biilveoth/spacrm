import { Outlet, useLocation } from 'react-router';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const titleMap: Record<string, string> = {
  '/customers': 'Khách hàng',
  '/cashier': 'Thu ngân',
  '/cashbook': 'Sổ quỹ',
  '/settings': 'Cài đặt',
  '/tags': 'Thẻ tag',
};

export function Layout() {
  const location = useLocation();
  const title = location.pathname.includes('/customers/')
    ? 'Hồ sơ khách hàng 360°'
    : titleMap[location.pathname] || 'Khách hàng';

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} />
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
