import { useState } from 'react';
import { Plus, RefreshCw, Search, Pencil, Trash2, Copy, FileText, ToggleLeft, ToggleRight, AlertTriangle, X, ChevronDown, Zap, Clock, GripVertical } from 'lucide-react';
import { RuleFormModal, type AutomationRule } from './RuleFormModal';

const initialRules: AutomationRule[] = [
  {
    id: '1', name: 'Gắn VIP khi chi tiêu > 10 triệu', description: 'Tự động gắn tag VIP cho khách hàng có tổng chi tiêu trên 10 triệu', active: true, priority: 1, isSystem: false,
    triggerType: 'event', triggerEvent: 'payment_completed',
    conditionLogic: 'all', conditions: [{ field: 'total_spent', operator: 'greater_than', value: '10000000' }],
    actions: [{ type: 'set_customer_tag', value: 'VIP' }],
    lastRun: '22/04/2026 10:15', lastResult: 'success', version: 3,
  },
  {
    id: '2', name: 'Gắn "Khách mới" khi tạo hồ sơ', description: 'Gắn tag khách mới cho hồ sơ mới', active: true, priority: 2, isSystem: true,
    triggerType: 'event', triggerEvent: 'customer_created',
    conditionLogic: 'all', conditions: [],
    actions: [{ type: 'set_customer_tag', value: 'Khách mới' }],
    lastRun: '22/04/2026 09:45', lastResult: 'success', version: 1,
  },
  {
    id: '3', name: 'Gỡ "Khách mới" sau 30 ngày', description: 'Tự động gỡ tag khách mới sau 30 ngày tạo hồ sơ', active: true, priority: 3, isSystem: false,
    triggerType: 'schedule', scheduleFrequency: 'daily', scheduleHour: 1, scheduleMinute: 0,
    conditionLogic: 'all', conditions: [{ field: 'created_at', operator: 'older_than', value: '30d' }, { field: 'tags', operator: 'contains', value: 'Khách mới' }],
    actions: [{ type: 'remove_customer_tag', value: 'Khách mới' }],
    lastRun: '22/04/2026 01:00', lastResult: 'success', version: 2,
  },
  {
    id: '4', name: 'Cảnh báo khách không quay lại', description: 'Gắn tag cảnh báo nếu khách 60 ngày không ghé', active: false, priority: 4, isSystem: false,
    triggerType: 'schedule', scheduleFrequency: 'weekly', scheduleHour: 8, scheduleMinute: 0, scheduleDays: [1],
    conditionLogic: 'all', conditions: [{ field: 'last_visit', operator: 'older_than', value: '60d' }],
    actions: [{ type: 'set_customer_tag', value: 'Cần chăm sóc' }, { type: 'set_care_priority', value: 'high' }],
    lastRun: '14/04/2026 08:00', lastResult: 'error', version: 5,
  },
  {
    id: '5', name: 'Đổi lịch hẹn quá hạn sang "Không đến"', description: '', active: true, priority: 5, isSystem: false,
    triggerType: 'schedule', scheduleFrequency: 'daily', scheduleHour: 23, scheduleMinute: 59,
    conditionLogic: 'all', conditions: [{ field: 'appointment_status', operator: 'equals', value: 'CONFIRMED' }, { field: 'appointment_date', operator: 'older_than', value: '24h' }],
    actions: [{ type: 'set_appointment_status', value: 'NO_SHOW' }],
    lastRun: '21/04/2026 23:59', lastResult: 'success', version: 1,
  },
];

interface Props {
  onViewLog: (ruleName: string) => void;
}

