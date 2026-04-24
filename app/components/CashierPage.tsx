import { useMemo, useState } from 'react';
import {
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  EllipsisVertical,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  UserPlus,
} from 'lucide-react';
import {
  cashierCatalogItems,
  cashierPurchasedPackages,
  cashierStaffs,
  customers,
  type CashierCatalogItem,
} from '../data/mockData';
import { CustomerModal } from './CustomerModal';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Separator } from './ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Textarea } from './ui/textarea';
type DisplayCatalogItem = CashierCatalogItem | {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  section: 'Gói đã mua';
  tag: 'Gói đã mua';
  tone: string;
};

interface OrderLine {
  id: string;
  itemId: string;
  performerId: string;
  consultantId: string;
  quantity: number;
  note: string;
}

const baseTabs = ['Dịch vụ', 'Gói dịch vụ', 'Thẻ tài khoản', 'Sản phẩm'] as const;
type CashierTab = (typeof baseTabs)[number] | 'Gói đã mua';

const formatCurrency = (value: number) => `${value.toLocaleString('vi-VN')} đ`;
const formatNumber = (value: number) => value.toLocaleString('vi-VN');

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');

const createOrderLine = (itemId: string): OrderLine => ({
  id: `${itemId}-${Math.random().toString(36).slice(2, 8)}`,
  itemId,
  performerId: cashierStaffs.find((staff) => staff.role === 'Kỹ thuật viên')?.id || cashierStaffs[0].id,
  consultantId: cashierStaffs.find((staff) => staff.role === 'Tư vấn')?.id || cashierStaffs[0].id,
  quantity: 1,
  note: '',
});

