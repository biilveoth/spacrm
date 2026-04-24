import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Pencil, CalendarPlus, MoreHorizontal, Phone, Mail, MapPin, CheckCircle, Calendar } from 'lucide-react';
import { customers, treatments, recentProducts, recentActivities, profileCustomer } from '../data/mockData';
import { ConversationTab } from './ConversationTab';
import { ScoreTab } from './ScoreTab';
import { CustomerFlowTab } from './CustomerFlowTab';
import { ImageWithFallback } from './figma/ImageWithFallback';

const tabs = ['Tổng quan', 'Dòng chảy khách hàng', 'Điểm khách hàng', 'Chăm sóc & Tương tác'];

const avatarUrl = 'https://images.unsplash.com/photo-1707544738443-c8ff4113c9c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwc3BhJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc2MzM2NzIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';

export function CustomerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Tổng quan');

  const customer = customers.find(c => c.id === id) || profileCustomer;

  return (
    <div className="min-h-full bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="text-gray-400 cursor-pointer hover:text-gray-600" onClick={() => navigate('/customers')}>Khách hàng</span>
          <span className="text-gray-300">&gt;</span>
          <span className="text-gray-400">Hồ sơ khách hàng 360°</span>
          {activeTab === 'Chăm sóc & Tương tác' && (
            <>
              <span className="text-gray-300">&gt;</span>
              <span className="text-gray-700">Hội thoại đa nền tảng</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/customers')} className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700">
            Quay lại
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
            ••• Thao tác
          </button>
        </div>
      </div>

      {/* Profile header */}
      <div className="bg-white px-6 py-5 border-b border-gray-200">
        <div className="flex items-start gap-5">
          <ImageWithFallback src={avatarUrl} alt={customer.name} className="w-[88px] h-[88px] rounded-full object-cover border-2 border-white shadow-sm" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xl text-gray-900">Nguyễn Thị Hương</span>
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">Khách hàng</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-1.5">
              <span>Mã KH: KH000123</span>
              <span>Ngày tạo: 15/03/2024</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-1.5">
              <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> 0985 146 868</span>
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> huongnguyen@gmail.com</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded text-xs bg-red-100 text-red-600">VIP</span>
              <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-600">Trị mụn</span>
              <span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-600">Khách thân thiết</span>
              <span className="text-xs text-green-600 flex items-center gap-1 ml-2"><CheckCircle className="w-3 h-3" /> Zalo: Đã liên kết (Pancake)</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 shrink-0 items-start">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Công nợ</div>
              <div className="text-sm text-orange-600">1.250.000 đ</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Tổng chi tiêu</div>
              <div className="text-sm text-gray-900">12.450.000 đ</div>
            </div>
            <div className="text-left">
              <div className="text-xs text-gray-500 mb-1">Liệu trình đang chạy</div>
              <div className="text-sm text-gray-900">Liệu trình trị mụn (4/8 buổi)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-0">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >{tab}</button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'Tổng quan' && <OverviewTab customer={customer} />}
        {activeTab === 'Dòng chảy khách hàng' && <CustomerFlowTab />}
        {activeTab === 'Điểm khách hàng' && <ScoreTab />}
        {activeTab === 'Chăm sóc & Tương tác' && <ConversationTab />}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 text-xs text-gray-400 text-right border-t border-gray-100 bg-white">
        Cập nhật lúc: 22/04/2026 10:30
      </div>
    </div>
  );
}

function OverviewTab({ customer }: { customer: any }) {
  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Left column - spans 9 */}
      <div className="col-span-9 space-y-4">
        {/* Row 1: Personal info + Pancake link */}
        <div className="grid grid-cols-2 gap-4">
          {/* Personal Info */}
          <div className="bg-white rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-900">Thông tin cá nhân</span>
              <span className="text-xs text-blue-600 cursor-pointer">Xem chi tiết</span>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
              <div><span className="text-gray-500">Họ và tên</span><div className="text-gray-900 mt-0.5">Nguyễn Thị Hương</div></div>
              <div><span className="text-gray-500">Số điện thoại</span><div className="text-gray-900 mt-0.5">*****14686</div></div>
              <div><span className="text-gray-500">Ngày sinh</span><div className="text-gray-900 mt-0.5">12/06/1996</div></div>
              <div><span className="text-gray-500">Email</span><div className="text-gray-900 mt-0.5">huongnguyen@gmail.com</div></div>
              <div><span className="text-gray-500">Giới tính</span><div className="text-gray-900 mt-0.5">Nữ</div></div>
              <div><span className="text-gray-500">Địa chỉ</span><div className="text-gray-900 mt-0.5">Số 88, Phố Huế, Hai Bà Trưng, Hà Nội</div></div>
              <div><span className="text-gray-500">Nguồn khách hàng</span><div className="text-gray-900 mt-0.5">Pancake - Zalo OA</div></div>
              <div><span className="text-gray-500">Ngày tạo</span><div className="text-gray-900 mt-0.5">15/03/2024</div></div>
              <div><span className="text-gray-500">Người phụ trách</span><div className="text-gray-900 mt-0.5">Trần Thị Hạnh</div></div>
              <div><span className="text-gray-500">Cập nhật lần cuối</span><div className="text-gray-900 mt-0.5">22/04/2026 10:30</div></div>
            </div>
          </div>

          {/* Pancake Link */}
          <div className="bg-white rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-900">Liên kết Pancake</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-600 rounded text-xs">Đã liên kết</span>
              </div>
              <span className="text-xs text-blue-600 cursor-pointer">Quản lý liên kết</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-gray-500">Nền tảng</span>
                <div className="mt-1"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Zalo</span></div>
              </div>
              <div>
                <span className="text-gray-500">Tài khoản</span>
                <div className="text-gray-900 mt-1">Nguyễn Thị Hương</div>
                <div className="text-gray-400">ZL_849302857392</div>
              </div>
              <div>
                <span className="text-gray-500">Page/Kênh</span>
                <div className="text-gray-900 mt-1">Spa Thanh Xuân - Zalo OA</div>
                <div className="text-gray-400">PG_ZALO_1029384756</div>
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-3">Liên kết lúc: 22/03/2026 10:30</div>
          </div>
        </div>

        {/* Row 2: Treatments + Products */}
        <div className="grid grid-cols-2 gap-4">
          {/* Treatments */}
          <div className="bg-white rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-900">Liệu trình đang tham gia (2)</span>
              <span className="text-xs text-blue-600 cursor-pointer">Xem tất cả</span>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-500 border-b border-gray-100">
                  <td className="pb-2">Tên liệu trình</td>
                  <td className="pb-2">Gói liệu trình</td>
                  <td className="pb-2">Số buổi</td>
                  <td className="pb-2">Đã ĐT</td>
                  <td className="pb-2">Còn lại</td>
                  <td className="pb-2">Tình trạng</td>
                </tr>
              </thead>
              <tbody>
                {treatments.map(t => (
                  <tr key={t.name} className="border-b border-gray-50">
                    <td className="py-2.5 text-blue-600">{t.name}</td>
                    <td className="py-2.5 text-gray-600">{t.package}</td>
                    <td className="py-2.5">{t.total}</td>
                    <td className="py-2.5">{t.done}</td>
                    <td className="py-2.5"><span className={`px-1.5 py-0.5 rounded ${t.remaining <= 4 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{t.remaining}</span></td>
                    <td className="py-2.5"><span className={`px-2 py-0.5 rounded ${t.status === 'Đang thực hiện' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{t.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Products */}
          <div className="bg-white rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-900">Sản phẩm đã mua gần đây (5)</span>
              <span className="text-xs text-blue-600 cursor-pointer">Xem tất cả</span>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-500 border-b border-gray-100">
                  <td className="pb-2">Sản phẩm</td>
                  <td className="pb-2">SL</td>
                  <td className="pb-2">Ngày mua</td>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map(p => (
                  <tr key={p.name} className="border-b border-gray-50">
                    <td className="py-2.5 text-blue-600">{p.name}</td>
                    <td className="py-2.5">{p.qty}</td>
                    <td className="py-2.5">{p.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming appointment */}
        <div className="bg-white rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-900">Lịch hẹn sắp tới</span>
            <span className="text-xs text-blue-600 cursor-pointer">Xem lịch hẹn</span>
          </div>
          <div className="flex items-center gap-4 bg-blue-50 rounded-lg p-4">
            <div className="shrink-0">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-900">Thứ Hai, 21/04/2026</div>
              <div className="text-xs text-gray-500">10:00 - 11:30</div>
            </div>
            <div className="text-xs">
              <div className="text-gray-900">Chăm sóc da cơ bản</div>
              <div className="text-gray-500">Nhân viên: Trần Thị Hạnh</div>
              <div className="text-gray-500">Chi nhánh: Spa Thanh Xuân</div>
            </div>
            <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded text-xs shrink-0">Đã xác nhận</span>
            <button className="text-xs text-blue-600 shrink-0">Đổi lịch</button>
          </div>
        </div>
      </div>

      {/* Right column - spans 3 */}
      <div className="col-span-3 space-y-4">
        {/* Recent activity */}
        <div className="bg-white rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-900">Hoạt động gần đây</span>
            <span className="text-xs text-blue-600 cursor-pointer">Xem tất cả</span>
          </div>
          <div className="space-y-3">
            {recentActivities.map((a, i) => (
              <div key={i} className="flex gap-3">
                <div className="relative">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                  {i < recentActivities.length - 1 && <div className="absolute top-3 left-[3px] w-px h-full bg-gray-200" />}
                </div>
                <div className="text-xs">
                  <div className="text-gray-400">{a.time}</div>
                  <div className="text-gray-700 mt-0.5">{a.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Internal notes */}
        <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-900">Ghi chú nội bộ</span>
            <span className="text-xs text-blue-600 cursor-pointer">Thêm ghi chú</span>
          </div>
          <div className="text-xs text-gray-700 space-y-1.5">
            <p>Khách dễ kích ứng với mỹ phẩm chứa cồn.</p>
            <p>Ưu tiên liệu trình không xâm lấn.</p>
            <p>Thích liên lạc qua Zalo OA hơn gọi điện.</p>
            <p className="text-gray-400 mt-2">- Nguyễn Văn A (22/04/2026)</p>
          </div>
        </div>
      </div>
    </div>
  );
}