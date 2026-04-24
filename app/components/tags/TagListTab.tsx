import { useState } from 'react';
import { Plus, Pencil, Trash2, X, GripVertical } from 'lucide-react';

interface TagItem {
  id: string;
  name: string;
  color: string;
}

interface StatusItem {
  id: string;
  code: string;
  name: string;
  color: string;
  order: number;
}

const initialTags: TagItem[] = [
  { id: '1', name: '1 tháng', color: '#2196F3' },
  { id: '2', name: 'Bỏ', color: '#ff0000' },
  { id: '3', name: 'đang điều trị', color: '#00ff6e' },
  { id: '4', name: 'Điều trị năm thành công', color: '#bb00ff' },
  { id: '5', name: 'MKT', color: '#000000' },
  { id: '6', name: 'Nên', color: '#ffbb00' },
  { id: '7', name: 'trải nghiệm', color: '#d1e91c' },
  { id: '8', name: 'Trả liệu trình', color: '#203e65' },
];

const initialStatuses: StatusItem[] = [
  { id: '1', code: 'CONFIRMED', name: 'Đã xác nhận', color: '#22c55e', order: 1 },
  { id: '2', code: 'PENDING', name: 'Chờ xác nhận', color: '#f59e0b', order: 2 },
  { id: '3', code: 'CANCELLED', name: 'Đã hủy', color: '#ef4444', order: 3 },
  { id: '4', code: 'COMPLETED', name: 'Hoàn thành', color: '#3b82f6', order: 4 },
  { id: '5', code: 'NO_SHOW', name: 'Không đến', color: '#6b7280', order: 5 },
];

