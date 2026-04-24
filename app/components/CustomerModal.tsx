import { X, Search } from 'lucide-react';
import { useState } from 'react';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  customer?: any;
}

export function CustomerModal({ isOpen, onClose, mode, customer }: CustomerModalProps) {
  const [form, setForm] = useState({
    name: customer?.name || '',
    phone: customer?.phone || '',
    email: customer?.email || '',
    gender: customer?.gender || '',
    dob: '',
    status: customer?.status || 'Đang hoạt động',
    source: customer?.source || '',
    address: customer?.address || '',
    note: customer?.note || '',
    debt: customer?.debt || 0,
    tag: '',
  });

  const [searchPhone, setSearchPhone] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // For edit mode: determine if already linked
  const isLinked = mode === 'edit' && customer?.channelLinked;

  if (!isOpen) return null;

  const title = mode === 'add' ? 'Them khach hang moi' : 'Sua thong tin khach hang';

  const handleSearch = () => {
    if (!searchPhone.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setShowSearchResults(true);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl w-full max-w-[680px] max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg">{mode === 'add' ? 'Thêm khách hàng mới' : 'Sửa thông tin khách hàng'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-5">
          {/* Avatar upload */}
          <div>
            <label className="text-sm text-gray-600">Ảnh nhận diện {mode === 'add' && <span className="text-gray-400">(tùy chọn)</span>}</label>
            <div className="mt-2 border border-dashed border-gray-300 rounded-lg p-6 flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-xl text-gray-400">
                {mode === 'edit' && customer?.name ? customer.name[0] : '?'}
              </div>
              <div>
                <div className="text-sm text-gray-500">{mode === 'add' ? 'Tải lên ảnh khuôn mặt' : 'Tải ảnh lên'}</div>
                <div className="text-xs text-gray-400">JPG, PNG. Tối đa 5MB</div>
                <button className="mt-1 text-sm text-gray-600 border border-gray-300 rounded-lg px-3 py-1">Chọn ảnh</button>
              </div>
            </div>
          </div>

          {/* Personal info */}
          <div>
            <label className="text-sm text-gray-700">Thông tin cá nhân</label>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500">Họ và tên <span className="text-red-500">*</span></label>
                <input className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nhập họ tên đầy đủ" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Số điện thoại <span className="text-red-500">*</span></label>
                <input className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Nhập số điện thoại" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Email</label>
                <input className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Giới tính</label>
                <select className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Ngày sinh</label>
                <input type="date" className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-gray-500">Trạng thái</label>
                <select className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option>Đang hoạt động</option>
                  <option>Tạm nghỉ</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Nguồn khách hàng</label>
                <select className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}>
                  <option value="">Chọn nguồn khách hàng</option>
                  <option>Zalo</option>
                  <option>Facebook</option>
                  <option>Pancake</option>
                  <option>Trực tiếp</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Địa chỉ</label>
                <input className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Nhập địa chỉ đầy đủ" />
              </div>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="text-xs text-gray-500">Ghi chú</label>
            <textarea className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white h-20 resize-none" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} placeholder="Ghi chú về khách hàng..." />
          </div>

          {/* Debt and Tag */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500">Nợ (VND)</label>
              <div className="mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                {form.debt.toLocaleString()} đ
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500">Thẻ tag</label>
              <select className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                <option value="">Chọn hoặc nhập thẻ tag</option>
                <option>VIP</option>
                <option>Tiềm năng</option>
                <option>Khách thân thiết</option>
              </select>
            </div>
          </div>

          {/* Pancake link section */}
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-900">Liên kết tài khoản qua Pancake</div>
                <div className="text-xs text-gray-500 mt-0.5">Tìm và liên kết tài khoản Zalo hoặc Facebook của khách hàng thông qua Pancake.</div>
              </div>
              <span className="text-xs text-blue-600 cursor-pointer">Hướng dẫn liên kết</span>
            </div>

            {/* If edit mode AND already linked, show linked state */}
            {isLinked ? (
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 bg-green-50 rounded-lg p-3">
                  <span className="text-green-600 text-sm">&#10003;</span>
                  <div className="text-xs">
                    <div className="text-green-700">Đã liên kết trước đó</div>
                    <div className="text-gray-600">Zalo: Nguyễn Văn Nam</div>
                    <div className="text-gray-500">Liên kết lúc: 22/03/2026 10:30</div>
                    <span className="text-blue-600 cursor-pointer">Xem lịch sử liên kết</span>
                  </div>
                </div>

                <div className="border border-gray-100 rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500">
                        <td className="p-2"></td>
                        <td className="p-2">Nền tảng</td>
                        <td className="p-2">Tài khoản</td>
                        <td className="p-2">Page/Kênh</td>
                        <td className="p-2">Lần tương tác gần nhất</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-100">
                        <td className="p-2"><input type="radio" name="link" defaultChecked /></td>
                        <td className="p-2"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">Zalo</span></td>
                        <td className="p-2">Nguyễn Văn Nam<br /><span className="text-gray-400">ZL_849302857392</span></td>
                        <td className="p-2">Spa Thanh Xuân - Zalo OA<br /><span className="text-gray-400">PG_ZALO_1029384756</span></td>
                        <td className="p-2">2 giờ trước <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded ml-1">Khớp SĐT</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end gap-2">
                  <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600">Bỏ liên kết</button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Liên kết tài khoản đã chọn</button>
                </div>
              </div>
            ) : (
              /* Not linked: show search flow */
              <div className="mt-4 space-y-4">
                {/* Step 1: Search */}
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">1</span>
                    Tìm tài khoản từ Pancake
                  </div>
                  <div className="mt-2 flex gap-2">
                    <input
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="Số điện thoại để tìm kiếm"
                      value={searchPhone}
                      onChange={e => setSearchPhone(e.target.value)}
                    />
                    <button
                      onClick={handleSearch}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-1"
                      disabled={isSearching}
                    >
                      <Search className="w-3.5 h-3.5" />
                      {isSearching ? 'Đang tìm...' : 'Tìm từ Pancake'}
                    </button>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Hệ thống sẽ gửi số điện thoại lên Pancake để tìm các tài khoản đã tồn tại.</div>
                </div>

                {/* Step 2: Results - only show after search */}
                {showSearchResults && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">2</span>
                      Kết quả tìm thấy
                    </div>
                    <div className="mt-2 border border-gray-100 rounded-lg overflow-hidden">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-gray-50 text-gray-500">
                            <td className="p-2"></td>
                            <td className="p-2">Nền tảng</td>
                            <td className="p-2">Tài khoản</td>
                            <td className="p-2">Page/Kênh</td>
                            <td className="p-2">Lần tương tác gần nhất</td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t border-gray-100">
                            <td className="p-2"><input type="radio" name="link" defaultChecked /></td>
                            <td className="p-2"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">Zalo</span></td>
                            <td className="p-2">Nguyễn Văn Nam<br /><span className="text-gray-400">ZL_849302857392</span></td>
                            <td className="p-2">Spa Thanh Xuân - Zalo OA<br /><span className="text-gray-400">PG_ZALO_1029384756</span></td>
                            <td className="p-2">2 giờ trước <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded ml-1">Khớp SĐT</span></td>
                          </tr>
                          <tr className="border-t border-gray-100">
                            <td className="p-2"><input type="radio" name="link" /></td>
                            <td className="p-2"><span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs">Facebook</span></td>
                            <td className="p-2">Nam Nguyễn<br /><span className="text-gray-400">FB_615732849302</span></td>
                            <td className="p-2">Spa Thanh Xuân - Fanpage<br /><span className="text-gray-400">PG_FB_556677889900</span></td>
                            <td className="p-2">1 ngày trước <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded ml-1">Có thể là trùng</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="text-xs text-blue-600 mt-2 cursor-pointer">Xem thêm kết quả (3)</div>

                    <div className="mt-4 flex justify-end gap-2">
                      <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600">Bỏ liên kết</button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Liên kết tài khoản đã chọn</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Add mode: treatment section */}
          {mode === 'add' && (
            <div>
              <label className="text-sm text-gray-700">Tạo liệu trình <span className="text-gray-400">(tùy chọn)</span></label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500">Gói điều trị</label>
                  <select className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                    <option>Chọn gói điều trị</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Ngày bắt đầu</label>
                  <input type="date" className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Tổng số buổi</label>
                  <input className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" placeholder="Nhập số buổi" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Giá gói (VND)</label>
                  <input className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" placeholder="Nhập giá gói" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 border border-gray-200 rounded-lg text-sm text-gray-600">Huỷ</button>
          <button className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm">
            {mode === 'add' ? 'Lưu khách hàng' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  );
}
