import { useState } from 'react';
import { Search, Filter, Send, ChevronDown, Smile, Paperclip, Image, QrCode, Hash, MoreVertical } from 'lucide-react';
import { chatMessages, conversationList } from '../data/mockData';
import { ImageWithFallback } from './figma/ImageWithFallback';

const avatarUrl = 'https://images.unsplash.com/photo-1707544738443-c8ff4113c9c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwc3BhJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc2MzM2NzIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';

const platformIcons: Record<string, { bg: string; label: string }> = {
  Zalo: { bg: 'bg-blue-500', label: 'Z' },
  Facebook: { bg: 'bg-blue-700', label: 'f' },
  Instagram: { bg: 'bg-gradient-to-br from-purple-500 to-pink-500', label: 'I' },
  System: { bg: 'bg-gray-400', label: 'S' },
};

export function ConversationTab() {
  const [activeConv, setActiveConv] = useState('1');
  const [message, setMessage] = useState('');
  const [subTab, setSubTab] = useState('Hội thoại');
  const [noteText, setNoteText] = useState('');

  const notes = [
    { id: '1', date: '18/04/2026', author: 'Lan Anh', content: 'Khách có da nhạy cảm, cần test sản phẩm trước khi sử dụng. Đã tư vấn d��ng kem chống nắng SPF50 hàng ngày.', tag: 'Tư vấn' },
    { id: '2', date: '15/04/2026', author: 'Minh', content: 'Buổi điều trị #3 hoàn tất. Da khách cải thiện rõ rệt, mụn ẩn giảm 60%. Tiếp tục liệu trình theo phác đồ.', tag: 'Điều trị' },
    { id: '3', date: '02/04/2026', author: 'Lan Anh', content: 'Khách phản hồi tích cực sau buổi #2. Không có phản ứng phụ. Hẹn lịch buổi tiếp theo sau 2 tuần.', tag: 'Theo dõi' },
    { id: '4', date: '18/03/2026', author: 'Thu Thảo', content: 'Khách đến đúng hẹn, thái độ hợp tác tốt. Đã thu tiền đợt 1: 3.700.000 đ.', tag: 'Lễ tân' },
  ];

  const attachments = [
    { id: '1', name: 'Phieu_tu_van_NTHuong.pdf', type: 'pdf', size: '245 KB', date: '18/03/2026', uploader: 'Lan Anh' },
    { id: '2', name: 'Anh_da_truoc_dieu_tri.jpg', type: 'image', size: '1.2 MB', date: '18/03/2026', uploader: 'Minh' },
    { id: '3', name: 'Anh_da_sau_buoi_3.jpg', type: 'image', size: '980 KB', date: '15/04/2026', uploader: 'Minh' },
    { id: '4', name: 'Hop_dong_lieu_trinh.pdf', type: 'pdf', size: '512 KB', date: '18/03/2026', uploader: 'Thu Thảo' },
    { id: '5', name: 'Don_thuoc_kem_theo.pdf', type: 'pdf', size: '128 KB', date: '02/04/2026', uploader: 'Lan Anh' },
  ];

  return (
    <div className="bg-white rounded-xl overflow-hidden" style={{ height: 'calc(100vh - 340px)' }}>
      {/* Sub tabs */}
      <div className="border-b border-gray-200 px-4">
        <div className="flex gap-6">
          {['Hội thoại', 'Ghi chú', 'Tệp đính kèm'].map(t => (
            <button
              key={t}
              onClick={() => setSubTab(t)}
              className={`py-3 text-sm border-b-2 ${subTab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >{t}</button>
          ))}
        </div>
      </div>

      {subTab === 'Hội thoại' ? (
        <div className="flex h-[calc(100%-45px)]">
          {/* Conversation list */}
          <div className="w-[280px] border-r border-gray-200 flex flex-col">
            <div className="p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input className="w-full pl-8 pr-8 py-2 border border-gray-200 rounded-lg text-xs" placeholder="Tìm trong hội thoại..." />
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 cursor-pointer" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversationList.map(conv => {
                const platform = platformIcons[conv.platform] || platformIcons.System;
                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConv(conv.id)}
                    className={`px-3 py-3 cursor-pointer border-l-3 ${
                      activeConv === conv.id ? 'border-blue-600 bg-blue-50' : 'border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`w-7 h-7 rounded-full ${platform.bg} flex items-center justify-center text-white text-[11px] shrink-0 mt-0.5`}>
                        {platform.label}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-900 truncate">{conv.name}</span>
                          <span className="text-[10px] text-gray-400 shrink-0 ml-2">{conv.time}</span>
                        </div>
                        <div className="text-[11px] text-gray-500 truncate mt-0.5">{conv.preview}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-2 border-t border-gray-100 flex items-center justify-center gap-2">
              <button className="text-xs text-gray-400 hover:text-gray-600">&lt;</button>
              <span className="w-6 h-6 bg-blue-600 text-white rounded text-xs flex items-center justify-center">1</span>
              <button className="text-xs text-gray-400 hover:text-gray-600">&gt;</button>
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col">
            {/* Chat header */}
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <span className="flex items-center gap-1">Kênh: Zalo (Pancake) <ChevronDown className="w-3 h-3" /></span>
                <span className="flex items-center gap-1">Phụ trách: Nguyễn Văn A <ChevronDown className="w-3 h-3" /></span>
              </div>
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400 cursor-pointer" />
                <MoreVertical className="w-4 h-4 text-gray-400 cursor-pointer" />
              </div>
            </div>

            {/* Date header */}
            <div className="text-center py-3">
              <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">18/04/2026</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'}`}>
                  {msg.sender === 'customer' && (
                    <ImageWithFallback src={avatarUrl} alt="customer" className="w-8 h-8 rounded-full mr-2 object-cover shrink-0" />
                  )}
                  <div className={`max-w-[60%] ${
                    msg.type === 'appointment' ? '' :
                    msg.sender === 'customer' ? 'bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-2.5' :
                    msg.sender === 'staff' ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5' :
                    'bg-gray-100 rounded-xl px-4 py-2.5'
                  }`}>
                    {msg.type === 'appointment' && msg.appointmentData ? (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                        <div className="text-xs text-gray-500 mb-1">Đã tạo lịch hẹn</div>
                        <div className="text-sm text-gray-900">{msg.appointmentData.title}</div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">⏰ {msg.appointmentData.time}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">👤 {msg.appointmentData.staff}</div>
                        <button className="text-xs text-blue-600 mt-2 hover:underline">Xem lịch hẹn</button>
                      </div>
                    ) : (
                      <>
                        <div className="text-sm whitespace-pre-line">{msg.text}</div>
                        <div className={`text-[10px] mt-1 flex items-center gap-1 ${msg.sender === 'staff' ? 'text-blue-200 justify-end' : 'text-gray-400'}`}>
                          {msg.time}
                          {msg.sender === 'staff' && <span>✓✓</span>}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input area */}
            <div className="border-t border-gray-200 p-3">
              <div className="flex items-center gap-3 mb-2">
                <Smile className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                <Paperclip className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                <Image className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                <Hash className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                <QrCode className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
              </div>
              <div className="flex gap-2">
                <input
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                  placeholder="Nhập tin nhắn... (Enter để gửi, Shift + Enter để xuống dòng)"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-1 hover:bg-blue-700">
                  Gửi <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Right panel - customer info */}
          <div className="w-[260px] border-l border-gray-200 p-4 space-y-5 overflow-y-auto">
            <h4 className="text-sm text-gray-900">Thông tin khách hàng</h4>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-gray-500">Họ và tên</span>
                <div className="text-gray-900 mt-0.5">Nguyễn Thị Hương</div>
              </div>
              <div>
                <span className="text-gray-500">Mã khách hàng</span>
                <div className="text-gray-900 mt-0.5">KH000123</div>
              </div>
              <div>
                <span className="text-gray-500">Số điện thoại</span>
                <div className="text-gray-900 mt-0.5">0985 146 868</div>
              </div>
              <div>
                <span className="text-gray-500">Email</span>
                <div className="text-gray-900 mt-0.5">huongnguyen@gmail.com</div>
              </div>
            </div>

            <div>
              <span className="text-xs text-gray-500">Tag</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-xs">VIP</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded text-xs">Trị mụn</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-600 rounded text-xs">Khách thân thiết</span>
              </div>
              <button className="text-xs text-blue-600 mt-1.5 hover:underline">+ Thêm tag</button>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Thống kê hội thoại</span>
                <span className="text-xs text-blue-600 cursor-pointer hover:underline">Xem chi tiết</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="text-center bg-gray-50 rounded-lg p-2.5">
                  <div className="text-lg text-gray-900">5</div>
                  <div className="text-[10px] text-gray-500">Tin nhắn</div>
                </div>
                <div className="text-center bg-gray-50 rounded-lg p-2.5">
                  <div className="text-lg text-gray-900">3</div>
                  <div className="text-[10px] text-gray-500">Ngày trao đổi</div>
                </div>
                <div className="text-center bg-gray-50 rounded-lg p-2.5">
                  <div className="text-lg text-gray-900">2</div>
                  <div className="text-[10px] text-gray-500">Kênh liên hệ</div>
                </div>
                <div className="text-center bg-gray-50 rounded-lg p-2.5">
                  <div className="text-sm text-gray-900">15/03/2024</div>
                  <div className="text-[10px] text-gray-500">Liên hệ đầu tiên</div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="text-xs flex items-start gap-1.5">
                <span className="text-yellow-500 text-sm">💡</span>
                <div>
                  <div className="text-gray-900">Gợi ý</div>
                  <div className="text-gray-600 mt-0.5">Khách đã điều trị 4 buổi, nên tư vấn gói duy trì và nhắc lịch buổi tiếp theo.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : subTab === 'Ghi chú' ? (
        <div className="flex-1 flex flex-col p-4 overflow-hidden" style={{ height: 'calc(100% - 45px)' }}>
          <div className="mb-4">
            <textarea
              className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-blue-400"
              rows={3}
              placeholder="Thêm ghi chú mới..."
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700">Lưu ghi chú</button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3">
            {notes.map(note => (
              <div key={note.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      note.tag === 'Tư vấn' ? 'bg-blue-100 text-blue-600' :
                      note.tag === 'Điều trị' ? 'bg-orange-100 text-orange-600' :
                      note.tag === 'Theo dõi' ? 'bg-green-100 text-green-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>{note.tag}</span>
                    <span className="text-xs text-gray-500">{note.author}</span>
                  </div>
                  <span className="text-[11px] text-gray-400">{note.date}</span>
                </div>
                <p className="text-sm text-gray-700">{note.content}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4" style={{ height: 'calc(100% - 45px)' }}>
          <div className="border border-dashed border-gray-300 rounded-xl p-6 text-center mb-4 hover:border-blue-400 transition-colors cursor-pointer">
            <Paperclip className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Kéo thả hoặc <span className="text-blue-600 underline">chọn tệp</span> để tải lên</p>
            <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG, DOCX (tối đa 10MB)</p>
          </div>
          <div className="space-y-2">
            {attachments.map(file => (
              <div key={file.id} className="flex items-center gap-3 border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs ${
                  file.type === 'pdf' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {file.type === 'pdf' ? 'PDF' : 'IMG'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-900 truncate">{file.name}</div>
                  <div className="text-xs text-gray-400">{file.size} • {file.date} • {file.uploader}</div>
                </div>
                <button className="text-xs text-blue-600 hover:underline shrink-0">Tải xuống</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
