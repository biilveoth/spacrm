import { useNavigate, useLocation } from 'react-router';
import {
  LayoutDashboard, Users, Calendar, Tag, Route, ClipboardList, Package,
  ShoppingBag, ShoppingCart, Heart, Image, Settings, LogOut, MessageSquare,
  Wallet, BookText
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, Users, Calendar, Tag, Route, ClipboardList, Package,
  ShoppingBag, ShoppingCart, BookText, Heart, Image, Settings, MessageSquare
};

const menuItems = [
  { icon: 'LayoutDashboard', label: 'Tổng quan', path: '/customers' },
  { icon: 'Users', label: 'Khách hàng', path: '/customers' },
  { icon: 'Calendar', label: 'Lịch hẹn', path: '#' },
  { icon: 'Tag', label: 'Thẻ tag', path: '/tags' },
  { icon: 'Route', label: 'Liệu trình', path: '#' },
  { icon: 'ClipboardList', label: 'Ghi nhận điều trị', path: '#' },
  { icon: 'Package', label: 'Gói điều trị', path: '#' },
  { icon: 'ShoppingBag', label: 'Sản phẩm', path: '#' },
  { icon: 'ShoppingCart', label: 'Sản phẩm đã bán', path: '#' },
  { icon: 'BookText', label: 'Sổ quỹ', path: '/cashbook' },
  { icon: 'Heart', label: 'Chăm sóc khách hàng', path: '#' },
  { icon: 'MessageSquare', label: 'Hội thoại', path: '#' },
  { icon: 'Image', label: 'Thư viện ảnh', path: '#' },
  { icon: 'Settings', label: 'Cài đặt', path: '/settings' },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isCashierActive = location.pathname.includes('/cashier');

  return (
    <div className="w-[220px] min-h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm">S</div>
        <div>
          <div className="text-sm text-gray-900">Spa Management</div>
          <div className="text-xs text-gray-500">Hệ thống quản lý</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {menuItems.map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard;
          const isActive = item.path !== '#'
            ? location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
            : false;
          return (
            <button
              key={item.label}
              onClick={() => item.path !== '#' && navigate(item.path)}
              className={`w-full min-w-0 flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-[18px] h-[18px] shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-100 space-y-2">
        <button
          onClick={() => navigate('/cashier')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
            isCashierActive
              ? 'bg-blue-50 text-blue-600'
              : 'text-blue-600 hover:bg-blue-50'
          }`}
        >
          <Wallet className="w-[18px] h-[18px]" />
          Thu ngân
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50">
          <LogOut className="w-[18px] h-[18px]" />
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
