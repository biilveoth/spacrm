import { useState, useEffect } from 'react';
import { RefreshCw, Search, Download, Eye, X, CheckCircle, XCircle, MinusCircle, Copy } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  ruleName: string;
  ruleVersion: number;
  triggerType: 'event' | 'schedule';
  triggerLabel: string;
  objectType: string;
  objectId: string;
  objectName: string;
  result: 'success' | 'error' | 'skipped';
  duration: string;
  note: string;
  chainId: string;
  parentExecId?: string;
  level: number;
  conditions?: { field: string; operator: string; expected: string; actual: string; result: boolean }[];
  actions?: { type: string; value: string; status: string; reason?: string; before?: string; after?: string }[];
  error?: { code: string; message: string; detail?: string };
}

const mockLogs: LogEntry[] = [
  {
    id: 'LOG001', timestamp: '22/04/2026 10:15:03', ruleName: 'Gắn VIP khi chi tiêu > 10 triệu', ruleVersion: 3,
    triggerType: 'event', triggerLabel: 'Thanh toán hoàn tất', objectType: 'Khách hàng', objectId: 'KH000123', objectName: 'Nguyễn Thị Hương',
    result: 'success', duration: '45ms', note: '', chainId: 'CH001', level: 1,
    conditions: [{ field: 'Tổng chi tiêu', operator: 'Lớn hơn', expected: '10,000,000', actual: '12,450,000', result: true }],
    actions: [{ type: 'Gắn thẻ', value: 'VIP', status: 'success', before: 'Chưa có', after: 'VIP' }],
  },
  {
    id: 'LOG002', timestamp: '22/04/2026 09:45:12', ruleName: 'Gắn "Khách mới" khi tạo hồ sơ', ruleVersion: 1,
    triggerType: 'event', triggerLabel: 'Tạo hồ sơ khách hàng', objectType: 'Khách hàng', objectId: 'KH000456', objectName: 'Trần Văn Minh',
    result: 'success', duration: '32ms', note: '', chainId: 'CH002', level: 1,
    conditions: [],
    actions: [{ type: 'Gắn thẻ', value: 'Khách mới', status: 'success', before: 'Chưa có', after: 'Khách mới' }],
  },
  {
    id: 'LOG003', timestamp: '22/04/2026 01:00:15', ruleName: 'Gỡ "Khách mới" sau 30 ngày', ruleVersion: 2,
    triggerType: 'schedule', triggerLabel: 'Hàng ngày 01:00', objectType: 'Khách hàng', objectId: 'KH000089', objectName: 'Lê Thị Mai',
    result: 'success', duration: '128ms', note: 'Quét 15 khách hàng, 3 thỏa điều kiện', chainId: 'CH003', level: 1,
    conditions: [
      { field: 'Ngày tạo hồ sơ', operator: 'Cũ hơn', expected: '30d', actual: '45 ngày', result: true },
      { field: 'Tag hiện tại', operator: 'Có tag', expected: 'Khách mới', actual: 'Khách mới', result: true },
    ],
    actions: [{ type: 'Gỡ thẻ', value: 'Khách mới', status: 'success', before: 'Khách mới', after: 'Đã gỡ' }],
  },
  {
    id: 'LOG004', timestamp: '22/04/2026 01:00:16', ruleName: 'Gỡ "Khách mới" sau 30 ngày', ruleVersion: 2,
    triggerType: 'schedule', triggerLabel: 'Hàng ngày 01:00', objectType: 'Khách hàng', objectId: 'KH000102', objectName: 'Phạm Anh Tuấn',
    result: 'skipped', duration: '12ms', note: 'Khách không có tag "Khách mới"', chainId: 'CH003', level: 1,
    conditions: [
      { field: 'Ngày tạo hồ sơ', operator: 'Cũ hơn', expected: '30d', actual: '60 ngày', result: true },
      { field: 'Tag hiện tại', operator: 'Có tag', expected: 'Khách mới', actual: 'Không có', result: false },
    ],
    actions: [{ type: 'Gỡ thẻ', value: 'Khách mới', status: 'skipped', reason: 'Điều kiện không thỏa' }],
  },
  {
    id: 'LOG005', timestamp: '14/04/2026 08:00:22', ruleName: 'Cảnh báo khách không quay lại', ruleVersion: 5,
    triggerType: 'schedule', triggerLabel: 'Hàng tuần T2 08:00', objectType: 'Khách hàng', objectId: 'KH000077', objectName: 'Hoàng Thị Lan',
    result: 'error', duration: '89ms', note: '', chainId: 'CH004', level: 1,
    conditions: [{ field: 'Lần ghé gần nhất', operator: 'Cũ hơn', expected: '60d', actual: '75 ngày', result: true }],
    actions: [
      { type: 'Gắn thẻ', value: 'Cần chăm sóc', status: 'success', before: 'Chưa có', after: 'Cần chăm sóc' },
      { type: 'Đổi mức ưu tiên', value: 'high', status: 'error', reason: 'Giá trị "high" không tồn tại trong hệ thống' },
    ],
    error: { code: 'ACTION_VALUE_INVALID', message: 'Giá trị hành động không hợp lệ', detail: 'Mức ưu tiên "high" đã bị xóa khỏi hệ thống ngày 10/04/2026' },
  },
  {
    id: 'LOG006', timestamp: '21/04/2026 23:59:05', ruleName: 'Đổi lịch hẹn quá hạn sang "Không đến"', ruleVersion: 1,
    triggerType: 'schedule', triggerLabel: 'Hàng ngày 23:59', objectType: 'Lịch hẹn', objectId: 'LH002045', objectName: 'Lịch hẹn #2045 - Nguyễn Văn B',
    result: 'success', duration: '67ms', note: 'Quét 8 lịch hẹn, 2 thỏa điều kiện', chainId: 'CH005', level: 1,
    conditions: [
      { field: 'Trạng thái lịch hẹn', operator: 'Bằng', expected: 'CONFIRMED', actual: 'CONFIRMED', result: true },
      { field: 'Ngày hẹn', operator: 'Cũ hơn', expected: '24h', actual: '48 giờ', result: true },
    ],
    actions: [{ type: 'Đổi trạng thái lịch hẹn', value: 'NO_SHOW', status: 'success', before: 'CONFIRMED', after: 'NO_SHOW' }],
  },
  {
    id: 'LOG007', timestamp: '20/04/2026 10:30:44', ruleName: 'Gắn VIP khi chi tiêu > 10 triệu', ruleVersion: 3,
    triggerType: 'event', triggerLabel: 'Thanh toán hoàn tất', objectType: 'Khách hàng', objectId: 'KH000200', objectName: 'Đỗ Thị Hoa',
    result: 'skipped', duration: '18ms', note: 'Đã áp dụng trước đó', chainId: 'CH006', level: 1,
    conditions: [{ field: 'Tổng chi tiêu', operator: 'Lớn hơn', expected: '10,000,000', actual: '15,200,000', result: true }],
    actions: [{ type: 'Gắn thẻ', value: 'VIP', status: 'skipped', reason: 'Khách đã có tag VIP' }],
  },
];

