import { useState, type ReactNode } from 'react';
import {
  CalendarDays,
  Camera,
  CheckCircle2,
  ClipboardList,
  ImagePlus,
  PackageCheck,
  Save,
  ShoppingBag,
  UserRound,
  Wallet,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { customers, pendingTreatmentDrafts } from '../data/mockData';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

const formatCurrency = (value: number) => `${value.toLocaleString('vi-VN')} đ`;

export function TreatmentSessionPage() {
  const navigate = useNavigate();
  const [skinCondition, setSkinCondition] = useState(pendingTreatmentDrafts[0]?.skinCondition || '');
  const [reaction, setReaction] = useState(pendingTreatmentDrafts[0]?.reaction || '');
  const [nextAppointment, setNextAppointment] = useState('2026-05-26');
  const [note, setNote] = useState(pendingTreatmentDrafts[0]?.note || '');
  const [aftercare, setAftercare] = useState(pendingTreatmentDrafts[0]?.aftercare || '');
  const [saved, setSaved] = useState(false);

  const draft = pendingTreatmentDrafts[0];
  const customer = customers.find((item) => item.id === draft.customerId) || customers[0];
  const progress = Math.round((draft.sessionNumber / draft.totalSessions) * 100);
  const saleTotal = draft.saleProducts.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  const saveSession = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2400);
  };

  return (
    <div className="min-h-full bg-gray-50 p-4 xl:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg text-gray-900">Ghi nhận điều trị</h1>
          <p className="mt-0.5 text-xs text-gray-500">
            KTV lưu buổi điều trị, hệ thống tự đẩy sản phẩm bán sang hóa đơn nháp ở Thu ngân.
          </p>
        </div>
        <Button onClick={() => navigate('/cashier')} className="h-10 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
          <Wallet className="h-4 w-4" />
          Thu ngân
        </Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr_0.75fr]">
        <Card className="gap-0 rounded-xl border-gray-200 bg-white shadow-sm">
          <CardContent className="p-5">
            <div className="mb-4 flex items-center gap-2 text-sm text-gray-900">
              <UserRound className="h-4 w-4 text-gray-500" />
              Thông tin khách hàng
            </div>
            <div className="grid gap-3 text-sm">
              <InfoRow label="Họ tên" value={customer.name} strong />
              <InfoRow label="Số điện thoại" value={customer.phone} strong />
              <InfoRow label="Email" value={customer.email || 'Chưa có'} />
              <InfoRow label="Liệu trình" value={draft.treatmentName} strong />
            </div>
          </CardContent>
        </Card>

        <Card className="gap-0 rounded-xl border-gray-200 bg-white shadow-sm">
          <CardContent className="p-5">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-900">
                <CalendarDays className="h-4 w-4 text-gray-500" />
                Tiến độ điều trị
              </div>
              <Badge className="bg-gray-100 text-gray-700">
                <CheckCircle2 className="h-3 w-3" />
                Đang điều trị
              </Badge>
            </div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span>Buổi {draft.sessionNumber}/{draft.totalSessions}</span>
              <span>{progress}%</span>
            </div>
            <div className="mb-5 h-2 rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-blue-500" style={{ width: `${progress}%` }} />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <InfoRow label="Ngày bắt đầu" value="19/05/2026" />
              <InfoRow label="Ngày kết thúc" value="Chưa xác định" />
            </div>
            <div className="mt-4 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
              <div className="text-gray-500">Công nghệ sử dụng - Buổi {draft.sessionNumber}:</div>
              <div className="mt-1 text-gray-900">{note || 'Không có ghi chú'}</div>
              <div className="mt-1">Nhân viên thực hiện: {draft.therapist}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="gap-0 rounded-xl border-gray-200 bg-white shadow-sm">
          <CardContent className="p-5">
            <div className="mb-5 text-sm text-gray-900">Tóm tắt buổi điều trị</div>
            <div className="grid gap-3 text-sm">
              <InfoRow label="Buổi số" value={`${draft.sessionNumber}/${draft.totalSessions}`} strong />
              <InfoRow label="Ngày điều trị" value={draft.date} strong />
              <InfoRow label="Người tạo" value={draft.createdBy} strong />
              <div>
                <div className="mb-1 text-xs text-gray-500">Trạng thái</div>
                <Badge variant="outline" className="border-gray-300 bg-white text-gray-700">Đã thực hiện</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="gap-0 rounded-xl border-gray-200 bg-white shadow-sm">
          <CardContent className="p-5">
            <div className="mb-5 flex items-center gap-2 text-sm text-gray-900">
              <Camera className="h-4 w-4 text-gray-500" />
              Ảnh/Video điều trị
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-1">
              <UploadBox label="Ảnh/Video trước điều trị" />
              <UploadBox label="Ảnh/Video sau điều trị" />
            </div>
          </CardContent>
        </Card>

        <Card className="gap-0 rounded-xl border-gray-200 bg-white shadow-sm">
          <CardContent className="p-5">
            <div className="mb-5 flex items-center gap-2 text-sm text-gray-900">
              <ClipboardList className="h-4 w-4 text-gray-500" />
              Chi tiết buổi điều trị
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs text-gray-600">Ngày điều trị</label>
                <Input type="date" value="2026-05-19" readOnly className="h-10 rounded-lg bg-gray-50 text-sm" />
              </div>

              <SectionBox
                icon={<PackageCheck className="h-4 w-4 text-blue-600" />}
                title="Buổi liệu trình đã thực hiện"
                note="Dòng này trừ vào gói khách đã mua và lên hóa đơn nháp với giá 0 đ."
              >
                {draft.packageSessions.map((item) => (
                  <LineItem key={item.id} title={item.name} subtitle={item.packageName} right={`SL ${item.quantity}`} />
                ))}
              </SectionBox>

              <SectionBox
                icon={<ShoppingBag className="h-4 w-4 text-blue-600" />}
                title="Sản phẩm bán cho khách"
                note="Các dòng này tự xuất hiện ở Thu ngân. Thu ngân có thể sửa giá/số lượng trước khi chốt."
              >
                {draft.saleProducts.map((item) => (
                  <LineItem
                    key={item.id}
                    title={item.name}
                    subtitle={`Đơn giá KTV đề xuất: ${formatCurrency(item.unitPrice)}`}
                    right={`x${item.quantity}`}
                  />
                ))}
                <div className="rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
                  Tổng sản phẩm bán đề xuất: {formatCurrency(saleTotal)}
                </div>
              </SectionBox>

              <SectionBox
                icon={<PackageCheck className="h-4 w-4 text-emerald-600" />}
                title="Sản phẩm sử dụng trong buổi"
                note="Không lên hóa đơn. Kho đã trừ ngay khi KTV lưu; sửa/xóa sẽ hoàn kho phần chênh."
              >
                {draft.usedProducts.map((item) => (
                  <LineItem
                    key={item.id}
                    title={item.name}
                    subtitle={`${item.quantity} ${item.unit}`}
                    right="Đã trừ kho"
                    tone="green"
                  />
                ))}
              </SectionBox>

              <FieldArea label="Tình trạng da" value={skinCondition} onChange={setSkinCondition} placeholder="Mô tả tình trạng da của khách hàng..." />
              <FieldArea label="Phản ứng sau điều trị" value={reaction} onChange={setReaction} placeholder="Ghi chú phản ứng sau điều trị..." />

              <div>
                <label className="mb-1.5 block text-xs text-gray-600">Lịch hẹn tiếp theo</label>
                <Input
                  type="date"
                  value={nextAppointment}
                  onChange={(event) => setNextAppointment(event.target.value)}
                  className="h-10 rounded-lg bg-gray-50 text-sm"
                />
              </div>

              <FieldArea label="Ghi chú" value={note} onChange={setNote} placeholder="Ghi chú thêm về buổi điều trị..." />
              <FieldArea label="Chăm sóc sau bán" value={aftercare} onChange={setAftercare} placeholder="Nhập thông tin chăm sóc sau bán..." />

              {saved && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                  Đã lưu buổi điều trị. Hóa đơn nháp của khách đã được cập nhật ở Thu ngân.
                </div>
              )}

              <Button onClick={saveSession} className="h-11 w-full rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                <Save className="h-4 w-4" />
                Lưu buổi điều trị
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className={`mt-0.5 ${strong ? 'text-gray-950' : 'text-gray-800'}`}>{value}</div>
    </div>
  );
}

