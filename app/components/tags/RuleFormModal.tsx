import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Zap, Clock, AlertTriangle } from 'lucide-react';

export interface RuleCondition {
  field: string;
  operator: string;
  value: string;
}

export interface RuleAction {
  type: string;
  value: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  active: boolean;
  priority: number;
  isSystem: boolean;
  triggerType: 'event' | 'schedule';
  triggerEvent?: string;
  scheduleFrequency?: 'daily' | 'weekly' | 'monthly';
  scheduleHour?: number;
  scheduleMinute?: number;
  scheduleDays?: number[];
  scheduleMonthDay?: number;
  conditionLogic: 'all' | 'any';
  conditions: RuleCondition[];
  actions: RuleAction[];
  lastRun?: string;
  lastResult?: 'success' | 'error' | 'skipped';
  version?: number;
}

const events = [
  { value: 'customer_created', label: 'Tạo hồ sơ khách hàng' },
  { value: 'payment_completed', label: 'Thanh toán hoàn tất' },
  { value: 'appointment_created', label: 'Tạo lịch hẹn' },
  { value: 'appointment_completed', label: 'Hoàn thành lịch hẹn' },
  { value: 'appointment_cancelled', label: 'Hủy lịch hẹn' },
  { value: 'treatment_completed', label: 'Hoàn thành buổi điều trị' },
  { value: 'treatment_started', label: 'Bắt đầu liệu trình' },
  { value: 'customer_tag_changed', label: 'Thay đổi tag khách hàng' },
];

const fieldsByEvent: Record<string, { value: string; label: string; type: string }[]> = {
  customer_created: [
    { value: 'source', label: 'Nguồn khách', type: 'text' },
    { value: 'tags', label: 'Tag hiện tại', type: 'tag' },
  ],
  payment_completed: [
    { value: 'total_spent', label: 'Tổng chi tiêu', type: 'number' },
    { value: 'payment_amount', label: 'Số tiền thanh toán', type: 'number' },
    { value: 'payment_method', label: 'Phương thức thanh toán', type: 'select' },
    { value: 'tags', label: 'Tag hiện tại', type: 'tag' },
  ],
  appointment_created: [
    { value: 'appointment_type', label: 'Loại lịch hẹn', type: 'text' },
    { value: 'tags', label: 'Tag hiện tại', type: 'tag' },
  ],
  appointment_completed: [
    { value: 'appointment_status', label: 'Trạng thái lịch hẹn', type: 'select' },
    { value: 'tags', label: 'Tag hiện tại', type: 'tag' },
  ],
  appointment_cancelled: [
    { value: 'cancel_reason', label: 'Lý do hủy', type: 'text' },
    { value: 'tags', label: 'Tag hiện tại', type: 'tag' },
  ],
  treatment_completed: [
    { value: 'treatment_sessions_done', label: 'Số buổi đã điều trị', type: 'number' },
    { value: 'treatment_name', label: 'Tên liệu trình', type: 'text' },
    { value: 'tags', label: 'Tag hiện tại', type: 'tag' },
  ],
  treatment_started: [
    { value: 'treatment_name', label: 'Tên liệu trình', type: 'text' },
    { value: 'tags', label: 'Tag hiện tại', type: 'tag' },
  ],
  customer_tag_changed: [
    { value: 'added_tag', label: 'Tag mới thêm', type: 'tag' },
    { value: 'removed_tag', label: 'Tag mới gỡ', type: 'tag' },
    { value: 'tags', label: 'Tag hiện tại', type: 'tag' },
  ],
  _schedule: [
    { value: 'created_at', label: 'Ngày tạo hồ sơ', type: 'date' },
    { value: 'last_visit', label: 'Lần ghé gần nhất', type: 'date' },
    { value: 'total_spent', label: 'Tổng chi tiêu', type: 'number' },
    { value: 'tags', label: 'Tag hiện tại', type: 'tag' },
    { value: 'appointment_status', label: 'Trạng thái lịch hẹn', type: 'select' },
    { value: 'appointment_date', label: 'Ngày hẹn', type: 'date' },
    { value: 'care_priority', label: 'Mức ưu tiên chăm sóc', type: 'select' },
  ],
};

