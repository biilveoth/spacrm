import { scoreFactors, scoreDetailHistory, scoreHistory } from '../data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Info } from 'lucide-react';

export function ScoreTab() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Left - Score details */}
      <div className="col-span-2 space-y-4">
        {/* Current score */}
        <div className="bg-white rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-900 flex items-center gap-1">Điểm khách hàng hiện tại <Info className="w-3.5 h-3.5 text-gray-400" /></span>
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600">Xem cách tính</button>
          </div>

          <div className="flex items-center gap-8">
            {/* Score circle */}
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <circle cx="60" cy="60" r="52" fill="none" stroke="#3b82f6" strokeWidth="8"
                  strokeDasharray={`${86 * 3.27} ${100 * 3.27}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl text-gray-900">86</span>
                <span className="text-xs text-gray-400">/ 100</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-500">Xếp hạng:</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">A - Khách hàng giá trị cao</span>
              </div>
              <p className="text-xs text-gray-500">Khách hàng rất tiềm năng, có mức chi tiêu cao và gắn bó tốt.</p>
              <p className="text-xs text-gray-400 mt-1">Cập nhật gần nhất: 18/04/2026 14:30</p>
            </div>
          </div>
        </div>

        {/* Score factors */}
        <div className="bg-white rounded-xl p-5">
          <div className="flex items-center gap-1 mb-4">
            <span className="text-sm text-gray-900">Chi tiết các yếu tố tính điểm</span>
            <Info className="w-3.5 h-3.5 text-gray-400" />
          </div>

          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-500 border-b border-gray-100">
                <td className="pb-2 pl-1">Yếu tố</td>
                <td className="pb-2">Tỷ trọng</td>
                <td className="pb-2">Điểm thành phần</td>
                <td className="pb-2">Ghi chú</td>
              </tr>
            </thead>
            <tbody>
              {scoreFactors.map((f, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="py-3 pl-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] ${
                        i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-green-500' : i === 2 ? 'bg-purple-500' : i === 3 ? 'bg-orange-500' : 'bg-red-500'
                      }`}>
                        {i + 1}
                      </span>
                      <div>
                        <div className="text-gray-900">{f.name}</div>
                        <div className="text-gray-400">{f.desc}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">{f.weight}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">{f.score}</span>
                  </td>
                  <td className="py-3 text-gray-500">{f.note}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-3 text-[11px] text-gray-400">
            Cách tính: Tổng điểm = Tổng(Điểm thành phần × Tỷ trọng)<br />
            Thang điểm 0 - 100
          </div>
        </div>
      </div>

      {/* Right - Score history */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-900">Lịch sử điểm</span>
            <span className="text-xs text-blue-600 cursor-pointer">Xem chi tiết</span>
          </div>

          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#9ca3af" />
                <YAxis domain={[60, 90]} tick={{ fontSize: 10 }} stroke="#9ca3af" />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <table className="w-full text-xs mt-4">
            <thead>
              <tr className="text-gray-500 border-b border-gray-100">
                <td className="pb-2">Ngày</td>
                <td className="pb-2">Điểm</td>
                <td className="pb-2">Thay đổi</td>
                <td className="pb-2">Xếp hạng</td>
              </tr>
            </thead>
            <tbody>
              {scoreDetailHistory.map((h, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="py-2">{h.date}</td>
                  <td className="py-2">{h.score}</td>
                  <td className="py-2">
                    {h.change !== '-' && <span className="text-green-600">▲ {h.change.replace('+', '')}</span>}
                    {h.change === '-' && <span className="text-gray-400">-</span>}
                  </td>
                  <td className="py-2">
                    <span className={`px-1.5 py-0.5 rounded ${h.rank === 'A' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{h.rank}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Suggestion */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="text-xs flex items-start gap-2">
            <span className="text-yellow-500">*</span>
            <div>
              <div className="text-gray-900">Gợi ý</div>
              <div className="text-gray-600 mt-1 space-y-1">
                <p>Khách hàng đang có điểm rất tốt. Nên:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Chủ động nhắc lịch buổi điều trị tiếp theo</li>
                  <li>Gửi ưu đãi duy trì để tăng tần suất quay lại</li>
                  <li>Khuyến khích đánh giá & giới thiệu bạn bè</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}