function UploadBox({ label }: { label: string }) {
  return (
    <div>
      <div className="mb-2 text-sm text-gray-700">{label}</div>
      <button className="flex aspect-[4/3] w-full max-w-[360px] items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-gray-400 transition-colors hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-600">
        <span className="flex flex-col items-center gap-1 text-xs">
          <ImagePlus className="h-5 w-5" />
          Thêm
        </span>
      </button>
    </div>
  );
}

function SectionBox({
  icon,
  title,
  note,
  children,
}: {
  icon: ReactNode;
  title: string;
  note: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 text-sm text-gray-900">
          {icon}
          <span className="truncate">{title}</span>
        </div>
        <button className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="space-y-2">{children}</div>
      <div className="mt-2 text-xs text-gray-500">{note}</div>
    </div>
  );
}

function LineItem({
  title,
  subtitle,
  right,
  tone = 'gray',
}: {
  title: string;
  subtitle: string;
  right: string;
  tone?: 'gray' | 'green';
}) {
  return (
    <div className={`flex items-start justify-between gap-3 rounded-lg px-3 py-2 ${tone === 'green' ? 'bg-emerald-50' : 'bg-gray-50'}`}>
      <div className="min-w-0">
        <div className="line-clamp-1 text-sm text-gray-900">{title}</div>
        <div className="mt-0.5 text-xs text-gray-500">{subtitle}</div>
      </div>
      <div className={`shrink-0 text-xs ${tone === 'green' ? 'text-emerald-700' : 'text-gray-600'}`}>{right}</div>
    </div>
  );
}

function FieldArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs text-gray-600">{label}</label>
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-h-[64px] rounded-lg border-0 bg-gray-100 text-sm shadow-none focus-visible:ring-blue-200"
      />
    </div>
  );
}
