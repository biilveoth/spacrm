import { Bell, ChevronDown } from 'lucide-react';

export function Header({ title }: { title: string }) {
  return (
    <div className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      <div className="text-sm text-gray-700">{title}</div>
      <div className="flex items-center gap-4">
        <button className="relative">
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs text-blue-700">NV</div>
          <div className="text-sm">
            <span className="text-gray-900">Nguyễn Văn A</span>
            <ChevronDown className="inline w-3.5 h-3.5 ml-1 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
