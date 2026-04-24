import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, Eye, Pencil, Trash2, MoreHorizontal, ChevronLeft, ChevronRight, Users, Activity, AlertCircle, Link2, Bot, Plus, Filter, X as XIcon } from 'lucide-react';
import { customers } from '../data/mockData';
import { CustomerModal } from './CustomerModal';

export function CustomerList() {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { icon: Users, label: 'Tổng khách hàng', value: '898', color: 'bg-blue-50 text-blue-600' },
    { icon: Activity, label: 'Đang hoạt động', value: '820', color: 'bg-green-50 text-green-600' },
    { icon: AlertCircle, label: 'Có công nợ', value: '134', color: 'bg-orange-50 text-orange-600' },
    { icon: Link2, label: 'Đã liên kết kênh', value: '512', color: 'bg-purple-50 text-purple-600' },
    { icon: Bot, label: 'Chatbot đang bật', value: '297', color: 'bg-gray-50 text-gray-600' },
  ];

  const handleEdit = (customer: any) => {
    setEditCustomer(customer);
    setShowEditModal(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      {/* Title */}
      <div className="flex items-center justify-between mb-5">
        <h1>Quản lý khách hàng</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" /> Thêm khách hàng
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl p-4 mb-4 space-y-3">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
              placeholder="Tìm kiếm theo tên, số điện thoại, mã khách hàng, Zalo, Facebook..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <input type="date" className="px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Từ ngày" />
            <input type="date" className="px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Đến ngày" />
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {['Trạng thái', 'Thẻ tag', 'Nguồn khách hàng', 'Kênh liên kết', 'Chatbot', 'Công nợ', 'Mức điểm'].map(f => (
            <select key={f} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white text-gray-600">
              <option>{f}: Tất cả</option>
            </select>
          ))}
          <span className="text-xs text-blue-600 cursor-pointer ml-auto">Xóa lọc</span>
          <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs">
            <Filter className="w-3 h-3" /> Lọc
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3 mb-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-500">{s.label}</div>
              <div className="text-xl text-gray-900">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-500">
              <th className="p-3 text-left w-8"><input type="checkbox" className="rounded" /></th>
              <th className="p-3 text-left">Họ tên</th>
              <th className="p-3 text-left">Số điện thoại</th>
              <th className="p-3 text-left">Kênh liên kết</th>
              <th className="p-3 text-left">Thẻ tag</th>
              <th className="p-3 text-left">Công nợ</th>
              <th className="p-3 text-left">Trạng thái</th>
              <th className="p-3 text-left">Chatbot</th>
              <th className="p-3 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 text-sm">
                <td className="p-3"><input type="checkbox" className="rounded" /></td>
                <td className="p-3">
                  <div className="text-blue-600 cursor-pointer hover:underline" onClick={() => navigate(`/customers/${c.id}`)}>{c.name}</div>
                  <div className="text-xs text-gray-400">Mã: {c.code}</div>
                </td>
                <td className="p-3 text-gray-600">{c.phone}</td>
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    <span className="w-5 h-5 bg-green-100 rounded flex items-center justify-center text-xs">P</span>
                    <span className="text-xs text-gray-600">Pancake</span>
                    {c.channelLinked && <span className="text-green-500 text-xs">✓</span>}
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex gap-1 flex-wrap">
                    {c.tags.map(t => (
                      <span key={t} className={`px-2 py-0.5 rounded text-xs ${
                        t === 'VIP' ? 'bg-yellow-100 text-yellow-700' :
                        t === 'Tiềm năng' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>{t}</span>
                    ))}
                    {c.tags.length === 0 && <span className="text-xs text-gray-400">Không có</span>}
                  </div>
                </td>
                <td className="p-3">
                  <span className={`text-sm ${c.debt > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                    {c.debt > 0 ? c.debt.toLocaleString() + ' đ' : '0 đ'}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`text-xs ${c.status === 'Hoạt động' ? 'text-green-600' : 'text-orange-500'}`}>
                    {c.status}
                  </span>
                </td>
                <td className="p-3">
                  <div className={`w-9 h-5 rounded-full flex items-center cursor-pointer transition-colors ${
                    c.chatbot ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'
                  }`}>
                    <div className="w-4 h-4 bg-white rounded-full mx-0.5 shadow-sm" />
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => navigate(`/customers/${c.id}`)}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
                      title="Xem"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(c)}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-blue-600"
                      title="Chỉnh sửa"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-red-600" title="Xóa">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Bottom bar */}
        <div className="flex items-center justify-between p-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <button className="px-2 py-1 border border-gray-200 rounded text-xs">Chọn tất cả</button>
            <button className="px-2 py-1 border border-gray-200 rounded text-xs">Gắn tag</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs">Bật chatbot</button>
            <button className="px-2 py-1 border border-gray-200 rounded text-xs">Tắt chatbot</button>
            <button className="px-2 py-1 border border-gray-200 rounded text-xs">Xuất Excel</button>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1 hover:bg-gray-100 rounded"><ChevronLeft className="w-4 h-4 text-gray-400" /></button>
            {[1, 2, 3, 4, 5].map(p => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-7 h-7 rounded text-xs ${
                  currentPage === p ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >{p}</button>
            ))}
            <span className="text-xs text-gray-400 mx-1">...</span>
            <button className="w-7 h-7 rounded text-xs text-gray-500 hover:bg-gray-100">45</button>
            <button className="p-1 hover:bg-gray-100 rounded"><ChevronRight className="w-4 h-4 text-gray-400" /></button>
            <span className="text-xs text-gray-400 ml-2">Hiển thị 1 - 20 / 898</span>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CustomerModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} mode="add" />
      <CustomerModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} mode="edit" customer={editCustomer} />
    </div>
  );
}