const operatorsByType: Record<string, { value: string; label: string }[]> = {
  text: [
    { value: 'equals', label: 'Bằng' },
    { value: 'not_equals', label: 'Không bằng' },
    { value: 'contains', label: 'Chứa' },
    { value: 'not_contains', label: 'Không chứa' },
    { value: 'is_null', label: 'Rỗng' },
    { value: 'is_not_null', label: 'Không rỗng' },
  ],
  number: [
    { value: 'equals', label: 'Bằng' },
    { value: 'greater_than', label: 'Lớn hơn' },
    { value: 'less_than', label: 'Nhỏ hơn' },
    { value: 'greater_equal', label: 'Lớn hơn hoặc bằng' },
    { value: 'less_equal', label: 'Nhỏ hơn hoặc bằng' },
  ],
  date: [
    { value: 'older_than', label: 'Cũ hơn' },
    { value: 'newer_than', label: 'Mới hơn' },
    { value: 'equals', label: 'Đúng ngày' },
  ],
  tag: [
    { value: 'contains', label: 'Có tag' },
    { value: 'not_contains', label: 'Không có tag' },
  ],
  select: [
    { value: 'equals', label: 'Bằng' },
    { value: 'not_equals', label: 'Không bằng' },
  ],
};

const actionTypes = [
  { value: 'set_customer_tag', label: 'Gắn thẻ khách hàng' },
  { value: 'remove_customer_tag', label: 'Gỡ thẻ khách hàng' },
  { value: 'set_appointment_status', label: 'Đổi trạng thái lịch hẹn' },
  { value: 'set_field', label: 'Cập nhật trường dữ liệu' },
  { value: 'set_care_priority', label: 'Đổi mức ưu tiên chăm sóc' },
];

const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

interface Props {
  mode: 'add' | 'edit';
  rule?: AutomationRule;
  onSave: (rule: AutomationRule) => void;
  onClose: () => void;
}