export function AutomationRulesTab({ onViewLog }: Props) {
  const [rules, setRules] = useState(initialRules);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [ruleModal, setRuleModal] = useState<{ open: boolean; mode: 'add' | 'edit'; rule?: AutomationRule }>({ open: false, mode: 'add' });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; rule: AutomationRule } | null>(null);
  const [warningModal, setWarningModal] = useState<{ open: boolean; rule: AutomationRule; warnings: string[] } | null>(null);

  const filtered = rules.filter(r => {
    if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType === 'event' && r.triggerType !== 'event') return false;
    if (filterType === 'schedule' && r.triggerType !== 'schedule') return false;
    if (filterStatus === 'active' && !r.active) return false;
    if (filterStatus === 'inactive' && r.active) return false;
    return true;
  });

  const toggleRule = (rule: AutomationRule) => {
    if (!rule.active) {
      // Turning on - check for warnings
      const warnings: string[] = [];
      const sameEvent = rules.filter(r => r.id !== rule.id && r.active && r.triggerEvent === rule.triggerEvent && rule.triggerEvent);
      if (sameEvent.length > 0) warnings.push(`Có thể xung đột với: ${sameEvent.map(r => r.name).join(', ')}`);
      const selfTrigger = rule.actions.some(a => a.type === 'set_customer_tag') && rule.triggerEvent === 'customer_tag_changed';
      if (selfTrigger) warnings.push('Quy tắc có thể tự kích hoạt lại chính nó');

      if (warnings.length > 0) {
        setWarningModal({ open: true, rule, warnings });
        return;
      }
    }
    setRules(rules.map(r => r.id === rule.id ? { ...r, active: !r.active } : r));
  };

  const confirmToggle = () => {
    if (!warningModal) return;
    setRules(rules.map(r => r.id === warningModal.rule.id ? { ...r, active: true } : r));
    setWarningModal(null);
  };

  const duplicateRule = (rule: AutomationRule) => {
    const newRule: AutomationRule = { ...rule, id: Date.now().toString(), name: `${rule.name} (bản sao)`, active: false, isSystem: false, version: 1 };
    setRules([...rules, newRule]);
  };

  const confirmDelete = () => {
    if (!deleteModal) return;
    setRules(rules.filter(r => r.id !== deleteModal.rule.id));
    setDeleteModal(null);
  };

  const saveRule = (rule: AutomationRule) => {
    if (ruleModal.mode === 'add') {
      setRules([...rules, { ...rule, id: Date.now().toString(), version: 1 }]);
    } else {
      setRules(rules.map(r => r.id === rule.id ? { ...rule, version: (r.version || 1) + 1 } : r));
    }
    setRuleModal({ open: false, mode: 'add' });
  };

  const eventLabels: Record<string, string> = {
    payment_completed: 'Thanh toán hoàn tất',
    customer_created: 'Tạo hồ sơ khách hàng',
    appointment_created: 'Tạo lịch hẹn',
    appointment_completed: 'Hoàn thành lịch hẹn',
    treatment_completed: 'Hoàn thành buổi điều trị',
    customer_tag_changed: 'Thay đổi tag khách hàng',
  };

  const actionLabels: Record<string, string> = {
    set_customer_tag: 'Gắn thẻ',
    remove_customer_tag: 'Gỡ thẻ',
    set_appointment_status: 'Đổi trạng thái lịch hẹn',
    set_field: 'Cập nhật trường',
    set_care_priority: 'Đổi mức ưu tiên',
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-sm text-gray-900">Danh sách quy tắc tự động</h3>
            <span className="text-xs text-gray-400">({rules.filter(r => r.active).length} đang bật / {rules.length} tổng)</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">
              <RefreshCw className="w-3 h-3" /> Làm mới
            </button>
            <button onClick={() => setRuleModal({ open: true, mode: 'add' })} className="flex items-center gap-1 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700">
              <Plus className="w-3 h-3" /> Thêm quy tắc
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-blue-400" placeholder="Tìm kiếm quy tắc..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600">
            <option value="all">Tất cả loại</option>
            <option value="event">Theo sự kiện</option>
            <option value="schedule">Theo lịch</option>
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600">
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang bật</option>
            <option value="inactive">Đang tắt</option>
          </select>
        </div>
      </div>

      {/* Rules Table */}
      <div className="bg-white rounded-xl overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-gray-500 border-b border-gray-100 bg-gray-50/50">
              <th className="text-left py-3 pl-4 w-8"></th>
              <th className="text-left py-3">Tên quy tắc</th>
              <th className="text-left py-3">Loại</th>
              <th className="text-left py-3">Sự kiện / Lịch chạy</th>
              <th className="text-left py-3">Hành động</th>
              <th className="text-center py-3 w-16">Ưu tiên</th>
              <th className="text-center py-3 w-20">Trạng thái</th>
              <th className="text-left py-3">Lần chạy cuối</th>
              <th className="text-left py-3 pr-4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(rule => (
              <tr key={rule.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="pl-4 py-3">
                  <GripVertical className="w-3.5 h-3.5 text-gray-300 cursor-grab" />
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-900">{rule.name}</span>
                    {rule.isSystem && <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px]">Hệ thống</span>}
                  </div>
                  {rule.description && <div className="text-[10px] text-gray-400 mt-0.5 max-w-xs truncate">{rule.description}</div>}
                </td>
                <td className="py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] ${
                    rule.triggerType === 'event' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                  }`}>
                    {rule.triggerType === 'event' ? <><Zap className="w-2.5 h-2.5" /> Sự kiện</> : <><Clock className="w-2.5 h-2.5" /> Theo lịch</>}
                  </span>
                </td>
                <td className="py-3 text-gray-600">
                  {rule.triggerType === 'event'
                    ? (eventLabels[rule.triggerEvent || ''] || rule.triggerEvent)
                    : `${rule.scheduleFrequency === 'daily' ? 'Hàng ngày' : rule.scheduleFrequency === 'weekly' ? 'Hàng tuần' : 'Hàng tháng'} lúc ${String(rule.scheduleHour || 0).padStart(2, '0')}:${String(rule.scheduleMinute || 0).padStart(2, '0')}`
                  }
                </td>
                <td className="py-3">
                  <div className="flex flex-wrap gap-1">
                    {rule.actions.map((a, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px]">
                        {actionLabels[a.type] || a.type}: {a.value}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 text-center">
                  <span className="inline-block w-6 h-6 rounded bg-gray-100 text-gray-700 text-[11px] leading-6">{rule.priority}</span>
                </td>
                <td className="py-3 text-center">
                  <button onClick={() => toggleRule(rule)} className="inline-flex items-center">
                    {rule.active
                      ? <ToggleRight className="w-7 h-7 text-green-500" />
                      : <ToggleLeft className="w-7 h-7 text-gray-300" />
                    }
                  </button>
                </td>
                <td className="py-3">
                  {rule.lastRun && (
                    <div>
                      <div className="text-gray-500">{rule.lastRun}</div>
                      <span className={`inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] ${
                        rule.lastResult === 'success' ? 'bg-green-50 text-green-600' :
                        rule.lastResult === 'error' ? 'bg-red-50 text-red-600' :
                        'bg-yellow-50 text-yellow-600'
                      }`}>
                        {rule.lastResult === 'success' ? 'Thành công' : rule.lastResult === 'error' ? 'Lỗi' : 'Bỏ qua'}
                      </span>
                    </div>
                  )}
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-1">
                    <button onClick={() => setRuleModal({ open: true, mode: 'edit', rule })} className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-200" title="Sửa">
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button onClick={() => duplicateRule(rule)} className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:text-purple-600 hover:border-purple-200" title="Nhân bản">
                      <Copy className="w-3 h-3" />
                    </button>
                    <button onClick={() => onViewLog(rule.name)} className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:text-green-600 hover:border-green-200" title="Xem log">
                      <FileText className="w-3 h-3" />
                    </button>
                    {!rule.isSystem && (
                      <button onClick={() => setDeleteModal({ open: true, rule })} className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200" title="Xóa">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-10 text-sm text-gray-400">Không tìm thấy quy tắc nào</div>}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>Hiển thị {filtered.length} / {rules.length} quy tắc</span>
          <div className="flex items-center gap-1">
            <span className="w-7 h-7 bg-blue-600 text-white rounded flex items-center justify-center">1</span>
          </div>
        </div>
      </div>

      {/* Rule Form Modal */}
      {ruleModal.open && (
        <RuleFormModal
          mode={ruleModal.mode}
          rule={ruleModal.rule}
          onSave={saveRule}
          onClose={() => setRuleModal({ open: false, mode: 'add' })}
        />
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setDeleteModal(null)}>
          <div className="bg-white rounded-xl w-[420px] shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-gray-200">
              <h3 className="text-sm text-gray-900">Xác nhận xóa</h3>
            </div>
            <div className="px-5 py-5">
              <p className="text-sm text-gray-600">Quy tắc "<span className="text-gray-900">{deleteModal.rule.name}</span>" sẽ bị xóa. Bạn có chắc chắn muốn xóa không?</p>
              <p className="text-xs text-gray-400 mt-2">Nhật ký thực thi cũ vẫn được giữ lại để tra soát.</p>
            </div>
            <div className="flex justify-end gap-2 px-5 py-3 border-t border-gray-100">
              <button onClick={() => setDeleteModal(null)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Hủy bỏ</button>
              <button onClick={confirmDelete} className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700">Xóa</button>
            </div>
          </div>
        </div>
      )}

      {/* Warning Modal */}
      {warningModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setWarningModal(null)}>
          <div className="bg-white rounded-xl w-[460px] shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm text-gray-900">Cảnh báo cấu hình có rủi ro</h3>
            </div>
            <div className="px-5 py-5">
              <p className="text-sm text-gray-600 mb-3">Quy tắc "<span className="text-gray-900">{warningModal.rule.name}</span>" có thể gây xung đột hoặc tạo vòng lặp với các quy tắc đang bật:</p>
              <ul className="space-y-2">
                {warningModal.warnings.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-gray-600">{w}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end gap-2 px-5 py-3 border-t border-gray-100">
              <button onClick={() => setWarningModal(null)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Quay lại chỉnh sửa</button>
              <button onClick={confirmToggle} className="px-4 py-2 text-sm text-white bg-amber-500 rounded-lg hover:bg-amber-600">Vẫn bật quy tắc</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