export function TagListTab() {
  const [tags, setTags] = useState(initialTags);
  const [statuses, setStatuses] = useState(initialStatuses);
  const [tagModal, setTagModal] = useState<{ open: boolean; mode: 'add' | 'edit'; item?: TagItem }>({ open: false, mode: 'add' });
  const [statusModal, setStatusModal] = useState<{ open: boolean; mode: 'add' | 'edit'; item?: StatusItem }>({ open: false, mode: 'add' });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; type: 'tag' | 'status'; id: string; name: string } | null>(null);
  const [tagForm, setTagForm] = useState({ name: '', color: '#2196F3' });
  const [statusForm, setStatusForm] = useState({ code: '', name: '', color: '#22c55e', order: 1 });

  const openAddTag = () => { setTagForm({ name: '', color: '#2196F3' }); setTagModal({ open: true, mode: 'add' }); };
  const openEditTag = (tag: TagItem) => { setTagForm({ name: tag.name, color: tag.color }); setTagModal({ open: true, mode: 'edit', item: tag }); };
  const saveTag = () => {
    if (!tagForm.name.trim()) return;
    if (tagModal.mode === 'add') {
      setTags([...tags, { id: Date.now().toString(), name: tagForm.name, color: tagForm.color }]);
    } else if (tagModal.item) {
      setTags(tags.map(t => t.id === tagModal.item!.id ? { ...t, name: tagForm.name, color: tagForm.color } : t));
    }
    setTagModal({ open: false, mode: 'add' });
  };

  const openAddStatus = () => { setStatusForm({ code: '', name: '', color: '#22c55e', order: statuses.length + 1 }); setStatusModal({ open: true, mode: 'add' }); };
  const openEditStatus = (s: StatusItem) => { setStatusForm({ code: s.code, name: s.name, color: s.color, order: s.order }); setStatusModal({ open: true, mode: 'edit', item: s }); };
  const saveStatus = () => {
    if (!statusForm.name.trim() || !statusForm.code.trim()) return;
    if (statusModal.mode === 'add') {
      setStatuses([...statuses, { id: Date.now().toString(), ...statusForm }]);
    } else if (statusModal.item) {
      setStatuses(statuses.map(s => s.id === statusModal.item!.id ? { ...s, ...statusForm } : s));
    }
    setStatusModal({ open: false, mode: 'add' });
  };

  const confirmDelete = () => {
    if (!deleteModal) return;
    if (deleteModal.type === 'tag') setTags(tags.filter(t => t.id !== deleteModal.id));
    else setStatuses(statuses.filter(s => s.id !== deleteModal.id));
    setDeleteModal(null);
  };

  const presetColors = ['#2196F3', '#ff0000', '#00ff6e', '#bb00ff', '#000000', '#ffbb00', '#d1e91c', '#203e65', '#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280', '#0ea5e9'];

  return (
    <div className="space-y-8">
      {/* Quản lý thẻ tag */}
      <div className="bg-white rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base text-gray-900">Quản lý thẻ tag</h2>
          <button onClick={openAddTag} className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
            <Plus className="w-4 h-4" /> Thêm thẻ tag
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-xs text-gray-500 border-b border-gray-100">
              <th className="text-left pb-3 pl-3" style={{ width: '40%' }}>Tên thẻ tag</th>
              <th className="text-left pb-3" style={{ width: '35%' }}>Màu sắc</th>
              <th className="text-left pb-3" style={{ width: '25%' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {tags.map(tag => (
              <tr key={tag.id} className="border-b border-gray-50 group">
                <td className="py-3 pl-3">
                  <span className="inline-block px-3 py-1 rounded-full text-white text-xs" style={{ backgroundColor: tag.color }}>{tag.name}</span>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full border border-gray-200" style={{ backgroundColor: tag.color }} />
                    <span className="text-xs text-gray-600">{tag.color}</span>
                  </div>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEditTag(tag)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-200">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDeleteModal({ open: true, type: 'tag', id: tag.id, name: tag.name })} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tags.length === 0 && <div className="text-center py-8 text-sm text-gray-400">Chưa có thẻ tag nào</div>}
      </div>

      {/* Quản lý trạng thái lịch hẹn */}
      <div className="bg-white rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base text-gray-900">Quản lý trạng thái lịch hẹn</h2>
          <button onClick={openAddStatus} className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
            <Plus className="w-4 h-4" /> Thêm trạng thái
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-xs text-gray-500 border-b border-gray-100">
              <th className="text-left pb-3 pl-3" style={{ width: '15%' }}>Mã</th>
              <th className="text-left pb-3" style={{ width: '25%' }}>Tên trạng thái</th>
              <th className="text-left pb-3" style={{ width: '20%' }}>Màu sắc</th>
              <th className="text-left pb-3" style={{ width: '15%' }}>Thứ tự</th>
              <th className="text-left pb-3" style={{ width: '25%' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {statuses.sort((a, b) => a.order - b.order).map(s => (
              <tr key={s.id} className="border-b border-gray-50 group">
                <td className="py-3 pl-3 text-xs text-gray-600">{s.code}</td>
                <td className="py-3">
                  <span className="inline-block px-3 py-1 rounded-full text-white text-xs" style={{ backgroundColor: s.color }}>{s.name}</span>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full border border-gray-200" style={{ backgroundColor: s.color }} />
                    <span className="text-xs text-gray-600">{s.color}</span>
                  </div>
                </td>
                <td className="py-3 text-xs text-gray-600">{s.order}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEditStatus(s)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-200">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDeleteModal({ open: true, type: 'status', id: s.id, name: s.name })} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tag Modal */}
      {tagModal.open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setTagModal({ open: false, mode: 'add' })}>
          <div className="bg-white rounded-xl w-[440px] shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h3 className="text-sm text-gray-900">{tagModal.mode === 'add' ? 'Thêm thẻ tag' : 'Chỉnh sửa thẻ tag'}</h3>
              <button onClick={() => setTagModal({ open: false, mode: 'add' })}><X className="w-4 h-4 text-gray-400" /></button>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Tên thẻ tag <span className="text-red-500">*</span></label>
                <input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" value={tagForm.name} onChange={e => setTagForm({ ...tagForm, name: e.target.value })} placeholder="Nhập tên thẻ tag" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Màu sắc</label>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg border border-gray-200" style={{ backgroundColor: tagForm.color }} />
                  <input className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-28 focus:outline-none focus:border-blue-400" value={tagForm.color} onChange={e => setTagForm({ ...tagForm, color: e.target.value })} />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {presetColors.map(c => (
                    <button key={c} onClick={() => setTagForm({ ...tagForm, color: c })} className={`w-6 h-6 rounded-full border-2 ${tagForm.color === c ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Xem trước</label>
                <span className="inline-block px-3 py-1 rounded-full text-white text-xs" style={{ backgroundColor: tagForm.color }}>{tagForm.name || 'Tag mới'}</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-5 py-3 border-t border-gray-100">
              <button onClick={() => setTagModal({ open: false, mode: 'add' })} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Hủy</button>
              <button onClick={saveTag} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">Lưu</button>
            </div>
          </div>
        </div>
      )}

      {/* Status Modal */}
      {statusModal.open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setStatusModal({ open: false, mode: 'add' })}>
          <div className="bg-white rounded-xl w-[440px] shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h3 className="text-sm text-gray-900">{statusModal.mode === 'add' ? 'Thêm trạng thái' : 'Chỉnh sửa trạng thái'}</h3>
              <button onClick={() => setStatusModal({ open: false, mode: 'add' })}><X className="w-4 h-4 text-gray-400" /></button>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Mã trạng thái <span className="text-red-500">*</span></label>
                <input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" value={statusForm.code} onChange={e => setStatusForm({ ...statusForm, code: e.target.value })} placeholder="VD: CONFIRMED" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Tên trạng thái <span className="text-red-500">*</span></label>
                <input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" value={statusForm.name} onChange={e => setStatusForm({ ...statusForm, name: e.target.value })} placeholder="VD: Đã xác nhận" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Màu sắc</label>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg border border-gray-200" style={{ backgroundColor: statusForm.color }} />
                  <input className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-28 focus:outline-none focus:border-blue-400" value={statusForm.color} onChange={e => setStatusForm({ ...statusForm, color: e.target.value })} />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {presetColors.map(c => (
                    <button key={c} onClick={() => setStatusForm({ ...statusForm, color: c })} className={`w-6 h-6 rounded-full border-2 ${statusForm.color === c ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Thứ tự hiển thị</label>
                <input type="number" min={1} className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" value={statusForm.order} onChange={e => setStatusForm({ ...statusForm, order: parseInt(e.target.value) || 1 })} />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-5 py-3 border-t border-gray-100">
              <button onClick={() => setStatusModal({ open: false, mode: 'add' })} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Hủy</button>
              <button onClick={saveStatus} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">Lưu</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setDeleteModal(null)}>
          <div className="bg-white rounded-xl w-[400px] shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-gray-200">
              <h3 className="text-sm text-gray-900">Xác nhận xóa</h3>
            </div>
            <div className="px-5 py-5">
              <p className="text-sm text-gray-600">
                {deleteModal.type === 'tag' ? 'Thẻ tag' : 'Trạng thái'} "<span className="text-gray-900">{deleteModal.name}</span>" sẽ bị xóa. Bạn có chắc chắn muốn xóa không?
              </p>
              {deleteModal.type === 'tag' && (
                <p className="text-xs text-gray-400 mt-2">Lưu ý: Thẻ tag đã gắn cho khách hàng sẽ bị gỡ.</p>
              )}
            </div>
            <div className="flex justify-end gap-2 px-5 py-3 border-t border-gray-100">
              <button onClick={() => setDeleteModal(null)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Hủy bỏ</button>
              <button onClick={confirmDelete} className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