export function RuleFormModal({ mode, rule, onSave, onClose }: Props) {
  const [form, setForm] = useState<AutomationRule>({
    id: rule?.id || '',
    name: rule?.name || '',
    description: rule?.description || '',
    active: rule?.active ?? false,
    priority: rule?.priority ?? 1,
    isSystem: rule?.isSystem ?? false,
    triggerType: rule?.triggerType || 'event',
    triggerEvent: rule?.triggerEvent || '',
    scheduleFrequency: rule?.scheduleFrequency || 'daily',
    scheduleHour: rule?.scheduleHour ?? 8,
    scheduleMinute: rule?.scheduleMinute ?? 0,
    scheduleDays: rule?.scheduleDays || [],
    scheduleMonthDay: rule?.scheduleMonthDay || 1,
    conditionLogic: rule?.conditionLogic || 'all',
    conditions: rule?.conditions || [],
    actions: rule?.actions || [{ type: '', value: '' }],
  });

  const [dirty, setDirty] = useState(false);
  const [unsavedModal, setUnsavedModal] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const getFields = () => {
    if (form.triggerType === 'schedule') return fieldsByEvent['_schedule'] || [];
    return fieldsByEvent[form.triggerEvent || ''] || [];
  };

  const getFieldType = (fieldValue: string) => {
    const fields = getFields();
    return fields.find(f => f.value === fieldValue)?.type || 'text';
  };

  const updateForm = (updates: Partial<AutomationRule>) => {
    setForm(prev => ({ ...prev, ...updates }));
    setDirty(true);
  };

  const addCondition = () => {
    if (form.conditions.length >= 10) return;
    updateForm({ conditions: [...form.conditions, { field: '', operator: '', value: '' }] });
  };

  const updateCondition = (i: number, updates: Partial<RuleCondition>) => {
    const newConds = [...form.conditions];
    newConds[i] = { ...newConds[i], ...updates };
    if (updates.field) { newConds[i].operator = ''; newConds[i].value = ''; }
    updateForm({ conditions: newConds });
  };

  const removeCondition = (i: number) => {
    updateForm({ conditions: form.conditions.filter((_, idx) => idx !== i) });
  };

  const addAction = () => {
    updateForm({ actions: [...form.actions, { type: '', value: '' }] });
  };

  const updateAction = (i: number, updates: Partial<RuleAction>) => {
    const newActions = [...form.actions];
    newActions[i] = { ...newActions[i], ...updates };
    updateForm({ actions: newActions });
  };

  const removeAction = (i: number) => {
    if (form.actions.length <= 1) return;
    updateForm({ actions: form.actions.filter((_, idx) => idx !== i) });
  };

  const toggleDay = (day: number) => {
    const current = form.scheduleDays || [];
    updateForm({ scheduleDays: current.includes(day) ? current.filter(d => d !== day) : [...current, day] });
  };

  const validate = (): string[] => {
    const errs: string[] = [];
    if (!form.name.trim()) errs.push('Tên quy tắc không được để trống');
    if (form.triggerType === 'event' && !form.triggerEvent) errs.push('Vui lòng chọn sự kiện kích hoạt');
    if (form.triggerType === 'schedule' && form.scheduleFrequency === 'weekly' && (!form.scheduleDays || form.scheduleDays.length === 0)) errs.push('Vui lòng chọn ít nhất một ngày trong tuần');
    if (form.actions.length === 0 || form.actions.every(a => !a.type)) errs.push('Vui lòng thêm ít nhất một hành động');
    form.conditions.forEach((c, i) => {
      if (c.field && !c.operator) errs.push(`Điều kiện ${i + 1}: chưa chọn toán tử`);
      if (c.field && c.operator && !['is_null', 'is_not_null'].includes(c.operator) && !c.value) errs.push(`Điều kiện ${i + 1}: chưa nhập giá trị`);
    });
    form.actions.forEach((a, i) => {
      if (a.type && !a.value) errs.push(`Hành động ${i + 1}: chưa nhập giá trị`);
    });
    return errs;
  };

  const handleSave = (andActivate?: boolean) => {
    const errs = validate();
    if (errs.length > 0) { setErrors(errs); return; }
    setErrors([]);
    onSave({ ...form, active: andActivate ? true : form.active });
  };

  const handleClose = () => {
    if (dirty) { setUnsavedModal(true); return; }
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={handleClose}>
        <div className="bg-white rounded-xl w-[720px] max-h-[90vh] shadow-xl flex flex-col" onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
            <h3 className="text-sm text-gray-900">{mode === 'add' ? 'Thêm quy tắc mới' : 'Chỉnh sửa quy tắc'}</h3>
            <button onClick={handleClose}><X className="w-4 h-4 text-gray-400" /></button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-1">
                {errors.map((e, i) => (
                  <div key={i} className="text-xs text-red-600 flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3 shrink-0" /> {e}
                  </div>
                ))}
              </div>
            )}

            {/* Block A: Thông tin chung */}
            <div>
              <h4 className="text-xs text-gray-500 mb-3 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-[10px]">A</span>
                Thông tin chung
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs text-gray-500 block mb-1">Tên quy tắc <span className="text-red-500">*</span></label>
                  <input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" value={form.name} onChange={e => updateForm({ name: e.target.value })} placeholder="VD: Gắn VIP khi chi tiêu > 10 triệu" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-500 block mb-1">Mô tả</label>
                  <input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" value={form.description} onChange={e => updateForm({ description: e.target.value })} placeholder="Mô tả ngắn về quy tắc" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Mức ưu tiên</label>
                  <input type="number" min={1} className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" value={form.priority} onChange={e => updateForm({ priority: parseInt(e.target.value) || 1 })} />
                  <span className="text-[10px] text-gray-400 ml-2">Số nhỏ = ưu tiên cao</span>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Trạng thái mặc định</label>
                  <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" value={form.active ? 'on' : 'off'} onChange={e => updateForm({ active: e.target.value === 'on' })}>
                    <option value="off">Tắt</option>
                    <option value="on">Bật</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Block B: Khi nào chạy */}
            <div>
              <h4 className="text-xs text-gray-500 mb-3 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-purple-100 text-purple-600 flex items-center justify-center text-[10px]">B</span>
                Khi nào chạy
              </h4>
              <div className="flex gap-3 mb-3">
                <button onClick={() => updateForm({ triggerType: 'event' })} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs border ${form.triggerType === 'event' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  <Zap className="w-3.5 h-3.5" /> Theo sự kiện
                </button>
                <button onClick={() => updateForm({ triggerType: 'schedule' })} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs border ${form.triggerType === 'schedule' ? 'border-purple-500 bg-purple-50 text-purple-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  <Clock className="w-3.5 h-3.5" /> Theo lịch
                </button>
              </div>

              {form.triggerType === 'event' ? (
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Sự kiện kích hoạt <span className="text-red-500">*</span></label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" value={form.triggerEvent || ''} onChange={e => updateForm({ triggerEvent: e.target.value, conditions: [] })}>
                    <option value="">-- Chọn sự kiện --</option>
                    {events.map(ev => <option key={ev.value} value={ev.value}>{ev.label}</option>)}
                  </select>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-3 items-end">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Tần suất</label>
                      <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" value={form.scheduleFrequency || 'daily'} onChange={e => updateForm({ scheduleFrequency: e.target.value as any })}>
                        <option value="daily">Hàng ngày</option>
                        <option value="weekly">Hàng tuần</option>
                        <option value="monthly">Hàng tháng</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Giờ</label>
                      <input type="number" min={0} max={23} className="w-16 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" value={form.scheduleHour ?? 8} onChange={e => updateForm({ scheduleHour: parseInt(e.target.value) })} />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Phút</label>
                      <input type="number" min={0} max={59} className="w-16 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" value={form.scheduleMinute ?? 0} onChange={e => updateForm({ scheduleMinute: parseInt(e.target.value) })} />
                    </div>
                  </div>
                  {form.scheduleFrequency === 'weekly' && (
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Chọn ngày trong tuần <span className="text-red-500">*</span></label>
                      <div className="flex gap-1.5">
                        {weekdays.map((d, i) => (
                          <button key={i} onClick={() => toggleDay(i)} className={`w-9 h-9 rounded-lg text-xs border ${(form.scheduleDays || []).includes(i) ? 'border-purple-500 bg-purple-50 text-purple-600' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>{d}</button>
                        ))}
                      </div>
                    </div>
                  )}
                  {form.scheduleFrequency === 'monthly' && (
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Ngày chạy trong tháng</label>
                      <input type="number" min={1} max={31} className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" value={form.scheduleMonthDay || 1} onChange={e => updateForm({ scheduleMonthDay: parseInt(e.target.value) || 1 })} />
                      <span className="text-[10px] text-gray-400 ml-2">Nếu tháng không có ngày này, sẽ chạy vào ngày cuối tháng</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Block C: Điều kiện */}
            <div>
              <h4 className="text-xs text-gray-500 mb-3 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-green-100 text-green-600 flex items-center justify-center text-[10px]">C</span>
                Điều kiện áp dụng
                <span className="text-[10px] text-gray-400">(không bắt buộc)</span>
              </h4>
              <div className="mb-3">
                <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-blue-400" value={form.conditionLogic} onChange={e => updateForm({ conditionLogic: e.target.value as any })}>
                  <option value="all">Tất cả điều kiện đúng (AND)</option>
                  <option value="any">Chỉ cần một điều kiện đúng (OR)</option>
                </select>
              </div>
              <div className="space-y-2">
                {form.conditions.map((c, i) => {
                  const fieldType = getFieldType(c.field);
                  const operators = operatorsByType[fieldType] || operatorsByType.text;
                  const isNullOp = ['is_null', 'is_not_null'].includes(c.operator);
                  return (
                    <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                      <span className="text-[10px] text-gray-400 w-4 shrink-0">{i + 1}</span>
                      <select className="flex-1 px-2 py-1.5 border border-gray-200 rounded text-xs bg-white focus:outline-none focus:border-blue-400" value={c.field} onChange={e => updateCondition(i, { field: e.target.value })}>
                        <option value="">Trường dữ liệu</option>
                        {getFields().map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                      </select>
                      <select className="w-36 px-2 py-1.5 border border-gray-200 rounded text-xs bg-white focus:outline-none focus:border-blue-400" value={c.operator} onChange={e => updateCondition(i, { operator: e.target.value })}>
                        <option value="">Toán tử</option>
                        {operators.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                      {!isNullOp && (
                        <input className="w-32 px-2 py-1.5 border border-gray-200 rounded text-xs bg-white focus:outline-none focus:border-blue-400" value={c.value} onChange={e => updateCondition(i, { value: e.target.value })} placeholder="Giá trị" />
                      )}
                      <button onClick={() => removeCondition(i)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  );
                })}
              </div>
              {form.conditions.length < 10 && (
                <button onClick={addCondition} className="flex items-center gap-1 text-xs text-blue-600 mt-2 hover:underline">
                  <Plus className="w-3 h-3" /> Thêm điều kiện
                </button>
              )}
            </div>

            {/* Block D: Hành động */}
            <div>
              <h4 className="text-xs text-gray-500 mb-3 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-orange-100 text-orange-600 flex items-center justify-center text-[10px]">D</span>
                Hành động thực hiện <span className="text-red-500">*</span>
              </h4>
              <div className="space-y-2">
                {form.actions.map((a, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                    <span className="text-[10px] text-gray-400 w-4 shrink-0">{i + 1}</span>
                    <select className="flex-1 px-2 py-1.5 border border-gray-200 rounded text-xs bg-white focus:outline-none focus:border-blue-400" value={a.type} onChange={e => updateAction(i, { type: e.target.value, value: '' })}>
                      <option value="">Chọn hành động</option>
                      {actionTypes.map(at => <option key={at.value} value={at.value}>{at.label}</option>)}
                    </select>
                    <input className="w-40 px-2 py-1.5 border border-gray-200 rounded text-xs bg-white focus:outline-none focus:border-blue-400" value={a.value} onChange={e => updateAction(i, { value: e.target.value })} placeholder="Giá trị" />
                    {form.actions.length > 1 && (
                      <button onClick={() => removeAction(i)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={addAction} className="flex items-center gap-1 text-xs text-blue-600 mt-2 hover:underline">
                <Plus className="w-3 h-3" /> Thêm hành động
              </button>
            </div>

            {/* Preview */}
            {form.name && form.actions.some(a => a.type) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-xs text-blue-700">
                  <span className="text-blue-500">Tóm tắt:</span>{' '}
                  Khi <strong>{form.triggerType === 'event' ? events.find(e => e.value === form.triggerEvent)?.label || '...' : `chạy ${form.scheduleFrequency === 'daily' ? 'hàng ngày' : form.scheduleFrequency === 'weekly' ? 'hàng tuần' : 'hàng tháng'}`}</strong>
                  {form.conditions.length > 0 && <>, nếu {form.conditionLogic === 'all' ? 'tất cả' : 'ít nhất một'} điều kiện thỏa</>}
                  {' → '}
                  {form.actions.filter(a => a.type).map((a, i) => (
                    <span key={i}>{i > 0 && ', '}<strong>{actionTypes.find(t => t.value === a.type)?.label}</strong>{a.value && `: ${a.value}`}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 shrink-0">
            <button onClick={handleClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Hủy</button>
            <div className="flex gap-2">
              <button onClick={() => handleSave(false)} className="px-4 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50">Lưu nháp</button>
              <button onClick={() => handleSave(true)} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">Lưu và bật</button>
            </div>
          </div>
        </div>
      </div>

      {/* Unsaved changes modal */}
      {unsavedModal && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center" onClick={() => setUnsavedModal(false)}>
          <div className="bg-white rounded-xl w-[380px] shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-gray-200">
              <h3 className="text-sm text-gray-900">Dữ liệu chưa được lưu</h3>
            </div>
            <div className="px-5 py-5">
              <p className="text-sm text-gray-600">Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn rời khỏi màn hình này không?</p>
            </div>
            <div className="flex justify-end gap-2 px-5 py-3 border-t border-gray-100">
              <button onClick={() => setUnsavedModal(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Ở lại</button>
              <button onClick={onClose} className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700">Rời đi</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
