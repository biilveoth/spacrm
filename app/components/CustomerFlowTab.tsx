import { useState, useRef } from 'react';
import { Filter, RefreshCw, X, Phone, MessageSquare, Calendar, ShoppingBag, Clipboard, MapPin, Heart, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

interface FlowEvent {
  id: string;
  date: string;
  time: string;
  title: string;
  description: string;
  staff?: string;
  icon: 'purchase' | 'message' | 'appointment' | 'treatment' | 'checkin' | 'return' | 'create' | 'care';
  tooltip?: {
    channel?: string;
    sender?: string;
    content?: string;
    status?: string;
    tag?: string;
  };
}

const flowEvents: FlowEvent[] = [
  {
    id: '5', date: '15/03/2024', time: '10:32',
    title: 'Tạo hồ sơ khách hàng',
    description: 'Nguồn: Facebook Ads',
    staff: 'Lan Anh',
    icon: 'create',
  },
  {
    id: '6', date: '15/03/2024', time: '10:45',
    title: 'Nhắn tin tư vấn qua Zalo',
    description: '"Chào chị Hương, da mình đang gặp tình trạng mụn ẩn..."',
    staff: 'Lan Anh',
    icon: 'message',
    tooltip: {
      channel: 'Zalo (Pancake)',
      sender: 'Lan Anh (NV001)',
      content: '"Chào chị Hương, da mình đang gặp tình trạng mụn ẩn..."',
      status: 'Đã gửi',
      tag: 'Tư vấn liệu trình',
    },
  },
  {
    id: '7', date: '16/03/2024', time: '09:15',
    title: 'Đặt lịch hẹn tư vấn',
    description: 'Thời gian: 18/03/2024 - 14:00\nTrạng thái: Đã xác nhận',
    icon: 'appointment',
  },
  {
    id: '8', date: '18/03/2024', time: '14:05',
    title: 'Check-in tại spa',
    description: 'Nhân viên lễ tân: Thu Thảo',
    icon: 'checkin',
  },
  {
    id: '4', date: '18/03/2024', time: '14:30',
    title: 'Tạo liệu trình trị mụn nâng cao (8 buổi)',
    description: 'Giá trị: 8.000.000 đ - Còn lại: 4.300.000 đ',
    icon: 'appointment',
  },
  {
    id: '3', date: '18/03/2024', time: '15:00',
    title: 'Buổi điều trị #01',
    description: 'KTV: Minh\nLấy nhân mụn + điện di\nSP: Gel rửa mặt, Serum B5',
    icon: 'treatment',
  },
  {
    id: '2', date: '02/04/2024', time: '09:12',
    title: 'Nhắn tin chăm sóc sau điều trị',
    description: '"Chị Hương nhớ bôi kem chống nắng và giữ ẩm..."',
    staff: 'Lan Anh',
    icon: 'care',
  },
  {
    id: '1', date: '10/04/2024', time: '10:30',
    title: 'Mua sản phẩm tại spa',
    description: 'Kem chống nắng SPF50 (x1)\nThanh toán: 680.000 đ',
    icon: 'purchase',
  },
  {
    id: '9', date: '15/04/2024', time: '16:20',
    title: 'Khách quay lại điều trị',
    description: 'Buổi #03 - Liệu trình trị mụn nâng cao\nKTV: Minh',
    icon: 'return',
  },
];

const iconMap: Record<string, { icon: React.ElementType; bg: string; color: string; line: string }> = {
  purchase: { icon: ShoppingBag, bg: 'bg-green-100', color: 'text-green-600', line: 'bg-green-400' },
  message: { icon: MessageSquare, bg: 'bg-blue-100', color: 'text-blue-600', line: 'bg-blue-400' },
  appointment: { icon: Calendar, bg: 'bg-purple-100', color: 'text-purple-600', line: 'bg-purple-400' },
  treatment: { icon: Clipboard, bg: 'bg-orange-100', color: 'text-orange-600', line: 'bg-orange-400' },
  checkin: { icon: MapPin, bg: 'bg-teal-100', color: 'text-teal-600', line: 'bg-teal-400' },
  return: { icon: RotateCcw, bg: 'bg-red-100', color: 'text-red-600', line: 'bg-red-400' },
  create: { icon: Heart, bg: 'bg-pink-100', color: 'text-pink-600', line: 'bg-pink-400' },
  care: { icon: Heart, bg: 'bg-red-100', color: 'text-red-600', line: 'bg-red-400' },
};

export function CustomerFlowTab() {
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div>
            <label className="text-xs text-gray-500">Khoảng thời gian</label>
            <div className="flex items-center gap-1 mt-1">
              <input type="text" defaultValue="01/04/2025 - 22/04/2026" className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs w-48" />
              <Calendar className="w-4 h-4 text-gray-400 -ml-7" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500">Giai đoạn</label>
            <select className="mt-1 block px-3 py-1.5 border border-gray-200 rounded-lg text-xs">
              <option>Tất cả</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500">Loại sự kiện</label>
            <select className="mt-1 block px-3 py-1.5 border border-gray-200 rounded-lg text-xs">
              <option>Tất cả</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500">Kênh</label>
            <select className="mt-1 block px-3 py-1.5 border border-gray-200 rounded-lg text-xs">
              <option>Tất cả</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500">Nhân viên phụ trách</label>
            <select className="mt-1 block px-3 py-1.5 border border-gray-200 rounded-lg text-xs">
              <option>Tất cả</option>
            </select>
          </div>
          <div className="flex items-end gap-2 ml-auto mt-4">
            <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600">
              <RefreshCw className="w-3 h-3" /> Làm mới
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600">
              <X className="w-3 h-3" /> Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Timeline */}
      <div className="bg-white rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">Cũ nhất</span>
            <span className="text-gray-300">→</span>
            <span className="text-xs text-gray-400">Mới nhất</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="overflow-x-auto pb-4 scrollbar-thin"
          style={{ scrollbarWidth: 'thin' }}
        >
          <div className="relative flex items-start" style={{ minWidth: `${flowEvents.length * 200}px` }}>
            {/* Horizontal line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" />

            {flowEvents.map((event, index) => {
              const iconInfo = iconMap[event.icon] || iconMap.create;
              const IconComp = iconInfo.icon;
              const isTop = index % 2 === 0;

              return (
                <div
                  key={event.id}
                  className="relative flex flex-col items-center"
                  style={{ width: '200px', flexShrink: 0 }}
                >
                  {/* Top content (even index) */}
                  {isTop && (
                    <div
                      className="mb-3 px-2 w-full cursor-pointer group"
                      onMouseEnter={() => setHoveredEvent(event.id)}
                      onMouseLeave={() => setHoveredEvent(null)}
                    >
                      <div className="bg-white border border-gray-200 rounded-xl p-3 hover:shadow-md transition-shadow relative">
                        <div className="text-[10px] text-gray-400 mb-1">{event.date} • {event.time}</div>
                        <div className="text-xs text-gray-900 mb-1">{event.title}</div>
                        <div className="text-[11px] text-gray-500 whitespace-pre-line line-clamp-3">{event.description}</div>
                        {event.staff && <div className="text-[10px] text-gray-400 mt-1">NV: {event.staff}</div>}

                        {/* Tooltip */}
                        {event.tooltip && hoveredEvent === event.id && (
                          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-14 bg-gray-800 text-white rounded-lg p-3 text-xs w-56 z-20 shadow-lg">
                            {event.tooltip.channel && <div className="mb-1"><span className="text-gray-400">Kênh:</span> {event.tooltip.channel}</div>}
                            {event.tooltip.sender && <div className="mb-1"><span className="text-gray-400">Người gửi:</span> {event.tooltip.sender}</div>}
                            {event.tooltip.content && <div className="mb-1"><span className="text-gray-400">Nội dung:</span><br />{event.tooltip.content}</div>}
                            {event.tooltip.status && <div className="mb-1"><span className="text-gray-400">Trạng thái:</span> {event.tooltip.status}</div>}
                            {event.tooltip.tag && <div><span className="text-gray-400">Tag:</span> {event.tooltip.tag}</div>}
                          </div>
                        )}
                      </div>
                      {/* Connector line down to icon */}
                      <div className={`w-0.5 h-3 ${iconInfo.line} mx-auto`} />
                    </div>
                  )}

                  {/* Spacer for bottom items */}
                  {!isTop && <div style={{ height: '140px' }} />}

                  {/* Icon on the timeline */}
                  <div className={`w-10 h-10 rounded-full ${iconInfo.bg} flex items-center justify-center z-10 shrink-0 ring-4 ring-white`}>
                    <IconComp className={`w-4 h-4 ${iconInfo.color}`} />
                  </div>

                  {/* Spacer for top items */}
                  {isTop && <div style={{ height: '140px' }} />}

                  {/* Bottom content (odd index) */}
                  {!isTop && (
                    <div
                      className="mt-3 px-2 w-full cursor-pointer group"
                      onMouseEnter={() => setHoveredEvent(event.id)}
                      onMouseLeave={() => setHoveredEvent(null)}
                    >
                      {/* Connector line up from icon */}
                      <div className={`w-0.5 h-3 ${iconInfo.line} mx-auto`} />
                      <div className="bg-white border border-gray-200 rounded-xl p-3 hover:shadow-md transition-shadow relative">
                        <div className="text-[10px] text-gray-400 mb-1">{event.date} • {event.time}</div>
                        <div className="text-xs text-gray-900 mb-1">{event.title}</div>
                        <div className="text-[11px] text-gray-500 whitespace-pre-line line-clamp-3">{event.description}</div>
                        {event.staff && <div className="text-[10px] text-gray-400 mt-1">NV: {event.staff}</div>}

                        {event.tooltip && hoveredEvent === event.id && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-14 bg-gray-800 text-white rounded-lg p-3 text-xs w-56 z-20 shadow-lg">
                            {event.tooltip.channel && <div className="mb-1"><span className="text-gray-400">Kênh:</span> {event.tooltip.channel}</div>}
                            {event.tooltip.sender && <div className="mb-1"><span className="text-gray-400">Người gửi:</span> {event.tooltip.sender}</div>}
                            {event.tooltip.content && <div className="mb-1"><span className="text-gray-400">Nội dung:</span><br />{event.tooltip.content}</div>}
                            {event.tooltip.status && <div className="mb-1"><span className="text-gray-400">Trạng thái:</span> {event.tooltip.status}</div>}
                            {event.tooltip.tag && <div><span className="text-gray-400">Tag:</span> {event.tooltip.tag}</div>}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