export function CashierPage() {
  const [activeTab, setActiveTab] = useState<CashierTab>('Dịch vụ');
  const [catalogQuery, setCatalogQuery] = useState('');
  const [customerQuery, setCustomerQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [extraFee, setExtraFee] = useState(0);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [noteLineId, setNoteLineId] = useState<string | null>(null);
  const [lineNoteDraft, setLineNoteDraft] = useState('');
  const [selectedSellerId, setSelectedSellerId] = useState(cashierStaffs[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState('Tiền mặt');
  const [paymentReceived, setPaymentReceived] = useState(0);
  const [paymentNote, setPaymentNote] = useState('');
  const [isPaymentNoteOpen, setIsPaymentNoteOpen] = useState(false);
  const [orderLines, setOrderLines] = useState<OrderLine[]>([
    createOrderLine('svc-2'),
    createOrderLine('prd-1'),
    createOrderLine('pkg-1'),
  ]);

  const matchedCustomers = useMemo(() => {
    const normalizedQuery = customerQuery.trim().toLowerCase();
    if (!normalizedQuery) return [];
    return customers.filter((customer) =>
      `${customer.name} ${customer.phone} ${customer.code}`.toLowerCase().includes(normalizedQuery),
    );
  }, [customerQuery]);

  const selectedCustomer =
    matchedCustomers.find((customer) => customer.id === selectedCustomerId) ||
    customers.find((customer) => customer.id === selectedCustomerId) ||
    null;

  const availableTabs = selectedCustomer ? [...baseTabs, 'Gói đã mua'] : [...baseTabs];

  const purchasedPackageItems = useMemo(() => {
    if (!selectedCustomer) return [];
    return cashierPurchasedPackages
      .filter((item) => item.customerId === selectedCustomer.id)
      .map((item) => ({
        id: item.id,
        name: item.name,
        subtitle: item.subtitle,
        price: item.price,
        section: 'Gói đã mua' as const,
        tag: 'Gói đã mua' as const,
        tone: 'from-blue-100 to-indigo-50',
      }));
  }, [selectedCustomer]);

  const visibleCatalogItems = useMemo(() => {
    const normalizedQuery = catalogQuery.trim().toLowerCase();
    const items = activeTab === 'Gói đã mua'
      ? purchasedPackageItems
      : cashierCatalogItems.filter((item) => item.tag === activeTab);

    if (!normalizedQuery) return items;
    return items.filter((item) =>
      `${item.name} ${item.subtitle}`.toLowerCase().includes(normalizedQuery),
    );
  }, [activeTab, catalogQuery, purchasedPackageItems]);

  const activeSectionTitle = activeTab === 'Dịch vụ' ? 'Dịch vụ nổi bật' : activeTab;

  const detailedLines = orderLines.map((line) => {
    const item =
      cashierCatalogItems.find((catalogItem) => catalogItem.id === line.itemId) ||
      purchasedPackageItems.find((catalogItem) => catalogItem.id === line.itemId) ||
      cashierCatalogItems[0];
    const amount = item.price * line.quantity;
    return { ...line, item, amount };
  });

  const subtotal = detailedLines.reduce((sum, line) => sum + line.amount, 0);
  const discountAmount = Math.round((subtotal * discount) / 100);
  const amountDue = Math.max(subtotal - discountAmount + extraFee, 0);
  const invoiceTime = '23/04/2026 14:54';
  const quickReceiveAmounts = [500000, 1000000, 2000000, amountDue];

  const updateLine = (lineId: string, patch: Partial<OrderLine>) => {
    setOrderLines((current) =>
      current.map((line) => (line.id === lineId ? { ...line, ...patch } : line)),
    );
  };

  const addLine = (itemId?: string) => {
    const fallbackItem = activeTab === 'Gói đã mua'
      ? purchasedPackageItems[0] || cashierCatalogItems[0]
      : cashierCatalogItems.find((item) => item.tag === activeTab) || cashierCatalogItems[0];
    setOrderLines((current) => [...current, createOrderLine(itemId || fallbackItem.id)]);
  };

  const removeLine = (lineId: string) => {
    setOrderLines((current) => current.filter((line) => line.id !== lineId));
  };

  const duplicateLine = (lineId: string) => {
    setOrderLines((current) => {
      const targetIndex = current.findIndex((line) => line.id === lineId);
      if (targetIndex === -1) return current;
      const targetLine = current[targetIndex];
      const duplicatedLine: OrderLine = {
        ...targetLine,
        id: `${targetLine.itemId}-${Math.random().toString(36).slice(2, 8)}`,
      };
      const next = [...current];
      next.splice(targetIndex + 1, 0, duplicatedLine);
      return next;
    });
  };

  const openLineNote = (lineId: string) => {
    const targetLine = orderLines.find((line) => line.id === lineId);
    setNoteLineId(lineId);
    setLineNoteDraft(targetLine?.note || '');
  };

  const saveLineNote = () => {
    if (!noteLineId) return;
    updateLine(noteLineId, { note: lineNoteDraft });
    setNoteLineId(null);
    setLineNoteDraft('');
  };

  const addCatalogItem = (item: DisplayCatalogItem) => {
    setActiveTab(item.tag);
    addLine(item.id);
  };

  const clearSelectedCustomer = () => {
    setSelectedCustomerId(null);
    setCustomerQuery('');
    if (activeTab === 'Gói đã mua') {
      setActiveTab('Dịch vụ');
    }
  };

  const handleCompletePayment = () => {
    const invoiceId = `HD-${Date.now().toString().slice(-6)}`;
    const customerName = selectedCustomer?.name || 'Khach le';
    const customerPhone = selectedCustomer?.phone || '-';
    const sellerName =
      cashierStaffs.find((staff) => staff.id === selectedSellerId)?.name || 'Chua xac dinh';
    const totalText = formatCurrency(amountDue);

    const rows = detailedLines
      .map(
        (line, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${escapeHtml(line.item.id)}</td>
            <td style="text-align:left;">
              <div>${escapeHtml(line.item.name)}</div>
              <div class="muted">${escapeHtml(line.item.subtitle || '')}</div>
            </td>
            <td>${line.quantity}</td>
            <td>${formatNumber(line.item.price)}</td>
            <td>${formatNumber(line.amount)}</td>
          </tr>
        `,
      )
      .join('');

    const invoiceHtml = `
      <!doctype html>
      <html lang="vi">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Hoa don ${invoiceId}</title>
          <style>
            * { box-sizing: border-box; }
            body {
              margin: 0;
              background: #f4f6fb;
              font-family: "Times New Roman", Times, serif;
              color: #111827;
              padding: 16px;
            }
            .sheet {
              width: 794px;
              min-height: 1123px;
              margin: 0 auto;
              background: #fff;
              border: 3px double #2459d6;
              padding: 18px 20px 22px;
              position: relative;
            }
            .header {
              border-bottom: 1px solid #9ca3af;
              padding-bottom: 10px;
              margin-bottom: 10px;
            }
            .brand {
              font-size: 22px;
              font-weight: 700;
              color: #2459d6;
              margin-bottom: 8px;
            }
            .company {
              font-size: 14px;
              line-height: 1.45;
            }
            .title {
              text-align: center;
              margin: 14px 0 4px;
              font-size: 32px;
              font-weight: 700;
              letter-spacing: 0.5px;
            }
            .subtitle {
              text-align: center;
              font-size: 18px;
              margin-bottom: 10px;
            }
            .meta {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 8px 24px;
              font-size: 15px;
              margin-bottom: 12px;
              border-top: 1px solid #d1d5db;
              border-bottom: 1px solid #d1d5db;
              padding: 10px 0;
            }
            .meta strong { font-weight: 700; }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 15px;
              margin-top: 8px;
            }
            th, td {
              border: 1px solid #9ca3af;
              padding: 8px 6px;
              text-align: center;
              vertical-align: top;
            }
            th {
              background: #f3f4f6;
              font-weight: 700;
            }
            .muted {
              color: #6b7280;
              font-size: 13px;
              margin-top: 2px;
            }
            .total {
              margin-top: 14px;
              border-top: 1px solid #9ca3af;
              padding-top: 10px;
              display: grid;
              grid-template-columns: 1fr auto;
              gap: 8px;
              font-size: 18px;
              font-weight: 700;
            }
            .footer {
              margin-top: 48px;
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              text-align: center;
              font-size: 15px;
            }
            .signature {
              border-top: 1px dashed #9ca3af;
              margin-top: 64px;
              padding-top: 8px;
            }
            @media print {
              body { background: #fff; padding: 0; }
              .sheet { border: none; width: auto; min-height: auto; margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="sheet">
            <div class="header">
              <div class="brand">KiotViet</div>
              <div class="company">
                <div><strong>SPA MANAGEMENT</strong></div>
                <div>Dia chi: Ha Noi</div>
                <div>Dien thoai: 0379 999 999</div>
              </div>
            </div>

            <div class="title">HOA DON BAN HANG</div>
            <div class="subtitle">(SALES INVOICE)</div>

            <div class="meta">
              <div><strong>So hoa don:</strong> ${invoiceId}</div>
              <div><strong>Ngay lap:</strong> ${escapeHtml(invoiceTime)}</div>
              <div><strong>Khach hang:</strong> ${escapeHtml(customerName)}</div>
              <div><strong>Dien thoai:</strong> ${escapeHtml(customerPhone)}</div>
              <div><strong>Nhan vien ban:</strong> ${escapeHtml(sellerName)}</div>
              <div><strong>Hinh thuc TT:</strong> ${escapeHtml(paymentMethod)}</div>
            </div>

            <table>
              <thead>
                <tr>
                  <th style="width:44px;">STT</th>
                  <th style="width:112px;">Ma hang</th>
                  <th>Ten hang hoa, dich vu</th>
                  <th style="width:90px;">So luong</th>
                  <th style="width:130px;">Don gia</th>
                  <th style="width:140px;">Thanh tien</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>

            <div class="total">
              <div>Tong tien thanh toan</div>
              <div>${totalText}</div>
            </div>

            <div class="footer">
              <div>
                <div><strong>Nguoi mua hang</strong></div>
                <div>(Ky, ghi ro ho ten)</div>
                <div class="signature">${escapeHtml(customerName)}</div>
              </div>
              <div>
                <div><strong>Nguoi ban hang</strong></div>
                <div>(Ky, ghi ro ho ten)</div>
                <div class="signature">${escapeHtml(sellerName)}</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const popup = window.open('', '_blank', 'width=980,height=820');
    if (!popup) {
      alert('Trinh duyet dang chan cua so in. Vui long cho phep popup de in/tai hoa don.');
      return;
    }

    popup.document.open();
    popup.document.write(invoiceHtml);
    popup.document.close();

    setTimeout(() => {
      popup.focus();
      popup.print();
    }, 250);

    setShowPaymentModal(false);
  };

  const openPaymentModal = () => {
    setPaymentReceived(amountDue);
    setShowPaymentModal(true);
  };

  return (
    <div className="min-h-full bg-gray-50 p-6">
      <div className="mb-4">
        <h1 className="text-lg text-gray-900">Thu ngân</h1>
        <p className="mt-0.5 text-xs text-gray-500">Tạo đơn thanh toán, chọn khách hàng và kiểm soát công nợ tại quầy</p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[420px_minmax(0,1fr)]">
        <Card className="gap-0 rounded-xl border-gray-200 shadow-none">
          <CardContent className="p-4">
            <div className="relative mb-4">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={catalogQuery}
                onChange={(event) => setCatalogQuery(event.target.value)}
                placeholder="Tìm theo mã, tên dịch vụ, gói hoặc sản phẩm"
                className="h-11 rounded-xl border border-gray-200 pl-9 pr-12 bg-white"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-blue-600">
                <ShoppingCart className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
              {availableTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                    activeTab === tab
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-blue-200 hover:text-blue-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm uppercase tracking-wide text-blue-600">{activeSectionTitle}</div>
                <button className="text-xs text-blue-600 hover:text-blue-700">Xem tất cả</button>
              </div>
              {visibleCatalogItems.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {visibleCatalogItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => addCatalogItem(item)}
                      className="rounded-xl border border-gray-200 bg-white p-3 text-left transition-all hover:border-blue-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.tone}`}>
                          <span className="text-base text-gray-600">{item.name.slice(0, 1)}</span>
                        </div>
                        <div className="min-w-0">
                          <div className="line-clamp-2 text-sm text-gray-900">{item.name}</div>
                          <div className="mt-0.5 text-xs text-gray-400">{item.subtitle}</div>
                          <div className="mt-2 text-sm text-blue-600">{formatCurrency(item.price)}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-500">
                  {activeTab === 'Gói đã mua'
                    ? 'Khách hàng này chưa có gói đã mua để sử dụng.'
                    : 'Không có dữ liệu phù hợp với bộ lọc hiện tại.'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="gap-0 rounded-xl border-gray-200 shadow-none">
            <CardContent className="p-4">
              <div className="mb-4 flex gap-3">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    value={customerQuery}
                    onChange={(event) => setCustomerQuery(event.target.value)}
                    placeholder="Tìm khách hàng (F4)"
                    className="h-11 rounded-xl border border-gray-200 bg-white pl-9 pr-3"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowAddCustomerModal(true)}
                  className="h-11 w-11 rounded-lg border-gray-200 text-gray-600"
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>

              {selectedCustomer ? (
                <div className="mb-4 rounded-xl border border-gray-200 bg-white px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 bg-blue-100 text-blue-700">
                        <AvatarFallback className="bg-blue-100 text-sm text-blue-700">{getInitials(selectedCustomer.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-gray-900">{selectedCustomer.name}</div>
                          <Badge className="border-blue-200 bg-blue-50 text-blue-600">{selectedCustomer.status}</Badge>
                        </div>
                        <div className="text-xs text-gray-500">{selectedCustomer.code} • {selectedCustomer.phone}</div>
                        <div className="mt-2 flex flex-wrap gap-5 text-xs">
                          <span className="text-gray-500">
                            Công nợ: <span className="text-orange-600">{formatCurrency(selectedCustomer.debt)}</span>
                          </span>
                          <span className="text-gray-500">
                            Điểm: <span className="text-gray-900">{selectedCustomer.score.toLocaleString('vi-VN')}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-xs text-blue-600 hover:text-blue-700">Xem hồ sơ</button>
                      <button
                        onClick={clearSelectedCustomer}
                        className="ml-2 text-xs text-red-500 hover:text-red-600"
                      >
                        Bỏ chọn
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              {customerQuery && (
                <div className="mb-4 rounded-xl border border-gray-200 bg-white p-2">
                  {matchedCustomers.length > 0 ? (
                    <div className="space-y-1">
                      {matchedCustomers.map((customer) => (
                        <button
                          key={customer.id}
                          onClick={() => setSelectedCustomerId(customer.id)}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors ${
                            selectedCustomerId === customer.id
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div>
                            <div className="text-sm text-gray-900">{customer.name}</div>
                            <div className="text-xs text-gray-500">{customer.code} • {customer.phone}</div>
                          </div>
                          <div className="text-xs text-gray-500">
                            Công nợ: <span className="text-orange-600">{formatCurrency(customer.debt)}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">Không tìm thấy khách hàng phù hợp trong mock data.</div>
                  )}
                </div>
              )}

              <div className="overflow-hidden rounded-xl border border-gray-200">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow className="hover:bg-gray-50">
                      <TableHead className="w-10 px-4 text-xs text-gray-500">#</TableHead>
                      <TableHead className="px-3 text-xs text-gray-500">Dịch vụ / Sản phẩm</TableHead>
                      <TableHead className="px-3 text-xs text-gray-500">Nhân viên thực hiện</TableHead>
                      <TableHead className="px-3 text-xs text-gray-500">Nhân viên tư vấn</TableHead>
                      <TableHead className="px-3 text-xs text-gray-500">SL</TableHead>
                      <TableHead className="px-3 text-xs text-gray-500">Đơn giá</TableHead>
                      <TableHead className="px-3 text-xs text-gray-500">Thành tiền</TableHead>
                      <TableHead className="w-14 px-3 text-xs text-gray-500">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detailedLines.map((line, index) => (
                      <TableRow key={line.id} className="hover:bg-white">
                        <TableCell className="px-4 text-sm text-gray-500">{index + 1}</TableCell>
                        <TableCell className="px-3 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${line.item.tone}`}>
                              <span className="text-sm text-gray-600">{line.item.name.slice(0, 1)}</span>
                            </div>
                            <div className="min-w-0">
                              <div className="line-clamp-2 text-sm text-gray-900">{line.item.name}</div>
                              <div className="text-xs text-gray-400">{line.item.subtitle}</div>
                              {line.note && <div className="mt-1 text-xs text-blue-600">Ghi chú: {line.note}</div>}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-3 py-4">
                          <Select
                            value={line.performerId}
                            onValueChange={(value) => updateLine(line.id, { performerId: value })}
                          >
                            <SelectTrigger className="h-10 min-w-[168px] rounded-lg bg-white text-xs">
                              <SelectValue placeholder="Chọn nhân viên" />
                            </SelectTrigger>
                            <SelectContent>
                              {cashierStaffs
                                .filter((staff) => staff.role === 'Kỹ thuật viên')
                                .map((staff) => (
                                  <SelectItem key={staff.id} value={staff.id}>
                                    {staff.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="px-3 py-4">
                          <Select
                            value={line.consultantId}
                            onValueChange={(value) => updateLine(line.id, { consultantId: value })}
                          >
                            <SelectTrigger className="h-10 min-w-[168px] rounded-lg bg-white text-xs">
                              <SelectValue placeholder="Chọn tư vấn" />
                            </SelectTrigger>
                            <SelectContent>
                              {cashierStaffs
                                .filter((staff) => staff.role === 'Tư vấn')
                                .map((staff) => (
                                  <SelectItem key={staff.id} value={staff.id}>
                                    {staff.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="px-3 py-4">
                          <div className="inline-flex items-center rounded-full border border-gray-200 bg-white p-1">
                            <button
                              onClick={() => updateLine(line.id, { quantity: Math.max(1, line.quantity - 1) })}
                              className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="min-w-8 text-center text-sm text-gray-900">{line.quantity}</span>
                            <button
                              onClick={() => updateLine(line.id, { quantity: line.quantity + 1 })}
                              className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </TableCell>
                        <TableCell className="px-3 py-4 text-sm text-gray-700">{formatCurrency(line.item.price)}</TableCell>
                        <TableCell className="px-3 py-4 text-sm text-gray-900">{formatCurrency(line.amount)}</TableCell>
                        <TableCell className="px-3 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => removeLine(line.id)}
                              className="rounded-lg border border-gray-200 p-2 text-gray-400 transition-colors hover:border-red-200 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="rounded-lg border border-gray-200 p-2 text-gray-400 transition-colors hover:border-blue-200 hover:text-blue-600">
                                  <EllipsisVertical className="h-4 w-4" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openLineNote(line.id)}>
                                  Ghi chú
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => duplicateLine(line.id)}>
                                  Thêm dòng
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

            </CardContent>
          </Card>

          <div className="mt-4 flex justify-end">
            <Button
              onClick={openPaymentModal}
              className="h-11 min-w-[180px] rounded-lg bg-blue-600 px-6 text-white hover:bg-blue-700"
            >
              Thanh toán
            </Button>
          </div>
        </div>
      </div>

      <CustomerModal
        isOpen={showAddCustomerModal}
        onClose={() => setShowAddCustomerModal(false)}
        mode="add"
      />

      <Dialog open={!!noteLineId} onOpenChange={(open) => !open && setNoteLineId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ghi chú sản phẩm</DialogTitle>
          </DialogHeader>
          <Textarea
            value={lineNoteDraft}
            onChange={(event) => setLineNoteDraft(event.target.value)}
            placeholder="Nhập ghi chú cho riêng dòng sản phẩm này"
            className="min-h-[120px] rounded-lg bg-white text-sm"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setNoteLineId(null)}>
              Huỷ
            </Button>
            <Button onClick={saveLineNote}>Lưu ghi chú</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="top-1/2 left-1/2 h-[min(860px,calc(100vh-3rem))] w-[min(1180px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 gap-0 overflow-hidden rounded-[24px] border-gray-200 p-0 shadow-2xl sm:max-w-none">
          <div className="grid h-full min-h-0 grid-cols-1 xl:grid-cols-[minmax(0,1fr)_460px]">
            <div className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] bg-white px-6 py-5 xl:px-8 xl:py-6">
              <DialogHeader className="mb-5">
                <DialogTitle className="text-[18px] text-gray-900">
                  Hóa đơn 1 - {selectedCustomer?.name || 'Khách lẻ'}
                </DialogTitle>
                <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
                  <span>Nợ: {formatCurrency(selectedCustomer?.debt || 0)}</span>
                  <span>•</span>
                  <span>Số dư thẻ: 0 đ</span>
                  <span>•</span>
                  <span>Điểm: {selectedCustomer?.score || 0}</span>
                </div>
              </DialogHeader>

              <div className="min-h-0 overflow-y-auto rounded-2xl border border-gray-200">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow className="hover:bg-gray-50">
                      <TableHead className="w-16 px-5 text-xs text-gray-500">STT</TableHead>
                      <TableHead className="px-5 text-xs text-gray-500">Tên hàng</TableHead>
                      <TableHead className="w-28 px-5 text-xs text-gray-500">Số lượng</TableHead>
                      <TableHead className="w-32 px-5 text-xs text-gray-500">Giá bán</TableHead>
                      <TableHead className="w-36 px-5 text-xs text-gray-500">Thành tiền</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detailedLines.map((line, index) => (
                      <TableRow key={`payment-${line.id}`} className="hover:bg-white">
                        <TableCell className="px-5 py-4 text-sm text-gray-700">{index + 1}</TableCell>
                        <TableCell className="px-5 py-4">
                          <div className="text-sm text-gray-900">{line.item.name}</div>
                          <div className="mt-1 text-xs text-gray-400">{line.item.subtitle}</div>
                          {line.note && <div className="mt-1 text-xs text-blue-600">{line.note}</div>}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-sm text-gray-700">{line.quantity}</TableCell>
                        <TableCell className="px-5 py-4 text-sm text-gray-700">{formatCurrency(line.item.price)}</TableCell>
                        <TableCell className="px-5 py-4 text-sm text-gray-900">{formatCurrency(line.amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="relative grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden border-l border-gray-100 bg-gray-50/70 p-5 xl:p-6">
              <div className="mb-3 flex items-center gap-3">
                <Select value={selectedSellerId} onValueChange={setSelectedSellerId}>
                  <SelectTrigger className="h-[46px] w-[170px] rounded-xl border-gray-200 bg-white text-sm text-gray-700">
                    <SelectValue placeholder="Chọn nhân viên bán" />
                  </SelectTrigger>
                  <SelectContent>
                    {cashierStaffs.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-1 items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700">
                  <span className="whitespace-nowrap">{invoiceTime}</span>
                  <div className="flex items-center gap-2 text-gray-400">
                    <CalendarDays className="h-4 w-4" />
                    <Clock3 className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="min-h-0 overflow-hidden pr-1 pb-24">
              <Card className="mb-3 gap-0 rounded-2xl border-gray-200 shadow-none">
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">Tổng tiền hàng</span>
                    <span className="text-gray-900">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-gray-700">Giảm giá</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={discount}
                        onChange={(event) => setDiscount(Number(event.target.value) || 0)}
                        className="h-9 w-28 rounded-xl border border-gray-200 bg-white text-right text-sm"
                      />
                      <span className="text-gray-500">%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-gray-700">Thu khác</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={extraFee}
                        onChange={(event) => setExtraFee(Number(event.target.value) || 0)}
                        className="h-9 w-28 rounded-xl border border-gray-200 bg-white text-right text-sm"
                      />
                      <span className="text-gray-500">đ</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="gap-0 rounded-2xl border-gray-200 shadow-none">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">Khách cần trả</span>
                      <span className="text-[22px] text-blue-600">{formatCurrency(amountDue)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-gray-700">Khách thanh toán</span>
                      <Input
                        type="number"
                        value={paymentReceived}
                        onChange={(event) => setPaymentReceived(Number(event.target.value) || 0)}
                        className="h-10 w-40 rounded-xl border border-gray-200 bg-white text-right text-[18px] text-blue-600"
                      />
                    </div>

                    <div className="rounded-2xl bg-gray-100 p-1">
                      <div className="grid grid-cols-4 gap-1">
                        {['Tiền mặt', 'Chuyển khoản', 'Thẻ', 'Ví'].map((method) => (
                          <button
                            key={method}
                            onClick={() => setPaymentMethod(method)}
                            className={`rounded-xl px-2 py-1.5 text-sm whitespace-nowrap transition-colors ${
                              paymentMethod === method
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      {quickReceiveAmounts.map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setPaymentReceived(amount)}
                          className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                            paymentReceived === amount
                              ? 'border-blue-600 bg-blue-50 text-blue-600'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-blue-200'
                          }`}
                        >
                          {formatCurrency(amount)}
                        </button>
                      ))}
                    </div>

                    <Separator className="my-0.5" />

                    <button
                      onClick={() => setIsPaymentNoteOpen((prev) => !prev)}
                      className="flex w-full items-center justify-between rounded-lg py-1 text-sm text-gray-500 hover:text-gray-700"
                    >
                      <span className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-gray-400" />
                        Ghi chú đơn hàng
                      </span>
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isPaymentNoteOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isPaymentNoteOpen && (
                      <Textarea
                        value={paymentNote}
                        onChange={(event) => setPaymentNote(event.target.value)}
                        placeholder="Nhập ghi chú thanh toán"
                        className="min-h-[56px] rounded-xl border border-gray-200 bg-white text-sm"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
              </div>
              <div className="absolute right-6 bottom-6 z-30">
                <Button
                  onClick={handleCompletePayment}
                  className="h-11 min-w-[220px] rounded-xl bg-blue-600 px-8 text-white shadow-lg hover:bg-blue-700"
                >
                  Hoàn thành
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