interface Props {
  initialRuleFilter?: string | null;
}

export function ExecutionLogTab({ initialRuleFilter }: Props) {
  const [logs] = useState(mockLogs);
  const [search, setSearch] = useState(initialRuleFilter || '');
  const [filterResult, setFilterResult] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [detailLog, setDetailLog] = useState<LogEntry | null>(null);

  useEffect(() => {
    if (initialRuleFilter) setSearch(initialRuleFilter);
  }, [initialRuleFilter]);

  const filtered = logs.filter(l => {
    if (search && !l.ruleName.toLowerCase().includes(search.toLowerCase()) && !l.objectName.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterResult !== 'all' && l.result !== filterResult) return false;
    if (filterType !== 'all' && l.triggerType !== filterType) return false;
    return true;
  });

  const stats = {
    total: logs.length,
    success: logs.filter(l => l.result === 'success').length,
    skipped: logs.filter(l => l.result === 'skipped').length,
    error: logs.filter(l => l.result === 'error').length,
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm text-gray-900">Nhật ký thực thi</h3>
          <div className="flex gap-2">
            <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">
              <RefreshCw className="w-3 h-3" /> Làm mới
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">
              <Download className="w-3 h-3" /> Xuất Excel
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-blue-400" placeholder="Tìm theo tên rule hoặc đối tượng..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <input type="text" defaultValue="01/04/2026" className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs w-28" placeholder="Từ ngày" />
            <input type="text" defaultValue="22/04/2026" className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs w-28" placeholder="Đến ngày" />
          </div>
          <select value={filterResult} onChange={e => setFilterResult(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600">
            <option value="all">Tất cả kết quả</option>
            <option value="success">Thành công</option>
            <option value="skipped">Bỏ qua</option>
            <option value="error">Lỗi</option>
          </select>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600">
            <option value="all">Tất cả loại</option>
            <option value="event">Sự kiện</option>
            <option value="schedule">Theo lịch</option>
          </select>
          {search && (
            <button onClick={() => setSearch('')} className="text-xs text-blue-600 hover:underline">Xóa bộ lọc</button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Tất cả', count: stats.total, color: 'bg-gray-50 text-gray-700', active: filterResult === 'all' },
          { label: 'Thành công', count: stats.success, color: 'bg-green-50 text-green-700', active: filterResult === 'success' },
          { label: 'Bỏ qua', count: stats.skipped, color: 'bg-yellow-50 text-yellow-700', active: filterResult === 'skipped' },
          { label: 'Lỗi', count: stats.error, color: 'bg-red-50 text-red-700', active: filterResult === 'error' },
        ].map(s => (
          <button key={s.label} onClick={() => setFilterResult(s.active ? 'all' : s.label === 'Thành công' ? 'success' : s.label === 'Bỏ qua' ? 'skipped' : s.label === 'Lỗi' ? 'error' : 'all')} className={`rounded-xl p-4 text-center border-2 transition-colors ${s.active ? 'border-blue-400' : 'border-transparent'} ${s.color}`}>
            <div className="text-2xl">{s.count}</div>
            <div className="text-xs mt-0.5">{s.label}</div>
          </button>
        ))}
      </div>

      {/* Log Table */}
      <div className="bg-white rounded-xl overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-gray-500 border-b border-gray-100 bg-gray-50/50">
              <th className="text-left py-3 pl-4">Thời gian</th>
              <th className="text-left py-3">Tên quy tắc</th>
              <th className="text-left py-3">Loại / Sự kiện</th>
              <th className="text-left py-3">Đối tượng</th>
              <th className="text-center py-3">Kết quả</th>
              <th className="text-left py-3">Thời gian xử lý</th>
              <th className="text-left py-3">Ghi chú</th>
              <th className="text-left py-3 pr-4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(log => (
              <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="pl-4 py-3 text-gray-500 whitespace-nowrap">{log.timestamp}</td>
                <td className="py-3">
                  <div className="text-gray-900">{log.ruleName}</div>
                  <div className="text-[10px] text-gray-400">v{log.ruleVersion} • {log.chainId}</div>
                </td>
                <td className="py-3">
                  <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] ${log.triggerType === 'event' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                    {log.triggerType === 'event' ? 'Sự kiện' : 'Lịch'}
                  </span>
                  <div className="text-gray-500 mt-0.5">{log.triggerLabel}</div>
                </td>
                <td className="py-3">
                  <div className="text-gray-700">{log.objectName}</div>
                  <div className="text-[10px] text-gray-400">{log.objectType} • {log.objectId}</div>
                </td>
                <td className="py-3 text-center">
                  {log.result === 'success' ? <CheckCircle className="w-4 h-4 text-green-500 mx-auto" /> :
                   log.result === 'error' ? <XCircle className="w-4 h-4 text-red-500 mx-auto" /> :
                   <MinusCircle className="w-4 h-4 text-yellow-500 mx-auto" />}
                </td>
                <td className="py-3 text-gray-500">{log.duration}</td>
                <td className="py-3 text-gray-500 max-w-[150px] truncate">{log.note || (log.error ? log.error.message : '—')}</td>
                <td className="py-3 pr-4">
                  <button onClick={() => setDetailLog(log)} className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-200" title="Xem chi tiết">
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-10 text-sm text-gray-400">Không có log nào</div>}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>Hiển thị {filtered.length} / {logs.length} bản ghi</span>
          <div className="flex items-center gap-1">
            <span className="w-7 h-7 bg-blue-600 text-white rounded flex items-center justify-center">1</span>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {detailLog && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setDetailLog(null)}>
          <div className="bg-white rounded-xl w-[640px] max-h-[85vh] shadow-xl flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0">
              <div>
                <h3 className="text-sm text-gray-900">Chi tiết log thực thi</h3>
                <span className="text-[10px] text-gray-400">{detailLog.id} • {detailLog.chainId}</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-xs text-blue-600 hover:underline flex items-center gap-1"><Copy className="w-3 h-3" /> Copy</button>
                <button onClick={() => setDetailLog(null)}><X className="w-4 h-4 text-gray-400" /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              {/* Block A: Thông tin chung */}
              <div>
                <h4 className="text-xs text-gray-500 mb-2">Thông tin chung</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><span className="text-gray-400">Mã log</span><div className="text-gray-900">{detailLog.id}</div></div>
                  <div><span className="text-gray-400">Mã chain</span><div className="text-gray-900">{detailLog.chainId}</div></div>
                  <div><span className="text-gray-400">Tên quy tắc</span><div className="text-gray-900">{detailLog.ruleName}</div></div>
                  <div><span className="text-gray-400">Version</span><div className="text-gray-900">v{detailLog.ruleVersion}</div></div>
                  <div><span className="text-gray-400">Thời gian</span><div className="text-gray-900">{detailLog.timestamp}</div></div>
                  <div><span className="text-gray-400">Thời gian xử lý</span><div className="text-gray-900">{detailLog.duration}</div></div>
                  <div><span className="text-gray-400">Kết quả</span><div className={`${detailLog.result === 'success' ? 'text-green-600' : detailLog.result === 'error' ? 'text-red-600' : 'text-yellow-600'}`}>{detailLog.result === 'success' ? 'Thành công' : detailLog.result === 'error' ? 'Lỗi' : 'Bỏ qua'}</div></div>
                  <div><span className="text-gray-400">Cấp lan truyền</span><div className="text-gray-900">{detailLog.level}</div></div>
                </div>
              </div>

              {/* Block B: Kích hoạt */}
              <div>
                <h4 className="text-xs text-gray-500 mb-2">Thông tin kích hoạt</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><span className="text-gray-400">Loại</span><div className="text-gray-900">{detailLog.triggerType === 'event' ? 'Sự kiện' : 'Theo lịch'}</div></div>
                  <div><span className="text-gray-400">Sự kiện / Lịch chạy</span><div className="text-gray-900">{detailLog.triggerLabel}</div></div>
                </div>
              </div>

              {/* Block C: Đối tượng */}
              <div>
                <h4 className="text-xs text-gray-500 mb-2">Đối tượng áp dụng</h4>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div><span className="text-gray-400">Loại</span><div className="text-gray-900">{detailLog.objectType}</div></div>
                  <div><span className="text-gray-400">ID</span><div className="text-gray-900">{detailLog.objectId}</div></div>
                  <div><span className="text-gray-400">Tên</span><div className="text-gray-900">{detailLog.objectName}</div></div>
                </div>
              </div>

              {/* Block D: Điều kiện */}
              {detailLog.conditions && detailLog.conditions.length > 0 && (
                <div>
                  <h4 className="text-xs text-gray-500 mb-2">Điều kiện đã đánh giá</h4>
                  <div className="space-y-1.5">
                    {detailLog.conditions.map((c, i) => (
                      <div key={i} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs ${c.result ? 'bg-green-50' : 'bg-red-50'}`}>
                        {c.result ? <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />}
                        <span className="text-gray-700">{c.field}</span>
                        <span className="text-gray-400">{c.operator}</span>
                        <span className="text-gray-700">{c.expected}</span>
                        <span className="text-gray-400 ml-auto">Thực tế: {c.actual}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Block E: Hành động */}
              {detailLog.actions && (
                <div>
                  <h4 className="text-xs text-gray-500 mb-2">Hành động đã thực hiện</h4>
                  <div className="space-y-1.5">
                    {detailLog.actions.map((a, i) => (
                      <div key={i} className={`rounded-lg px-3 py-2 text-xs ${a.status === 'success' ? 'bg-green-50' : a.status === 'error' ? 'bg-red-50' : 'bg-yellow-50'}`}>
                        <div className="flex items-center gap-2">
                          {a.status === 'success' ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : a.status === 'error' ? <XCircle className="w-3.5 h-3.5 text-red-500" /> : <MinusCircle className="w-3.5 h-3.5 text-yellow-500" />}
                          <span className="text-gray-700">{a.type}: {a.value}</span>
                          <span className={`ml-auto ${a.status === 'success' ? 'text-green-600' : a.status === 'error' ? 'text-red-600' : 'text-yellow-600'}`}>{a.status === 'success' ? 'Thành công' : a.status === 'error' ? 'Lỗi' : 'Bỏ qua'}</span>
                        </div>
                        {a.reason && <div className="text-gray-500 mt-1 ml-5">Lý do: {a.reason}</div>}
                        {(a.before || a.after) && <div className="text-gray-500 mt-1 ml-5">Trước: {a.before} → Sau: {a.after}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Block F: Lỗi */}
              {detailLog.error && (
                <div>
                  <h4 className="text-xs text-gray-500 mb-2">Thông tin lỗi</h4>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs space-y-1">
                    <div><span className="text-red-400">Mã lỗi:</span> <span className="text-red-700">{detailLog.error.code}</span></div>
                    <div><span className="text-red-400">Thông điệp:</span> <span className="text-red-700">{detailLog.error.message}</span></div>
                    {detailLog.error.detail && <div><span className="text-red-400">Chi tiết:</span> <span className="text-red-600">{detailLog.error.detail}</span></div>}
                  </div>
                </div>
              )}

              {detailLog.note && (
                <div>
                  <h4 className="text-xs text-gray-500 mb-1">Ghi chú</h4>
                  <div className="text-xs text-gray-700 bg-gray-50 rounded-lg p-3">{detailLog.note}</div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 px-5 py-3 border-t border-gray-200 shrink-0">
              <button onClick={() => setDetailLog(null)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
