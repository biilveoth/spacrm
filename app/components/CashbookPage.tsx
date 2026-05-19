import { Fragment, useMemo, useState } from 'react';
import { Link } from 'react-router';
import {
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock3,
  Circle,
  FileUp,
  Info,
  MoreHorizontal,
  PencilLine,
  Plus,
  Printer,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from 'lucide-react';
import { cashierStaffs, customers } from '../data/mockData';
import { Checkbox } from './ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import {
  Dialog,
  DialogContent,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { Textarea } from './ui/textarea';

type CashFund = 'Tiền mặt' | 'Ngân hàng' | 'Ví điện tử' | 'Tổng quỹ';
type CashbookStatus = 'Đã thanh toán' | 'Đã huỷ';
type FilterStatus = 'Tất cả' | CashbookStatus;
type PayerReceiverType = 'Khách hàng' | 'Nhà cung cấp' | 'Nhân viên' | 'Khác';
type IncomeExpenseFilter = 'Tất cả' | 'Chi trả lương NV' | 'Tiền hàng' | 'Khác';
type DocumentType = 'Phiếu thu' | 'Phiếu chi';
type BusinessResult = 'Có hạch toán' | 'Không có hạch toán';
type VoucherMethod = 'Tiền mặt' | 'Chuyển khoản' | 'Ví điện tử';
type VoucherSource = 'Thủ công' | 'Sau hóa đơn đã chốt';
type SourceFilter = 'Tất cả' | VoucherSource;
type AdjustmentType =
  | 'Không áp dụng'
  | 'Thu thêm'
  | 'Điều chỉnh tăng'
  | 'Hoàn tiền'
  | 'Điều chỉnh giảm'
  | 'Chênh lệch đối soát tăng'
  | 'Chênh lệch đối soát giảm';
type ColumnKey =
  | 'code'
  | 'time'
  | 'transaction'
  | 'sourceType'
  | 'relatedInvoice'
  | 'relatedTreatmentSession'
  | 'adjustmentType'
  | 'adjustmentReason'
  | 'creator'
  | 'branch'
  | 'incomeExpenseType'
  | 'accountNumber'
  | 'payerReceiver'
  | 'payerReceiverCode'
  | 'payerReceiverPhone'
  | 'amount'
  | 'transferContent'
  | 'note'
  | 'reconciliationNote'
  | 'cashFund'
  | 'status';

type InvoiceStatus = 'Chưa thanh toán' | 'Thanh toán một phần' | 'Đã thanh toán';

interface InvoiceSummary {
  code: string;
  time: string;
  total: number;
  receivedBefore: number;
  payment: number;
  status: InvoiceStatus;
}

interface CashbookRecord {
  id: string;
  code: string;
  time: string;
  transaction: string;
  creator: string;
  branch: string;
  incomeExpenseType: string;
  accountNumber: string;
  payerReceiverType: PayerReceiverType;
  payerReceiver: string;
  payerReceiverCode: string;
  payerReceiverPhone: string;
  amount: number;
  transferContent: string;
  note: string;
  cashFund: CashFund;
  status: CashbookStatus;
  documentType: DocumentType;
  businessResult: BusinessResult;
  sourceType?: VoucherSource;
  relatedInvoiceCode?: string;
  relatedTreatmentSession?: string;
  adjustmentType?: AdjustmentType;
  adjustmentReason?: string;
  reconciliationNote?: string;
  originalInvoiceTotal?: number;
  finalizedAt?: string;
  finalizedBy?: string;
}

interface RelatedInvoice {
  code: string;
  status: 'Nháp' | 'Đã chốt' | 'Đã thanh toán' | 'Hoàn tất';
  customerName: string;
  customerCode: string;
  customerPhone: string;
  branch: string;
  total: number;
  paid: number;
  finalizedAt: string;
  finalizedBy: string;
  cashier: string;
  treatmentSession?: string;
  therapist?: string;
}

const records: CashbookRecord[] = [
  {
    id: '1',
    code: 'TTM000039',
    time: '23/04/2026 16:40',
    transaction: '',
    creator: 'Nguyễn Thị Hoa',
    branch: 'Chi nhánh trung tâm',
    incomeExpenseType: 'Thu nhập khác',
    accountNumber: '',
    payerReceiverType: 'Khác',
    payerReceiver: '',
    payerReceiverCode: '',
    payerReceiverPhone: '',
    amount: 500000,
    transferContent: '',
    note: 'Thu tiền mặt cuối ngày',
    cashFund: 'Tiền mặt',
    status: 'Đã thanh toán',
    documentType: 'Phiếu thu',
    businessResult: 'Không có hạch toán',
  },
  {
    id: '2',
    code: 'TTHD034510',
    time: '23/04/2026 13:16',
    transaction: 'HD034510',
    creator: 'Trần Minh Anh',
    branch: 'Chi nhánh trung tâm',
    incomeExpenseType: 'Thu Tiền khách trả',
    accountNumber: '9704229200',
    payerReceiverType: 'Khách hàng',
    payerReceiver: 'Trần Kim Thơm',
    payerReceiverCode: 'KH001404',
    payerReceiverPhone: '0986189489',
    amount: 1200000,
    transferContent: 'Khách chuyển khoản hóa đơn HD034510',
    note: '',
    cashFund: 'Ngân hàng',
    status: 'Đã thanh toán',
    documentType: 'Phiếu thu',
    businessResult: 'Có hạch toán',
  },
  {
    id: '3',
    code: 'TT001631',
    time: '23/04/2026 08:48',
    transaction: 'HD033832',
    creator: 'Lê Thu Trang',
    branch: 'Chi nhánh trung tâm',
    incomeExpenseType: 'Thu Tiền khách trả',
    accountNumber: '9704229200',
    payerReceiverType: 'Khách hàng',
    payerReceiver: 'Trần Thị Tư',
    payerReceiverCode: 'KH001844',
    payerReceiverPhone: '0354766004',
    amount: 950000,
    transferContent: 'Thu hộ đơn HD033832',
    note: '',
    cashFund: 'Ngân hàng',
    status: 'Đã thanh toán',
    documentType: 'Phiếu thu',
    businessResult: 'Có hạch toán',
  },
  {
    id: '4',
    code: 'TTHD034504',
    time: '22/04/2026 18:24',
    transaction: 'HD034504',
    creator: 'Phạm Quỳnh Nga',
    branch: 'Chi nhánh trung tâm',
    incomeExpenseType: 'Thu Tiền khách trả',
    accountNumber: '',
    payerReceiverType: 'Khách hàng',
    payerReceiver: 'Đỗ Thị Lý',
    payerReceiverCode: 'KH001339',
    payerReceiverPhone: '0917201428',
    amount: 2100000,
    transferContent: '',
    note: '',
    cashFund: 'Tiền mặt',
    status: 'Đã thanh toán',
    documentType: 'Phiếu thu',
    businessResult: 'Có hạch toán',
  },
  {
    id: '5',
    code: 'CTM002557',
    time: '21/04/2026 18:02',
    transaction: '',
    creator: 'Nguyễn Thị Hoa',
    branch: 'Chi nhánh trung tâm',
    incomeExpenseType: 'Chi 6238 - Chi phí bằng tiền khác',
    accountNumber: '0011223344',
    payerReceiverType: 'Nhân viên',
    payerReceiver: 'Lại Thị Thương',
    payerReceiverCode: 'KH001446',
    payerReceiverPhone: '0904462629',
    amount: 350000,
    transferContent: 'Chi phí văn phòng',
    note: 'Phiếu chi nội bộ',
    cashFund: 'Tiền mặt',
    status: 'Đã thanh toán',
    documentType: 'Phiếu chi',
    businessResult: 'Không có hạch toán',
  },
  {
    id: '6',
    code: 'CTM002556',
    time: '21/04/2026 12:12',
    transaction: '',
    creator: 'Trần Minh Anh',
    branch: 'Chi nhánh trung tâm',
    incomeExpenseType: 'Chi 1562 - Chi phí vận chuyển mua và bán hàng',
    accountNumber: '9704229200',
    payerReceiverType: 'Khác',
    payerReceiver: 'shipper',
    payerReceiverCode: 'NCC001',
    payerReceiverPhone: '9704229200',
    amount: 200000,
    transferContent: 'Chuyển khoản ship nội thành',
    note: '',
    cashFund: 'Ví điện tử',
    status: 'Đã thanh toán',
    documentType: 'Phiếu chi',
    businessResult: 'Có hạch toán',
  },
  {
    id: '7',
    code: 'TTHD034469',
    time: '21/04/2026 12:21',
    transaction: 'HD034469',
    creator: 'Lê Thu Trang',
    branch: 'Chi nhánh trung tâm',
    incomeExpenseType: 'Thu Tiền khách trả',
    accountNumber: '',
    payerReceiverType: 'Khách hàng',
    payerReceiver: 'Hoàng Thị Chiến',
    payerReceiverCode: 'KH001803',
    payerReceiverPhone: '0965364203',
    amount: 1450000,
    transferContent: '',
    note: '',
    cashFund: 'Tiền mặt',
    status: 'Đã thanh toán',
    documentType: 'Phiếu thu',
    businessResult: 'Có hạch toán',
  },
  {
    id: '8',
    code: 'PTBS000041',
    time: '23/04/2026 17:05',
    transaction: 'HDN-240423-001',
    creator: 'Trần Minh Anh',
    branch: 'Chi nhánh trung tâm',
    incomeExpenseType: 'Thu bổ sung sau hóa đơn đã chốt',
    accountNumber: '9704229200',
    payerReceiverType: 'Khách hàng',
    payerReceiver: 'Phạm Thị Hương',
    payerReceiverCode: 'KH0004',
    payerReceiverPhone: '*****20473',
    amount: 100000,
    transferContent: 'Thu bổ sung hóa đơn HDN-240423-001',
    note: 'Khách thanh toán bổ sung phần thiếu sau đối soát.',
    cashFund: 'Ngân hàng',
    status: 'Đã thanh toán',
    documentType: 'Phiếu thu',
    businessResult: 'Có hạch toán',
    sourceType: 'Sau hóa đơn đã chốt',
    relatedInvoiceCode: 'HDN-240423-001',
    relatedTreatmentSession: 'Buổi 2/5 - Laser công nghệ cao - Ngày 19/05/2026 - KTV Nguyễn Thị Hoa',
    adjustmentType: 'Thu thêm',
    adjustmentReason: 'Thu thêm do hóa đơn đã chốt thiếu sản phẩm bán.',
    reconciliationNote: 'Khách xác nhận chuyển khoản bổ sung lúc 17:00.',
    originalInvoiceTotal: 450000,
    finalizedAt: '23/04/2026 14:54',
    finalizedBy: 'Nguyễn Văn A',
  },
  {
    id: '9',
    code: 'PCBS000018',
    time: '23/04/2026 17:20',
    transaction: 'HD034504',
    creator: 'Phạm Quỳnh Nga',
    branch: 'Chi nhánh trung tâm',
    incomeExpenseType: 'Hoàn tiền sau hóa đơn đã chốt',
    accountNumber: '',
    payerReceiverType: 'Khách hàng',
    payerReceiver: 'Đỗ Thị Lý',
    payerReceiverCode: 'KH001339',
    payerReceiverPhone: '0917201428',
    amount: 200000,
    transferContent: '',
    note: 'Hoàn tiền do tính sai giá dịch vụ.',
    cashFund: 'Tiền mặt',
    status: 'Đã thanh toán',
    documentType: 'Phiếu chi',
    businessResult: 'Có hạch toán',
    sourceType: 'Sau hóa đơn đã chốt',
    relatedInvoiceCode: 'HD034504',
    relatedTreatmentSession: '',
    adjustmentType: 'Hoàn tiền',
    adjustmentReason: 'Hoàn tiền do tính sai giá dịch vụ.',
    reconciliationNote: 'Quản lý chi nhánh đã duyệt hoàn tiền.',
    originalInvoiceTotal: 2100000,
    finalizedAt: '22/04/2026 18:24',
    finalizedBy: 'Phạm Quỳnh Nga',
  },
  {
    id: '10',
    code: 'PTBS000042',
    time: '24/04/2026 09:12',
    transaction: 'HD034510',
    creator: 'Nguyễn Thị Hoa',
    branch: 'Chi nhánh trung tâm',
    incomeExpenseType: 'Điều chỉnh tăng sau đối soát',
    accountNumber: '',
    payerReceiverType: 'Khách hàng',
    payerReceiver: 'Trần Kim Thơm',
    payerReceiverCode: 'KH001404',
    payerReceiverPhone: '0986189489',
    amount: 150000,
    transferContent: '',
    note: 'Điều chỉnh tăng do sai lệch quỹ cuối ngày.',
    cashFund: 'Tiền mặt',
    status: 'Đã thanh toán',
    documentType: 'Phiếu thu',
    businessResult: 'Có hạch toán',
    sourceType: 'Sau hóa đơn đã chốt',
    relatedInvoiceCode: 'HD034510',
    relatedTreatmentSession: '',
    adjustmentType: 'Điều chỉnh tăng',
    adjustmentReason: 'Điều chỉnh tăng do phát hiện nhập thiếu phụ phí sau khi hóa đơn đã chốt.',
    reconciliationNote: 'Kế toán xác nhận lệch trong biên bản đối soát ngày 24/04.',
    originalInvoiceTotal: 1200000,
    finalizedAt: '23/04/2026 13:16',
    finalizedBy: 'Trần Minh Anh',
  },
  {
    id: '11',
    code: 'PCBS000019',
    time: '24/04/2026 10:40',
    transaction: 'HDN-240423-001',
    creator: 'Trần Minh Anh',
    branch: 'Chi nhánh trung tâm',
    incomeExpenseType: 'Điều chỉnh giảm sau hóa đơn đã chốt',
    accountNumber: '9704229200',
    payerReceiverType: 'Khách hàng',
    payerReceiver: 'Phạm Thị Hương',
    payerReceiverCode: 'KH0004',
    payerReceiverPhone: '*****20473',
    amount: 50000,
    transferContent: 'Hoàn chênh lệch hóa đơn HDN-240423-001',
    note: 'Hoàn phần chênh lệch do áp sai ưu đãi.',
    cashFund: 'Ngân hàng',
    status: 'Đã thanh toán',
    documentType: 'Phiếu chi',
    businessResult: 'Có hạch toán',
    sourceType: 'Sau hóa đơn đã chốt',
    relatedInvoiceCode: 'HDN-240423-001',
    relatedTreatmentSession: 'Buổi 2/5 - Laser công nghệ cao - Ngày 19/05/2026 - KTV Nguyễn Thị Hoa',
    adjustmentType: 'Điều chỉnh giảm',
    adjustmentReason: 'Hoàn lại phần chênh do áp sai chương trình ưu đãi sau khi hóa đơn đã chốt.',
    reconciliationNote: 'Khách đồng ý nhận hoàn qua chuyển khoản. Quản lý duyệt lúc 10:30.',
    originalInvoiceTotal: 450000,
    finalizedAt: '23/04/2026 14:54',
    finalizedBy: 'Nguyễn Văn A',
  },
  {
    id: '12',
    code: 'PTBS000043',
    time: '24/04/2026 14:05',
    transaction: 'HD034469',
    creator: 'Lê Thu Trang',
    branch: 'Chi nhánh trung tâm',
    incomeExpenseType: 'Chênh lệch đối soát tăng',
    accountNumber: 'Momo Business',
    payerReceiverType: 'Khách hàng',
    payerReceiver: 'Hoàng Thị Chiến',
    payerReceiverCode: 'KH001803',
    payerReceiverPhone: '0965364203',
    amount: 80000,
    transferContent: 'Bù chênh lệch ví điện tử HD034469',
    note: 'Ghi nhận chênh lệch đối soát ví điện tử.',
    cashFund: 'Ví điện tử',
    status: 'Đã thanh toán',
    documentType: 'Phiếu thu',
    businessResult: 'Không có hạch toán',
    sourceType: 'Sau hóa đơn đã chốt',
    relatedInvoiceCode: 'HD034469',
    relatedTreatmentSession: '',
    adjustmentType: 'Chênh lệch đối soát tăng',
    adjustmentReason: 'Chênh lệch đối soát ví điện tử ghi nhận thiếu so với hóa đơn đã chốt.',
    reconciliationNote: 'Đối soát với sao kê ví điện tử ngày 24/04.',
    originalInvoiceTotal: 1450000,
    finalizedAt: '21/04/2026 12:21',
    finalizedBy: 'Lê Thu Trang',
  },
  {
    id: '13',
    code: 'PCBS000020',
    time: '24/04/2026 15:18',
    transaction: 'HD033832',
    creator: 'Nguyễn Văn A',
    branch: 'Chi nhánh trung tâm',
    incomeExpenseType: 'Chênh lệch đối soát giảm',
    accountNumber: '9704229200',
    payerReceiverType: 'Khách hàng',
    payerReceiver: 'Trần Thị Tư',
    payerReceiverCode: 'KH001844',
    payerReceiverPhone: '0354766004',
    amount: 30000,
    transferContent: 'Điều chỉnh giảm hóa đơn HD033832',
    note: 'Phiếu hủy do nhập trùng khoản chênh lệch.',
    cashFund: 'Ngân hàng',
    status: 'Đã huỷ',
    documentType: 'Phiếu chi',
    businessResult: 'Không có hạch toán',
    sourceType: 'Sau hóa đơn đã chốt',
    relatedInvoiceCode: 'HD033832',
    relatedTreatmentSession: '',
    adjustmentType: 'Chênh lệch đối soát giảm',
    adjustmentReason: 'Điều chỉnh giảm do sai lệch sau đối soát chuyển khoản.',
    reconciliationNote: 'Phiếu đã bị hủy vì phát hiện trùng với chứng từ PCBS000017.',
    originalInvoiceTotal: 950000,
    finalizedAt: '23/04/2026 08:48',
    finalizedBy: 'Lê Thu Trang',
  },
  {
    id: '14',
    code: 'PTBS000044',
    time: '25/04/2026 08:30',
    transaction: 'HD034504',
    creator: 'Phạm Quỳnh Nga',
    branch: 'Cơ sở Thanh Xuân',
    incomeExpenseType: 'Thu bổ sung sau hóa đơn đã chốt',
    accountNumber: 'MB Bank - 46881999',
    payerReceiverType: 'Khách hàng',
    payerReceiver: 'Đỗ Thị Lý',
    payerReceiverCode: 'KH001339',
    payerReceiverPhone: '0917201428',
    amount: 250000,
    transferContent: 'Thu thêm dịch vụ còn thiếu HD034504',
    note: 'Thu thêm do thiếu dòng dịch vụ phụ trợ.',
    cashFund: 'Ngân hàng',
    status: 'Đã thanh toán',
    documentType: 'Phiếu thu',
    businessResult: 'Có hạch toán',
    sourceType: 'Sau hóa đơn đã chốt',
    relatedInvoiceCode: 'HD034504',
    relatedTreatmentSession: '',
    adjustmentType: 'Thu thêm',
    adjustmentReason: 'Thu thêm do sau khi chốt mới phát hiện thiếu dịch vụ phụ trợ cần tính tiền.',
    reconciliationNote: 'Khách thanh toán bổ sung bằng chuyển khoản, đã đối soát với sao kê ngân hàng.',
    originalInvoiceTotal: 2100000,
    finalizedAt: '22/04/2026 18:24',
    finalizedBy: 'Phạm Quỳnh Nga',
  },
];

const relatedInvoices: RelatedInvoice[] = [
  {
    code: 'HDN-240423-001',
    status: 'Đã thanh toán',
    customerName: 'Phạm Thị Hương',
    customerCode: 'KH0004',
    customerPhone: '*****20473',
    branch: 'Chi nhánh trung tâm',
    total: 450000,
    paid: 450000,
    finalizedAt: '23/04/2026 14:54',
    finalizedBy: 'Nguyễn Văn A',
    cashier: 'Nguyễn Văn A',
    treatmentSession: 'Buổi 2/5 - Laser công nghệ cao - Ngày 19/05/2026 - KTV Nguyễn Thị Hoa',
    therapist: 'Nguyễn Thị Hoa',
  },
  {
    code: 'HD034504',
    status: 'Đã chốt',
    customerName: 'Đỗ Thị Lý',
    customerCode: 'KH001339',
    customerPhone: '0917201428',
    branch: 'Chi nhánh trung tâm',
    total: 2100000,
    paid: 2100000,
    finalizedAt: '22/04/2026 18:24',
    finalizedBy: 'Phạm Quỳnh Nga',
    cashier: 'Phạm Quỳnh Nga',
  },
  {
    code: 'HD034510',
    status: 'Đã thanh toán',
    customerName: 'Trần Kim Thơm',
    customerCode: 'KH001404',
    customerPhone: '0986189489',
    branch: 'Chi nhánh trung tâm',
    total: 1200000,
    paid: 1200000,
    finalizedAt: '23/04/2026 13:16',
    finalizedBy: 'Trần Minh Anh',
    cashier: 'Trần Minh Anh',
  },
  {
    code: 'HD034469',
    status: 'Hoàn tất',
    customerName: 'Hoàng Thị Chiến',
    customerCode: 'KH001803',
    customerPhone: '0965364203',
    branch: 'Chi nhánh trung tâm',
    total: 1450000,
    paid: 1450000,
    finalizedAt: '21/04/2026 12:21',
    finalizedBy: 'Lê Thu Trang',
    cashier: 'Lê Thu Trang',
  },
  {
    code: 'HD033832',
    status: 'Đã chốt',
    customerName: 'Trần Thị Tư',
    customerCode: 'KH001844',
    customerPhone: '0354766004',
    branch: 'Chi nhánh trung tâm',
    total: 950000,
    paid: 950000,
    finalizedAt: '23/04/2026 08:48',
    finalizedBy: 'Lê Thu Trang',
    cashier: 'Lê Thu Trang',
  },
  {
    code: 'HD-DRAFT-001',
    status: 'Nháp',
    customerName: 'Nguyễn Thị Nhật',
    customerCode: 'KH0005',
    customerPhone: '*****54673',
    branch: 'Chi nhánh trung tâm',
    total: 650000,
    paid: 0,
    finalizedAt: '',
    finalizedBy: '',
    cashier: 'Nguyễn Văn A',
  },
];

const cashFundOptions: CashFund[] = ['Tiền mặt', 'Ngân hàng', 'Ví điện tử', 'Tổng quỹ'];
const voucherCreateOptions: Array<Exclude<CashFund, 'Tổng quỹ'>> = ['Tiền mặt', 'Ngân hàng', 'Ví điện tử'];
const voucherTypeOptionsByMode: Record<DocumentType, string[]> = {
  'Phiếu thu': ['Thu nhập khác', 'Thu tiền khách trả', 'Thu khác'],
  'Phiếu chi': ['Chi phí khác', 'Chi trả lương NV', 'Chi tiền hàng'],
};
const adjustmentOptionsByMode: Record<DocumentType, AdjustmentType[]> = {
  'Phiếu thu': ['Thu thêm', 'Điều chỉnh tăng', 'Chênh lệch đối soát tăng'],
  'Phiếu chi': ['Hoàn tiền', 'Điều chỉnh giảm', 'Chênh lệch đối soát giảm'],
};
const statusOptions: FilterStatus[] = ['Tất cả', 'Đã thanh toán', 'Đã huỷ'];
const sourceOptions: SourceFilter[] = ['Tất cả', 'Thủ công', 'Sau hóa đơn đã chốt'];
const payerReceiverTypeOptions: PayerReceiverType[] = ['Khách hàng', 'Nhà cung cấp', 'Nhân viên', 'Khác'];
const incomeExpenseTypeOptions: IncomeExpenseFilter[] = ['Tất cả', 'Chi trả lương NV', 'Tiền hàng', 'Khác'];
const documentTypeOptions: Array<'Tất cả' | DocumentType> = ['Tất cả', 'Phiếu thu', 'Phiếu chi'];
const businessResultOptions: Array<'Tất cả' | BusinessResult> = ['Tất cả', 'Có hạch toán', 'Không có hạch toán'];
const adjustmentFilterOptions: Array<'Tất cả' | AdjustmentType> = [
  'Tất cả',
  'Thu thêm',
  'Điều chỉnh tăng',
  'Hoàn tiền',
  'Điều chỉnh giảm',
  'Chênh lệch đối soát tăng',
  'Chênh lệch đối soát giảm',
];
const columnOptions: { key: ColumnKey; label: string }[] = [
  { key: 'code', label: 'Mã phiếu' },
  { key: 'time', label: 'Thời gian' },
  { key: 'transaction', label: 'Giao dịch' },
  { key: 'sourceType', label: 'Nguồn phát sinh' },
  { key: 'relatedInvoice', label: 'Hóa đơn liên quan' },
  { key: 'relatedTreatmentSession', label: 'Buổi điều trị liên quan' },
  { key: 'adjustmentType', label: 'Loại điều chỉnh' },
  { key: 'adjustmentReason', label: 'Lý do phát sinh' },
  { key: 'creator', label: 'Người tạo' },
  { key: 'branch', label: 'Chi nhánh' },
  { key: 'incomeExpenseType', label: 'Loại thu chi' },
  { key: 'accountNumber', label: 'Số tài khoản' },
  { key: 'payerReceiver', label: 'Người nộp/nhận' },
  { key: 'payerReceiverCode', label: 'Mã người nộp/nhận' },
  { key: 'payerReceiverPhone', label: 'SĐT người nộp/nhận' },
  { key: 'amount', label: 'Số tiền' },
  { key: 'transferContent', label: 'Nội dung chuyển khoản' },
  { key: 'note', label: 'Ghi chú' },
  { key: 'reconciliationNote', label: 'Ghi chú đối soát' },
  { key: 'cashFund', label: 'Quỹ tiền' },
  { key: 'status', label: 'Trạng thái' },
];

const formatCurrency = (value: number) => `${value.toLocaleString('vi-VN')} đ`;

export function CashbookPage() {
  const [cashbookRecords, setCashbookRecords] = useState(records);
  const [search, setSearch] = useState('');
  const [cashFund, setCashFund] = useState<CashFund>('Tiền mặt');
  const [status, setStatus] = useState<FilterStatus>('Tất cả');
  const [dateFrom, setDateFrom] = useState('2026-04-01');
  const [dateTo, setDateTo] = useState('2026-04-23');
  const [creatorId, setCreatorId] = useState<string>('all');
  const [employeeId, setEmployeeId] = useState<string>('all');
  const [payerReceiverType, setPayerReceiverType] = useState<PayerReceiverType>('Khách hàng');
  const [payerReceiverName, setPayerReceiverName] = useState('');
  const [payerReceiverCode, setPayerReceiverCode] = useState('');
  const [payerReceiverPhone, setPayerReceiverPhone] = useState('');
  const [incomeExpenseType, setIncomeExpenseType] = useState<IncomeExpenseFilter>('Tất cả');
  const [documentType, setDocumentType] = useState<'Tất cả' | DocumentType>('Tất cả');
  const [businessResult, setBusinessResult] = useState<'Tất cả' | BusinessResult>('Tất cả');
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('Tất cả');
  const [relatedInvoiceFilter, setRelatedInvoiceFilter] = useState('');
  const [adjustmentTypeFilter, setAdjustmentTypeFilter] = useState<'Tất cả' | AdjustmentType>('Tất cả');
  const [visibleColumns, setVisibleColumns] = useState<Record<ColumnKey, boolean>>(
    Object.fromEntries(columnOptions.map((column) => [column.key, true])) as Record<ColumnKey, boolean>,
  );
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);
  const [showEditVoucherModal, setShowEditVoucherModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<CashbookRecord | null>(null);
  const [editVoucherTime, setEditVoucherTime] = useState('');
  const [editVoucherStaff, setEditVoucherStaff] = useState('');
  const [editVoucherPayerType, setEditVoucherPayerType] = useState<PayerReceiverType>('Khác');
  const [editVoucherMethod, setEditVoucherMethod] = useState<VoucherMethod>('Chuyển khoản');
  const [editVoucherAmount, setEditVoucherAmount] = useState('');
  const [editVoucherNote, setEditVoucherNote] = useState('');
  const [showCreateVoucherModal, setShowCreateVoucherModal] = useState(false);
  const [createVoucherMode, setCreateVoucherMode] = useState<DocumentType>('Phiếu thu');
  const [createVoucherFund, setCreateVoucherFund] = useState<Exclude<CashFund, 'Tổng quỹ'>>('Tiền mặt');
  const [voucherTime, setVoucherTime] = useState('23/04/2026 17:13');
  const [voucherType, setVoucherType] = useState('Thu nhập khác');
  const [payerType, setPayerType] = useState<PayerReceiverType>('Khác');
  const [payerName, setPayerName] = useState('');
  const [voucherMethod, setVoucherMethod] = useState<VoucherMethod>('Chuyển khoản');
  const [voucherAccount, setVoucherAccount] = useState('');
  const [voucherAmount, setVoucherAmount] = useState('0');
  const [voucherNote, setVoucherNote] = useState('');
  const [voucherSource, setVoucherSource] = useState<VoucherSource>('Thủ công');
  const [selectedInvoiceCode, setSelectedInvoiceCode] = useState('');
  const [adjustmentType, setAdjustmentType] = useState<AdjustmentType>('Không áp dụng');
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [reconciliationNote, setReconciliationNote] = useState('');
  const [createVoucherError, setCreateVoucherError] = useState('');
  const [isBusinessAccounting, setIsBusinessAccounting] = useState(true);
  const [showAddVoucherTypeModal, setShowAddVoucherTypeModal] = useState(false);
  const [newVoucherTypeName, setNewVoucherTypeName] = useState('');
  const [newVoucherTypeDescription, setNewVoucherTypeDescription] = useState('');
  const [newVoucherTypeAccounting, setNewVoucherTypeAccounting] = useState(true);
  const [showAddPayerModal, setShowAddPayerModal] = useState(false);
  const [newPayerName, setNewPayerName] = useState('');
  const [newPayerPhone, setNewPayerPhone] = useState('');
  const [newPayerAddress, setNewPayerAddress] = useState('');
  const [newPayerCity, setNewPayerCity] = useState('');
  const [newPayerWard, setNewPayerWard] = useState('');
  const [newPayerNote, setNewPayerNote] = useState('');
  const [payerPickerOpen, setPayerPickerOpen] = useState(false);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountNumber, setNewAccountNumber] = useState('');
  const [newAccountBank, setNewAccountBank] = useState('');
  const [newAccountBranch, setNewAccountBranch] = useState('');
  const [newAccountOwner, setNewAccountOwner] = useState('');
  const [newAccountNote, setNewAccountNote] = useState('');

  const openCreateVoucherModal = (mode: DocumentType, fund: Exclude<CashFund, 'Tổng quỹ'>) => {
    setCreateVoucherMode(mode);
    setCreateVoucherFund(fund);
    setVoucherType(mode === 'Phiếu thu' ? 'Thu nhập khác' : 'Chi phí khác');
    setPayerType('Khác');
    setPayerName('');
    setVoucherMethod(fund === 'Ví điện tử' ? 'Ví điện tử' : 'Chuyển khoản');
    setVoucherAccount('');
    setVoucherAmount('0');
    setVoucherNote('');
    setVoucherSource('Thủ công');
    setSelectedInvoiceCode('');
    setAdjustmentType('Không áp dụng');
    setAdjustmentReason('');
    setReconciliationNote('');
    setCreateVoucherError('');
    setIsBusinessAccounting(true);
    setShowCreateVoucherModal(true);
  };
  const openAddVoucherTypeModal = () => {
    setNewVoucherTypeName('');
    setNewVoucherTypeDescription('');
    setNewVoucherTypeAccounting(true);
    setShowAddVoucherTypeModal(true);
  };
  const saveVoucherType = () => {
    const nextType = newVoucherTypeName.trim();
    if (!nextType) return;
    setVoucherType(nextType);
    setIsBusinessAccounting(newVoucherTypeAccounting);
    setShowAddVoucherTypeModal(false);
  };
  const openAddPayerModal = () => {
    setNewPayerName('');
    setNewPayerPhone('');
    setNewPayerAddress('');
    setNewPayerCity('');
    setNewPayerWard('');
    setNewPayerNote('');
    setShowAddPayerModal(true);
  };
  const savePayer = () => {
    const name = newPayerName.trim();
    const phone = newPayerPhone.trim();
    if (!name || !phone) return;
    setPayerName(name);
    setShowAddPayerModal(false);
  };
  const openAddAccountModal = () => {
    setNewAccountName('');
    setNewAccountNumber('');
    setNewAccountBank('');
    setNewAccountBranch('');
    setNewAccountOwner('');
    setNewAccountNote('');
    setShowAddAccountModal(true);
  };
  const saveAccount = () => {
    const accountName = newAccountName.trim();
    if (!accountName) return;
    setVoucherAccount(accountName);
    setShowAddAccountModal(false);
  };
  const selectedInvoice = relatedInvoices.find((invoice) => invoice.code === selectedInvoiceCode) || null;
  const applyRelatedInvoice = (invoiceCode: string) => {
    const invoice = relatedInvoices.find((item) => item.code === invoiceCode);
    setSelectedInvoiceCode(invoiceCode);
    if (!invoice) return;
    setPayerType('Khách hàng');
    setPayerName(invoice.customerName);
    setCreateVoucherError(invoice.status === 'Nháp' ? 'Hóa đơn chưa chốt. Vui lòng điều chỉnh trực tiếp tại màn hình Thu ngân.' : '');
  };
  const changeVoucherSource = (source: VoucherSource) => {
    setVoucherSource(source);
    setCreateVoucherError('');
    if (source === 'Sau hóa đơn đã chốt') {
      setPayerType('Khách hàng');
      setVoucherType(createVoucherMode === 'Phiếu thu' ? 'Thu bổ sung sau hóa đơn đã chốt' : 'Hoàn tiền sau hóa đơn đã chốt');
      setAdjustmentType(adjustmentOptionsByMode[createVoucherMode][0]);
    } else {
      setSelectedInvoiceCode('');
      setAdjustmentType('Không áp dụng');
      setAdjustmentReason('');
      setReconciliationNote('');
    }
  };
  const saveCreateVoucher = () => {
    const parsedAmount = Number(voucherAmount.replace(/[^\d]/g, ''));
    if (parsedAmount <= 0) {
      setCreateVoucherError('Số tiền phải lớn hơn 0.');
      return;
    }

    if (voucherSource === 'Sau hóa đơn đã chốt') {
      if (!selectedInvoice) {
        setCreateVoucherError('Vui lòng chọn hóa đơn liên quan.');
        return;
      }
      if (selectedInvoice.status === 'Nháp') {
        setCreateVoucherError('Hóa đơn chưa chốt. Vui lòng điều chỉnh trực tiếp tại màn hình Thu ngân.');
        return;
      }
      if (!adjustmentOptionsByMode[createVoucherMode].includes(adjustmentType)) {
        setCreateVoucherError('Loại điều chỉnh không phù hợp với loại phiếu đang tạo.');
        return;
      }
      if (!adjustmentReason.trim()) {
        setCreateVoucherError('Vui lòng nhập lý do phát sinh sau hóa đơn đã chốt.');
        return;
      }
      if (createVoucherMode === 'Phiếu chi' && parsedAmount > selectedInvoice.paid) {
        setCreateVoucherError('Số tiền hoàn không được vượt quá số tiền đã thanh toán của hóa đơn gốc.');
        return;
      }
    }

    const nextRecord: CashbookRecord = {
      id: `${Date.now()}`,
      code: `${createVoucherMode === 'Phiếu thu' ? 'PT' : 'PC'}${String(Date.now()).slice(-6)}`,
      time: voucherTime,
      transaction: selectedInvoice?.code || '',
      creator: 'Nguyễn Văn A',
      branch: selectedInvoice?.branch || 'Chi nhánh trung tâm',
      incomeExpenseType: voucherType,
      accountNumber: voucherAccount,
      payerReceiverType: payerType,
      payerReceiver: payerName || selectedInvoice?.customerName || '',
      payerReceiverCode: selectedInvoice?.customerCode || '',
      payerReceiverPhone: selectedInvoice?.customerPhone || '',
      amount: parsedAmount,
      transferContent: selectedInvoice ? `${voucherType} hóa đơn ${selectedInvoice.code}` : '',
      note: voucherNote,
      cashFund: createVoucherFund,
      status: 'Đã thanh toán',
      documentType: createVoucherMode,
      businessResult: isBusinessAccounting ? 'Có hạch toán' : 'Không có hạch toán',
      sourceType: voucherSource,
      relatedInvoiceCode: selectedInvoice?.code,
      relatedTreatmentSession: selectedInvoice?.treatmentSession,
      adjustmentType,
      adjustmentReason,
      reconciliationNote,
      originalInvoiceTotal: selectedInvoice?.total,
      finalizedAt: selectedInvoice?.finalizedAt,
      finalizedBy: selectedInvoice?.finalizedBy,
    };

    setCashbookRecords((current) => [nextRecord, ...current]);
    setShowCreateVoucherModal(false);
  };
  const openEditVoucherModal = (record: CashbookRecord) => {
    setEditingRecord(record);
    setEditVoucherTime(record.time);
    setEditVoucherStaff(record.creator);
    setEditVoucherPayerType(record.payerReceiverType);
    setEditVoucherMethod(
      record.cashFund === 'Tiền mặt' ? 'Tiền mặt' : record.cashFund === 'Ví điện tử' ? 'Ví điện tử' : 'Chuyển khoản',
    );
    setEditVoucherAmount(record.amount.toLocaleString('vi-VN'));
    setEditVoucherNote(record.note);
    setShowEditVoucherModal(true);
  };

  const toDateTime = (value: string) => {
    const [datePart, timePart] = value.split(' ');
    const [day, month, year] = datePart.split('/');
    return new Date(`${year}-${month}-${day}T${timePart || '00:00'}:00`);
  };

  const getIncomeExpenseCategory = (value: string): IncomeExpenseFilter => {
    const normalized = value.toLowerCase();
    if (normalized.includes('lương')) return 'Chi trả lương NV';
    if (normalized.includes('thu tiền khách trả')) return 'Tiền hàng';
    return 'Khác';
  };

  const filteredRecords = useMemo(() => {
    return cashbookRecords.filter((record) => {
      const normalizedSearch = search.trim().toLowerCase();
      const matchesSearch = !normalizedSearch ||
        record.code.toLowerCase().includes(normalizedSearch) ||
        record.transaction.toLowerCase().includes(normalizedSearch) ||
        record.payerReceiver.toLowerCase().includes(normalizedSearch);
      const matchesStatus = status === 'Tất cả' || record.status === status;
      const matchesFund = cashFund === 'Tổng quỹ' || record.cashFund === cashFund;
      const recordDate = toDateTime(record.time);
      const fromDate = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
      const toDate = dateTo ? new Date(`${dateTo}T23:59:59`) : null;
      const matchesDate = (!fromDate || recordDate >= fromDate) && (!toDate || recordDate <= toDate);
      const matchesCreator = creatorId === 'all' || record.creator === (cashierStaffs.find((staff) => staff.id === creatorId)?.name ?? '');
      const matchesEmployee = employeeId === 'all' || record.creator === (cashierStaffs.find((staff) => staff.id === employeeId)?.name ?? '');
      const matchesPayerType = record.payerReceiverType === payerReceiverType;
      const matchesPayerName =
        !payerReceiverName.trim() || record.payerReceiver.toLowerCase().includes(payerReceiverName.trim().toLowerCase());
      const matchesPayerCode =
        !payerReceiverCode.trim() || record.payerReceiverCode.toLowerCase().includes(payerReceiverCode.trim().toLowerCase());
      const matchesPayerPhone =
        !payerReceiverPhone.trim() || record.payerReceiverPhone.toLowerCase().includes(payerReceiverPhone.trim().toLowerCase());
      const matchesIncomeExpense = incomeExpenseType === 'Tất cả' || getIncomeExpenseCategory(record.incomeExpenseType) === incomeExpenseType;
      const matchesDocumentType = documentType === 'Tất cả' || record.documentType === documentType;
      const matchesBusinessResult = businessResult === 'Tất cả' || record.businessResult === businessResult;
      const matchesSource = sourceFilter === 'Tất cả' || (record.sourceType || 'Thủ công') === sourceFilter;
      const matchesRelatedInvoice =
        !relatedInvoiceFilter.trim() ||
        (record.relatedInvoiceCode || record.transaction).toLowerCase().includes(relatedInvoiceFilter.trim().toLowerCase());
      const matchesAdjustmentType = adjustmentTypeFilter === 'Tất cả' || record.adjustmentType === adjustmentTypeFilter;
      return matchesSearch &&
        matchesStatus &&
        matchesFund &&
        matchesDate &&
        matchesCreator &&
        matchesEmployee &&
        matchesPayerType &&
        matchesPayerName &&
        matchesPayerCode &&
        matchesPayerPhone &&
        matchesIncomeExpense &&
        matchesDocumentType &&
        matchesBusinessResult &&
        matchesSource &&
        matchesRelatedInvoice &&
        matchesAdjustmentType;
    });
  }, [
    cashbookRecords,
    search,
    cashFund,
    status,
    dateFrom,
    dateTo,
    creatorId,
    employeeId,
    payerReceiverType,
    payerReceiverName,
    payerReceiverCode,
    payerReceiverPhone,
    incomeExpenseType,
    documentType,
    businessResult,
    sourceFilter,
    relatedInvoiceFilter,
    adjustmentTypeFilter,
  ]);

  const totalIncome = filteredRecords
    .filter((record) => record.incomeExpenseType.toLowerCase().startsWith('thu'))
    .reduce((sum, record) => sum + record.amount, 0);
  const totalExpense = filteredRecords
    .filter((record) => record.incomeExpenseType.toLowerCase().startsWith('chi'))
    .reduce((sum, record) => sum + record.amount, 0);
  const payerCustomerOptions = useMemo(() => {
    const base = customers.map((customer) => ({
      value: customer.name,
      label: `${customer.name} - ${customer.phone}`,
    }));
    if (payerName && !base.some((option) => option.value === payerName)) {
      return [{ value: payerName, label: payerName }, ...base];
    }
    return base;
  }, [payerName]);
  const voucherTypeOptions = useMemo(() => {
    const base = voucherTypeOptionsByMode[createVoucherMode];
    if (voucherType && !base.includes(voucherType)) {
      return [voucherType, ...base];
    }
    return base;
  }, [createVoucherMode, voucherType]);
  const visibleColumnCount = useMemo(
    () => columnOptions.reduce((sum, column) => sum + (visibleColumns[column.key] ? 1 : 0), 0),
    [visibleColumns],
  );

  const toggleColumn = (key: ColumnKey) => {
    setVisibleColumns((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };
  const voucherModeLabel = createVoucherMode === 'Phiếu thu' ? 'thu' : 'chi';
  const voucherFundLabel = createVoucherFund.toLowerCase();
  const voucherActionLabel = createVoucherMode === 'Phiếu thu' ? 'nộp' : 'nhận';
  const accountLabel = createVoucherMode === 'Phiếu thu' ? 'Tài khoản nhận' : 'Tài khoản gửi';
  const accountPlaceholder = createVoucherMode === 'Phiếu thu' ? 'Chọn tài khoản nhận' : 'Chọn tài khoản gửi';
  const showTransferFields = createVoucherFund !== 'Tiền mặt';
  const voucherTypeFieldLabel = createVoucherMode === 'Phiếu thu' ? 'Loại thu' : 'Loại chi';
  const addVoucherTypeTitle = createVoucherMode === 'Phiếu thu' ? 'Thêm loại thu' : 'Thêm loại chi';
  const editModeLabel = editingRecord?.documentType === 'Phiếu thu' ? 'thu' : 'chi';
  const editFundLabel = editingRecord?.cashFund.toLowerCase() ?? 'tiền mặt';

  return (
    <div className="min-h-full bg-gray-50 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-base text-gray-900">Sổ quỹ</h1>
          <div className="relative w-[300px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm theo mã phiếu"
              className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-9 pr-10 text-xs text-gray-700"
            />
            <SlidersHorizontal className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex h-8 items-center gap-1 rounded-lg bg-blue-600 px-3 text-xs text-white hover:bg-blue-700">
                <Plus className="h-3.5 w-3.5" />
                Phiếu thu
                <ChevronDown className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52 p-2">
              {voucherCreateOptions.map((option) => (
                <DropdownMenuItem
                  key={`income-${option}`}
                  onSelect={() => openCreateVoucherModal('Phiếu thu', option)}
                  className="h-11 cursor-pointer rounded-md text-base text-gray-800"
                >
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex h-8 items-center gap-1 rounded-lg bg-blue-600 px-3 text-xs text-white hover:bg-blue-700">
                <Plus className="h-3.5 w-3.5" />
                Phiếu chi
                <ChevronDown className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52 p-2">
              {voucherCreateOptions.map((option) => (
                <DropdownMenuItem
                  key={`expense-${option}`}
                  onSelect={() => openCreateVoucherModal('Phiếu chi', option)}
                  className="h-11 cursor-pointer rounded-md text-base text-gray-800"
                >
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <button className="inline-flex h-9 items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-700 hover:bg-gray-50">
            <FileUp className="h-4 w-4" />
            Xuất file
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[620px] p-4">
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                {columnOptions.map((column) => (
                  <label key={column.key} className="flex cursor-pointer items-center gap-2.5 text-base text-gray-800">
                    <span className={`inline-flex h-5 w-5 items-center justify-center rounded-md border ${
                      visibleColumns[column.key] ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-transparent'
                    }`}>
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <input
                      type="checkbox"
                      checked={visibleColumns[column.key]}
                      onChange={() => toggleColumn(column.key)}
                      className="sr-only"
                    />
                    {column.label}
                  </label>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid min-h-[calc(100vh-148px)] grid-cols-[230px_minmax(0,1fr)] gap-3">
        <aside className="rounded-xl border border-gray-200 bg-white p-3">
          <div className="mb-5">
            <div className="mb-2 text-xs text-gray-900">Quỹ tiền</div>
            <div className="space-y-2">
              {cashFundOptions.map((fund) => (
                <button
                  key={fund}
                  onClick={() => setCashFund(fund)}
                  className="flex items-center gap-2 text-xs text-gray-700"
                >
                  <Circle className={`h-4 w-4 ${cashFund === fund ? 'fill-blue-600 text-blue-600' : 'text-gray-300'}`} />
                  {fund}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <div className="mb-2 text-xs text-gray-900">Trạng thái</div>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as FilterStatus)}
              className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-700"
            >
              {statusOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="mb-5">
            <div className="mb-2 text-xs text-gray-900">Thời gian</div>
            <div className="grid grid-cols-[minmax(0,1fr)_10px_minmax(0,1fr)] items-center gap-1">
              <input
                type="date"
                value={dateFrom}
                onChange={(event) => setDateFrom(event.target.value)}
                className="h-8 min-w-0 rounded-lg border border-gray-200 bg-white px-1.5 text-[11px] text-gray-700"
              />
              <span className="text-center text-[11px] text-gray-400">-</span>
              <input
                type="date"
                value={dateTo}
                onChange={(event) => setDateTo(event.target.value)}
                className="h-8 min-w-0 rounded-lg border border-gray-200 bg-white px-1.5 text-[11px] text-gray-700"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="mb-1.5 text-xs text-gray-900">Người tạo</div>
              <select
                value={creatorId}
                onChange={(event) => setCreatorId(event.target.value)}
                className="h-8 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-700"
              >
                <option value="all">Tất cả</option>
                {cashierStaffs.map((staff) => (
                  <option key={staff.id} value={staff.id}>{staff.name}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="mb-1.5 text-xs text-gray-900">Nhân viên</div>
              <select
                value={employeeId}
                onChange={(event) => setEmployeeId(event.target.value)}
                className="h-8 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-700"
              >
                <option value="all">Tất cả</option>
                {cashierStaffs.map((staff) => (
                  <option key={staff.id} value={staff.id}>{staff.name}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="mb-1.5 text-xs text-gray-900">Người nộp/nhận</div>
              <div className="space-y-2">
                <select
                  value={payerReceiverType}
                  onChange={(event) => setPayerReceiverType(event.target.value as PayerReceiverType)}
                  className="h-8 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-700"
                >
                  {payerReceiverTypeOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
                <input
                  value={payerReceiverName}
                  onChange={(event) => setPayerReceiverName(event.target.value)}
                  className="h-8 w-full rounded-lg border border-gray-200 px-3 text-xs text-gray-700 placeholder:text-gray-400"
                  placeholder="Tên"
                />
                <input
                  value={payerReceiverCode}
                  onChange={(event) => setPayerReceiverCode(event.target.value)}
                  className="h-8 w-full rounded-lg border border-gray-200 px-3 text-xs text-gray-700 placeholder:text-gray-400"
                  placeholder="Mã"
                />
                <input
                  value={payerReceiverPhone}
                  onChange={(event) => setPayerReceiverPhone(event.target.value)}
                  className="h-8 w-full rounded-lg border border-gray-200 px-3 text-xs text-gray-700 placeholder:text-gray-400"
                  placeholder="Số điện thoại"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 text-xs text-gray-900">Loại thu chi</div>
              <select
                value={incomeExpenseType}
                onChange={(event) => setIncomeExpenseType(event.target.value as IncomeExpenseFilter)}
                className="h-8 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-700"
              >
                {incomeExpenseTypeOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="mb-1.5 text-xs text-gray-900">Loại chứng từ</div>
              <select
                value={documentType}
                onChange={(event) => setDocumentType(event.target.value as 'Tất cả' | DocumentType)}
                className="h-8 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-700"
              >
                {documentTypeOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="mb-1.5 text-xs text-gray-900">Kết quả kinh doanh</div>
              <select
                value={businessResult}
                onChange={(event) => setBusinessResult(event.target.value as 'Tất cả' | BusinessResult)}
                className="h-8 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-700"
              >
                {businessResultOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3">
              <div className="mb-2 text-xs text-blue-700">Phát sinh sau hóa đơn đã chốt</div>
              <div className="space-y-2">
                <select
                  value={sourceFilter}
                  onChange={(event) => setSourceFilter(event.target.value as SourceFilter)}
                  className="h-8 w-full rounded-lg border border-blue-100 bg-white px-3 text-xs text-gray-700"
                >
                  {sourceOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
                <input
                  value={relatedInvoiceFilter}
                  onChange={(event) => setRelatedInvoiceFilter(event.target.value)}
                  className="h-8 w-full rounded-lg border border-blue-100 bg-white px-3 text-xs text-gray-700 placeholder:text-gray-400"
                  placeholder="Mã hóa đơn liên quan"
                />
                <select
                  value={adjustmentTypeFilter}
                  onChange={(event) => setAdjustmentTypeFilter(event.target.value as 'Tất cả' | AdjustmentType)}
                  className="h-8 w-full rounded-lg border border-blue-100 bg-white px-3 text-xs text-gray-700"
                >
                  {adjustmentFilterOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </aside>

        <section className="rounded-xl border border-gray-200 bg-white p-3">
          <div className="mb-2 flex items-center justify-end gap-5 border-b border-gray-100 pb-3 text-xs">
            <div className="text-gray-500">
              Quỹ đầu kỳ
              <div className="text-right text-xl text-gray-900">0</div>
            </div>
            <div className="text-gray-500">
              Tổng thu
              <div className="text-right text-xl text-blue-600">{formatCurrency(totalIncome)}</div>
            </div>
            <div className="text-gray-500">
              Tổng chi
              <div className="text-right text-xl text-red-500">{formatCurrency(totalExpense)}</div>
            </div>
            <div className="text-gray-500">
              Tồn quỹ
              <div className="text-right text-xl text-green-600">{formatCurrency(totalIncome - totalExpense)}</div>
            </div>
            <Info className="h-4 w-4 text-gray-400" />
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-[3100px] text-xs">
              <thead className="bg-gray-50 text-gray-500">
                <tr className="border-b border-gray-200">
                  {visibleColumns.code && <th className="px-3 py-2 text-left">Mã phiếu</th>}
                  {visibleColumns.time && <th className="px-3 py-2 text-left">Thời gian</th>}
                  {visibleColumns.transaction && <th className="px-3 py-2 text-left">Giao dịch</th>}
                  {visibleColumns.sourceType && <th className="px-3 py-2 text-left">Nguồn phát sinh</th>}
                  {visibleColumns.relatedInvoice && <th className="px-3 py-2 text-left">Hóa đơn liên quan</th>}
                  {visibleColumns.relatedTreatmentSession && <th className="px-3 py-2 text-left">Buổi điều trị liên quan</th>}
                  {visibleColumns.adjustmentType && <th className="px-3 py-2 text-left">Loại điều chỉnh</th>}
                  {visibleColumns.adjustmentReason && <th className="px-3 py-2 text-left">Lý do phát sinh</th>}
                  {visibleColumns.creator && <th className="px-3 py-2 text-left">Người tạo</th>}
                  {visibleColumns.branch && <th className="px-3 py-2 text-left">Chi nhánh</th>}
                  {visibleColumns.incomeExpenseType && <th className="px-3 py-2 text-left">Loại thu chi</th>}
                  {visibleColumns.accountNumber && <th className="px-3 py-2 text-left">Số tài khoản</th>}
                  {visibleColumns.payerReceiver && <th className="px-3 py-2 text-left">Người nộp/nhận</th>}
                  {visibleColumns.payerReceiverCode && <th className="px-3 py-2 text-left">Mã người nộp/nhận</th>}
                  {visibleColumns.payerReceiverPhone && <th className="px-3 py-2 text-left">SĐT người nộp/nhận</th>}
                  {visibleColumns.amount && <th className="px-3 py-2 text-right">Số tiền</th>}
                  {visibleColumns.transferContent && <th className="px-3 py-2 text-left">Nội dung chuyển khoản</th>}
                  {visibleColumns.note && <th className="px-3 py-2 text-left">Ghi chú</th>}
                  {visibleColumns.reconciliationNote && <th className="px-3 py-2 text-left">Ghi chú đối soát</th>}
                  {visibleColumns.cashFund && <th className="px-3 py-2 text-left">Quỹ tiền</th>}
                  {visibleColumns.status && <th className="px-3 py-2 text-left">Trạng thái</th>}
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <Fragment key={record.id}>
                    <tr
                      onDoubleClick={() => setExpandedRecordId((current) => (current === record.id ? null : record.id))}
                      className={`cursor-pointer border-b border-gray-100 text-gray-700 hover:bg-gray-50 ${
                        expandedRecordId === record.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      {visibleColumns.code && <td className="px-3 py-2">{record.code}</td>}
                      {visibleColumns.time && <td className="px-3 py-2">{record.time}</td>}
                      {visibleColumns.transaction && <td className="px-3 py-2">{record.transaction || '-'}</td>}
                      {visibleColumns.sourceType && (
                        <td className="px-3 py-2">
                          <span className={`rounded-full px-2 py-0.5 ${
                            (record.sourceType || 'Thủ công') === 'Sau hóa đơn đã chốt'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {record.sourceType || 'Thủ công'}
                          </span>
                        </td>
                      )}
                      {visibleColumns.relatedInvoice && <td className="px-3 py-2 text-blue-600">{record.relatedInvoiceCode || record.transaction || '-'}</td>}
                      {visibleColumns.relatedTreatmentSession && <td className="max-w-[280px] truncate px-3 py-2">{record.relatedTreatmentSession || '-'}</td>}
                      {visibleColumns.adjustmentType && <td className="px-3 py-2">{record.adjustmentType || '-'}</td>}
                      {visibleColumns.adjustmentReason && <td className="max-w-[260px] truncate px-3 py-2">{record.adjustmentReason || '-'}</td>}
                      {visibleColumns.creator && <td className="px-3 py-2">{record.creator}</td>}
                      {visibleColumns.branch && <td className="px-3 py-2">{record.branch}</td>}
                      {visibleColumns.incomeExpenseType && <td className="px-3 py-2">{record.incomeExpenseType}</td>}
                      {visibleColumns.accountNumber && <td className="px-3 py-2">{record.accountNumber || '-'}</td>}
                      {visibleColumns.payerReceiver && <td className="px-3 py-2">{record.payerReceiver || '-'}</td>}
                      {visibleColumns.payerReceiverCode && <td className="px-3 py-2">{record.payerReceiverCode || '-'}</td>}
                      {visibleColumns.payerReceiverPhone && <td className="px-3 py-2">{record.payerReceiverPhone || '-'}</td>}
                      {visibleColumns.amount && <td className="px-3 py-2 text-right">{formatCurrency(record.amount)}</td>}
                      {visibleColumns.transferContent && <td className="px-3 py-2">{record.transferContent || '-'}</td>}
                      {visibleColumns.note && <td className="px-3 py-2">{record.note || '-'}</td>}
                      {visibleColumns.reconciliationNote && <td className="max-w-[240px] truncate px-3 py-2">{record.reconciliationNote || '-'}</td>}
                      {visibleColumns.cashFund && <td className="px-3 py-2">{record.cashFund}</td>}
                      {visibleColumns.status && (
                        <td className="px-3 py-2">
                          <span className={`rounded-full px-2 py-0.5 text-xs ${
                            record.status === 'Đã thanh toán'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                      )}
                    </tr>
                    {expandedRecordId === record.id && (
                      <tr className="border-b border-gray-200 bg-white">
                        <td colSpan={Math.max(visibleColumnCount, 1)} className="p-0">
                          <div className="space-y-4 px-4 py-5">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <h4 className="text-lg text-gray-900">{record.code}</h4>
                                <span className={`rounded-full px-2 py-1 text-[11px] ${
                                  record.status === 'Đã thanh toán' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                                }`}>
                                  {record.status}
                                </span>
                              </div>
                              <div className="text-right text-xs text-gray-500">
                                <div>Chi nhánh {record.branch}</div>
                                <div>Người tạo: {record.creator}</div>
                              </div>
                            </div>

                            <div className="grid grid-cols-4 gap-x-5 gap-y-4 text-[11px] text-gray-600">
                              <div className="border-b border-gray-200 pb-1">
                                <div>Số tiền</div>
                                <div className="mt-1 text-xs text-gray-900">{formatCurrency(record.amount)}</div>
                              </div>
                              <div className="border-b border-gray-200 pb-1">
                                <div>{record.documentType === 'Phiếu thu' ? 'Loại thu' : 'Loại chi'}</div>
                                <div className="mt-1 text-xs text-gray-900">{record.incomeExpenseType}</div>
                              </div>
                              <div className="border-b border-gray-200 pb-1">
                                <div>Thời gian</div>
                                <div className="mt-1 text-xs text-gray-900">{record.time}</div>
                              </div>
                              <div className="border-b border-gray-200 pb-1">
                                <div>Nhân viên</div>
                                <div className="mt-1 text-xs text-gray-900">{record.creator}</div>
                              </div>

                              <div className="border-b border-gray-200 pb-1">
                                <div>{record.documentType === 'Phiếu thu' ? 'Người nộp' : 'Người nhận'}</div>
                                <div className="mt-1 text-xs text-blue-600">
                                  {record.payerReceiver || '-'}{record.payerReceiverCode ? ` - ${record.payerReceiverCode}` : ''}{record.payerReceiverPhone ? `, ${record.payerReceiverPhone}` : ''}
                                </div>
                              </div>
                              <div className="border-b border-gray-200 pb-1">
                                <div>Đối tượng {record.documentType === 'Phiếu thu' ? 'nộp' : 'nhận'}</div>
                                <div className="mt-1 text-xs text-gray-900">{record.payerReceiverType}</div>
                              </div>
                              <div className="border-b border-gray-200 pb-1">
                                <div>Phương thức</div>
                                <div className="mt-1 text-xs text-gray-900">{record.cashFund === 'Tiền mặt' ? 'Tiền mặt' : record.cashFund === 'Ngân hàng' ? 'Chuyển khoản' : 'Ví điện tử'}</div>
                              </div>
                            </div>

                            {(record.sourceType || 'Thủ công') === 'Sau hóa đơn đã chốt' && (
                              <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
                                <div className="mb-3 text-sm text-blue-800">Thông tin phát sinh sau hóa đơn đã chốt</div>
                                <div className="grid grid-cols-3 gap-x-5 gap-y-3 text-[11px] text-gray-600">
                                  <DetailField label="Nguồn phát sinh" value={record.sourceType || '-'} />
                                  <DetailField label="Loại điều chỉnh" value={record.adjustmentType || '-'} />
                                  <DetailField
                                    label="Hóa đơn liên quan"
                                    value={record.relatedInvoiceCode || record.transaction || '-'}
                                    link
                                  />
                                  <DetailField label="Buổi điều trị liên quan" value={record.relatedTreatmentSession || '-'} link={!!record.relatedTreatmentSession} />
                                  <DetailField
                                    label="Khách hàng"
                                    value={`${record.payerReceiver || '-'}${record.payerReceiverCode ? ` - ${record.payerReceiverCode}` : ''}`}
                                    link
                                  />
                                  <DetailField label="Số tiền hóa đơn gốc" value={record.originalInvoiceTotal ? formatCurrency(record.originalInvoiceTotal) : '-'} />
                                  <DetailField label="Số tiền điều chỉnh" value={formatCurrency(record.amount)} />
                                  <DetailField label="Ngày chốt hóa đơn" value={record.finalizedAt || '-'} />
                                  <DetailField label="Thu ngân chốt" value={record.finalizedBy || '-'} />
                                  <div className="col-span-3">
                                    <div>Lý do phát sinh</div>
                                    <div className="mt-1 text-xs text-gray-900">{record.adjustmentReason || '-'}</div>
                                  </div>
                                  <div className="col-span-3">
                                    <div>Ghi chú đối soát</div>
                                    <div className="mt-1 text-xs text-gray-900">{record.reconciliationNote || '-'}</div>
                                  </div>
                                </div>
                              </div>
                            )}

                            <button className="flex h-10 w-full items-center justify-between rounded-xl border border-gray-200 px-3 text-xs text-gray-700">
                              {record.documentType} tự động được tạo gắn với hóa đơn {record.transaction || '---'}
                              <ChevronDown className="h-4 w-4 text-gray-500" />
                            </button>

                            <div className="text-xs text-gray-700">Ghi chú: {record.note || '-'}</div>

                            <div className="flex items-center justify-between pt-2">
                              <button
                                onClick={() => setExpandedRecordId(null)}
                                className="inline-flex items-center gap-2 text-xs text-gray-500"
                              >
                                <Trash2 className="h-4 w-4" />
                                Hủy bỏ
                              </button>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => openEditVoucherModal(record)}
                                  className="inline-flex h-9 items-center gap-1 rounded-lg bg-blue-600 px-4 text-xs text-white"
                                >
                                  <PencilLine className="h-4 w-4" />
                                  Chỉnh sửa
                                </button>
                                <button className="inline-flex h-9 items-center gap-1 rounded-lg border border-gray-200 bg-white px-4 text-xs text-gray-700">
                                  <Printer className="h-4 w-4" />
                                  In
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500">
            <div className="flex items-center gap-2">
              <span>Hiển thị</span>
              <button className="h-7 rounded-md border border-gray-200 px-2 text-[11px]">10 bản ghi</button>
            </div>
            <div className="flex items-center gap-2">
              <button className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-200"><ChevronsLeft className="h-3 w-3" /></button>
              <button className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-200"><ChevronLeft className="h-3 w-3" /></button>
              <button className="h-7 rounded-md border border-gray-200 px-2 text-[11px] text-gray-700">1</button>
              <button className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-200"><ChevronRight className="h-3 w-3" /></button>
              <button className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-200"><ChevronsRight className="h-3 w-3" /></button>
              <span>1 - {filteredRecords.length} trên tổng số {cashbookRecords.length} phiếu</span>
            </div>
          </div>
        </section>
      </div>

      <Dialog open={showEditVoucherModal} onOpenChange={setShowEditVoucherModal}>
        <DialogContent className="top-1/2 left-1/2 w-[min(780px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 gap-0 overflow-hidden rounded-[16px] border border-gray-200 p-0 shadow-xl sm:max-w-none [&>button]:hidden">
          <DialogTitle className="sr-only">Sửa phiếu {editModeLabel} {editFundLabel}</DialogTitle>
          <div className="border-b border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] leading-none text-gray-900">
                Sửa phiếu {editModeLabel} {editFundLabel}
              </h3>
              <button
                onClick={() => setShowEditVoucherModal(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="space-y-4 px-6 py-5">
            <div className="grid grid-cols-2 gap-4">
              <div />
              <div>
                <div className="mb-1.5 text-sm text-gray-600">Mã phiếu</div>
                <Input
                  disabled
                  value={editingRecord?.code ?? ''}
                  className="h-11 rounded-xl border-gray-200 text-base text-gray-400 disabled:opacity-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-1.5 text-sm text-gray-600">Thời gian</div>
                <div className="relative">
                  <Input
                    value={editVoucherTime}
                    onChange={(event) => setEditVoucherTime(event.target.value)}
                    className="h-11 rounded-xl border-gray-200 pr-16 text-base text-gray-900"
                  />
                  <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2 text-gray-500">
                    <CalendarDays className="h-5 w-5" />
                    <Clock3 className="h-5 w-5" />
                  </div>
                </div>
              </div>
              <div>
                <div className="mb-1.5 text-sm text-gray-600">Nhân viên</div>
                <div className="relative">
                  <select
                    value={editVoucherStaff}
                    onChange={(event) => setEditVoucherStaff(event.target.value)}
                    className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 text-base text-gray-900"
                  >
                    {cashierStaffs.map((staff) => (
                      <option key={staff.id} value={staff.name}>{staff.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-1.5 text-sm text-gray-600">Tài khoản tạo</div>
                <Input
                  disabled
                  value={editingRecord?.creator ?? ''}
                  className="h-11 rounded-xl border-gray-200 text-base text-gray-400 disabled:opacity-100"
                />
              </div>
              <div>
                <div className="mb-1.5 text-sm text-gray-600">Đối tượng {editModeLabel === 'thu' ? 'nộp' : 'nhận'}</div>
                <div className="relative">
                  <select
                    value={editVoucherPayerType}
                    onChange={(event) => setEditVoucherPayerType(event.target.value as PayerReceiverType)}
                    className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 text-base text-gray-900"
                  >
                    <option>Khách hàng</option>
                    <option>Nhà cung cấp</option>
                    <option>Nhân viên</option>
                    <option>Khác</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-1.5 text-sm text-gray-600">Người {editModeLabel === 'thu' ? 'nộp' : 'nhận'}</div>
                <Input
                  disabled
                  value={`${editingRecord?.payerReceiver ?? ''}${editingRecord?.payerReceiverPhone ? ` - ${editingRecord?.payerReceiverPhone}` : ''}`}
                  className="h-11 rounded-xl border-gray-200 text-base text-gray-400 disabled:opacity-100"
                />
              </div>
              <div>
                <div className="mb-1.5 text-sm text-gray-600">Phương thức</div>
                <div className="relative">
                  <select
                    value={editVoucherMethod}
                    onChange={(event) => setEditVoucherMethod(event.target.value as VoucherMethod)}
                    disabled={editingRecord?.cashFund === 'Ví điện tử'}
                    className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 text-base text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    {editingRecord?.cashFund === 'Tiền mặt' && <option value="Tiền mặt">Tiền mặt</option>}
                    {editingRecord?.cashFund === 'Ngân hàng' && <option value="Chuyển khoản">Chuyển khoản</option>}
                    {editingRecord?.cashFund === 'Ví điện tử' && <option value="Ví điện tử">Ví điện tử</option>}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                </div>
              </div>
            </div>

            <div>
              <div className="mb-1.5 text-sm text-gray-600">Số tiền</div>
              <Input
                value={editVoucherAmount}
                onChange={(event) => setEditVoucherAmount(event.target.value)}
                className="h-11 rounded-xl border-gray-200 text-right text-base text-gray-900"
              />
            </div>

            <div>
              <div className="mb-1.5 text-sm text-gray-600">Ghi chú</div>
              <Textarea
                value={editVoucherNote}
                onChange={(event) => setEditVoucherNote(event.target.value)}
                className="min-h-24 rounded-xl border-gray-200 text-base text-gray-900"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
            <button
              onClick={() => setShowEditVoucherModal(false)}
              className="h-10 rounded-xl bg-gray-100 px-6 text-sm text-gray-700"
            >
              Bỏ qua
            </button>
            <button className="h-10 rounded-xl bg-gray-100 px-7 text-sm text-gray-700">In</button>
            <button className="h-10 rounded-xl bg-blue-600 px-7 text-sm text-white">Lưu</button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddVoucherTypeModal} onOpenChange={setShowAddVoucherTypeModal}>
        <DialogContent className="top-1/2 left-1/2 w-[min(800px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 gap-0 overflow-hidden rounded-[20px] border border-gray-200 p-0 shadow-xl sm:max-w-none [&>button]:hidden">
          <DialogTitle className="sr-only">{addVoucherTypeTitle}</DialogTitle>
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] leading-none text-gray-900">{addVoucherTypeTitle}</h3>
              <button
                onClick={() => setShowAddVoucherTypeModal(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="space-y-4 px-6 py-5">
            <div>
              <div className="mb-1.5 text-sm text-gray-600">{voucherTypeFieldLabel}</div>
              <Input
                value={newVoucherTypeName}
                onChange={(event) => setNewVoucherTypeName(event.target.value)}
                placeholder="Bắt buộc"
                className="h-11 rounded-xl border-gray-200 text-base text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <div>
              <div className="mb-1.5 text-sm text-gray-600">Mô tả</div>
              <Textarea
                value={newVoucherTypeDescription}
                onChange={(event) => setNewVoucherTypeDescription(event.target.value)}
                placeholder="Nhập ghi chú"
                className="min-h-24 rounded-xl border-gray-200 text-base text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <label className="flex items-center gap-2 text-base text-gray-800">
              <Checkbox checked={newVoucherTypeAccounting} onCheckedChange={(checked) => setNewVoucherTypeAccounting(checked === true)} />
              Hạch toán vào kết quả hoạt động kinh doanh
              <Info className="h-4 w-4 text-gray-500" />
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
            <button
              onClick={() => setShowAddVoucherTypeModal(false)}
              className="h-10 rounded-xl bg-gray-100 px-6 text-sm text-gray-700"
            >
              Bỏ qua
            </button>
            <button
              onClick={saveVoucherType}
              className="h-10 rounded-xl bg-blue-600 px-8 text-sm text-white"
            >
              Lưu
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddPayerModal} onOpenChange={setShowAddPayerModal}>
        <DialogContent className="top-1/2 left-1/2 w-[min(800px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 gap-0 overflow-hidden rounded-[20px] border border-gray-200 p-0 shadow-xl sm:max-w-none [&>button]:hidden">
          <DialogTitle className="sr-only">Tạo người {voucherActionLabel}</DialogTitle>
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] leading-none text-gray-900">Tạo người {voucherActionLabel}</h3>
              <button
                onClick={() => setShowAddPayerModal(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="space-y-4 px-6 py-5">
            <div>
              <div className="mb-1.5 text-sm text-gray-600">Người {voucherActionLabel}</div>
              <Input
                value={newPayerName}
                onChange={(event) => setNewPayerName(event.target.value)}
                placeholder="Bắt buộc"
                className="h-11 rounded-xl border-gray-200 text-base text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <div>
              <div className="mb-1.5 text-sm text-gray-600">Số điện thoại</div>
              <Input
                value={newPayerPhone}
                onChange={(event) => setNewPayerPhone(event.target.value)}
                placeholder="Bắt buộc"
                className="h-11 rounded-xl border-gray-200 text-base text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <div>
              <div className="mb-1.5 text-sm text-gray-600">Địa chỉ</div>
              <Input
                value={newPayerAddress}
                onChange={(event) => setNewPayerAddress(event.target.value)}
                placeholder="Nhập địa chỉ"
                className="h-11 rounded-xl border-gray-200 text-base text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <div>
              <div className="mb-1.5 text-sm text-gray-600">Tỉnh/Thành phố</div>
              <div className="relative">
                <select
                  value={newPayerCity}
                  onChange={(event) => setNewPayerCity(event.target.value)}
                  className={`h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 pr-10 text-base ${
                    newPayerCity ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  <option value="">Chọn Tỉnh/Thành phố</option>
                  <option>Hà Nội</option>
                  <option>Hồ Chí Minh</option>
                  <option>Đà Nẵng</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              </div>
            </div>
            <div>
              <div className="mb-1.5 text-sm text-gray-600">Xã/Phường/Đặc khu</div>
              <div className="relative">
                <select
                  value={newPayerWard}
                  onChange={(event) => setNewPayerWard(event.target.value)}
                  className={`h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 pr-10 text-base ${
                    newPayerWard ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  <option value="">Chọn Xã/Phường/Đặc khu</option>
                  <option>Phường 1</option>
                  <option>Phường 2</option>
                  <option>Phường 3</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              </div>
            </div>
            <div>
              <div className="mb-1.5 text-sm text-gray-600">Ghi chú</div>
              <Textarea
                value={newPayerNote}
                onChange={(event) => setNewPayerNote(event.target.value)}
                placeholder="Nhập ghi chú"
                className="min-h-24 rounded-xl border-gray-200 text-base text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
            <button
              onClick={() => setShowAddPayerModal(false)}
              className="h-10 rounded-xl bg-gray-100 px-6 text-sm text-gray-700"
            >
              Bỏ qua
            </button>
            <button
              onClick={savePayer}
              className="h-10 rounded-xl bg-blue-600 px-8 text-sm text-white"
            >
              Lưu
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddAccountModal} onOpenChange={setShowAddAccountModal}>
        <DialogContent className="top-1/2 left-1/2 w-[min(800px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 gap-0 overflow-hidden rounded-[20px] border border-gray-200 p-0 shadow-xl sm:max-w-none [&>button]:hidden">
          <DialogTitle className="sr-only">Tạo tài khoản</DialogTitle>
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] leading-none text-gray-900">Tạo tài khoản</h3>
              <button
                onClick={() => setShowAddAccountModal(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="space-y-4 px-6 py-5">
            <div>
              <div className="mb-1.5 text-sm text-gray-600">Tên tài khoản</div>
              <Input
                value={newAccountName}
                onChange={(event) => setNewAccountName(event.target.value)}
                placeholder="Bắt buộc"
                className="h-11 rounded-xl border-gray-200 text-base text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <div>
              <div className="mb-1.5 text-sm text-gray-600">Số tài khoản</div>
              <Input
                value={newAccountNumber}
                onChange={(event) => setNewAccountNumber(event.target.value)}
                placeholder="Số tài khoản"
                className="h-11 rounded-xl border-gray-200 text-base text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <div>
              <div className="mb-1.5 text-sm text-gray-600">Ngân hàng</div>
              <div className="relative">
                <select
                  value={newAccountBank}
                  onChange={(event) => setNewAccountBank(event.target.value)}
                  className={`h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 pr-10 text-base ${
                    newAccountBank ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  <option value="">Chọn ngân hàng</option>
                  <option>BIDV</option>
                  <option>Vietcombank</option>
                  <option>MB Bank</option>
                  <option>ACB</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              </div>
            </div>
            <div>
              <div className="mb-1.5 text-sm text-gray-600">Chi nhánh</div>
              <Input
                value={newAccountBranch}
                onChange={(event) => setNewAccountBranch(event.target.value)}
                placeholder="Chi nhánh"
                className="h-11 rounded-xl border-gray-200 text-base text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <div>
              <div className="mb-1.5 text-sm text-gray-600">Chủ tài khoản</div>
              <Input
                value={newAccountOwner}
                onChange={(event) => setNewAccountOwner(event.target.value)}
                placeholder="Nhập chủ tài khoản"
                className="h-11 rounded-xl border-gray-200 text-base text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <div>
              <div className="mb-1.5 text-sm text-gray-600">Ghi chú</div>
              <Textarea
                value={newAccountNote}
                onChange={(event) => setNewAccountNote(event.target.value)}
                placeholder="Nhập ghi chú"
                className="min-h-24 rounded-xl border-gray-200 text-base text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
            <button
              onClick={() => setShowAddAccountModal(false)}
              className="h-10 rounded-xl bg-gray-100 px-6 text-sm text-gray-700"
            >
              Bỏ qua
            </button>
            <button
              onClick={saveAccount}
              className="h-10 rounded-xl bg-blue-600 px-8 text-sm text-white"
            >
              Lưu
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateVoucherModal} onOpenChange={setShowCreateVoucherModal}>
        <DialogContent className="top-1/2 left-1/2 max-h-[calc(100vh-2rem)] w-[min(820px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 gap-0 overflow-hidden rounded-[16px] border border-gray-200 p-0 shadow-xl sm:max-w-none [&>button]:hidden">
          <DialogTitle className="sr-only">Tạo phiếu {voucherModeLabel} {voucherFundLabel}</DialogTitle>
          <div className="border-b border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] leading-none text-gray-900">
                Tạo phiếu {voucherModeLabel} {voucherFundLabel}
              </h3>
              <button
                onClick={() => setShowCreateVoucherModal(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="max-h-[calc(100vh-9rem)] space-y-3 overflow-y-auto px-5 py-4">
            <div>
              <div className="mb-1.5 text-sm text-gray-600">Mã phiếu</div>
              <Input
                disabled
                value="Tự động"
                className="h-10 rounded-xl border-gray-200 text-base text-gray-400 disabled:opacity-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-1.5 text-sm text-gray-600">Thời gian</div>
                <div className="relative">
                  <Input
                    value={voucherTime}
                    onChange={(event) => setVoucherTime(event.target.value)}
                    className="h-11 rounded-xl border-gray-200 pr-16 text-base text-gray-900"
                  />
                  <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2 text-gray-500">
                    <CalendarDays className="h-5 w-5" />
                    <Clock3 className="h-5 w-5" />
                  </div>
                </div>
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between text-sm text-gray-600">
                  <span>{voucherTypeFieldLabel}</span>
                  <button onClick={openAddVoucherTypeModal} className="text-blue-600">Tạo mới</button>
                </div>
                <div className="relative">
                  <select
                    value={voucherType}
                    onChange={(event) => setVoucherType(event.target.value)}
                    className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 pr-10 text-base text-gray-900"
                  >
                    {voucherTypeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="mb-1.5 text-sm text-gray-600">Nguồn phát sinh</div>
                  <div className="relative">
                    <select
                      value={voucherSource}
                      onChange={(event) => changeVoucherSource(event.target.value as VoucherSource)}
                      className="h-11 w-full appearance-none rounded-xl border border-blue-100 bg-white px-4 pr-10 text-base text-gray-900"
                    >
                      <option>Thủ công</option>
                      <option>Sau hóa đơn đã chốt</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                  </div>
                </div>
                {voucherSource === 'Sau hóa đơn đã chốt' && (
                  <div>
                    <div className="mb-1.5 text-sm text-gray-600">Loại điều chỉnh</div>
                    <div className="relative">
                      <select
                        value={adjustmentType}
                        onChange={(event) => setAdjustmentType(event.target.value as AdjustmentType)}
                        className="h-11 w-full appearance-none rounded-xl border border-blue-100 bg-white px-4 pr-10 text-base text-gray-900"
                      >
                        {adjustmentOptionsByMode[createVoucherMode].map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                    </div>
                  </div>
                )}
              </div>

              {voucherSource === 'Sau hóa đơn đã chốt' && (
                <div className="mt-3 space-y-3">
                  <div>
                    <div className="mb-1.5 text-sm text-gray-600">Hóa đơn liên quan</div>
                    <div className="relative">
                      <select
                        value={selectedInvoiceCode}
                        onChange={(event) => applyRelatedInvoice(event.target.value)}
                        className={`h-11 w-full appearance-none rounded-xl border bg-white px-4 pr-10 text-base ${
                          selectedInvoice?.status === 'Nháp' ? 'border-red-200 text-red-600' : 'border-blue-100 text-gray-900'
                        }`}
                      >
                        <option value="">Chọn hóa đơn đã chốt/đã thanh toán</option>
                        {relatedInvoices.map((invoice) => (
                          <option key={invoice.code} value={invoice.code}>
                            {invoice.code} - {invoice.customerName} - {invoice.customerPhone} - {invoice.status}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                    </div>
                  </div>

                  {selectedInvoice && (
                    <div className="grid grid-cols-2 gap-3 rounded-xl bg-white p-3 text-xs text-gray-600">
                      <InfoPill label="Khách hàng" value={`${selectedInvoice.customerName} - ${selectedInvoice.customerCode}`} />
                      <InfoPill label="Số điện thoại" value={selectedInvoice.customerPhone} />
                      <InfoPill label="Chi nhánh" value={selectedInvoice.branch} />
                      <InfoPill label="Tổng tiền hóa đơn gốc" value={formatCurrency(selectedInvoice.total)} />
                      <InfoPill label="Ngày chốt" value={selectedInvoice.finalizedAt || '-'} />
                      <InfoPill label="Thu ngân chốt" value={selectedInvoice.finalizedBy || '-'} />
                      <div className="col-span-2">
                        <div className="text-gray-500">Buổi điều trị liên quan</div>
                        <div className="mt-1 text-gray-900">{selectedInvoice.treatmentSession || 'Không liên kết buổi điều trị cụ thể'}</div>
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="mb-1.5 text-sm text-gray-600">Lý do phát sinh <span className="text-red-500">*</span></div>
                    <Textarea
                      value={adjustmentReason}
                      onChange={(event) => setAdjustmentReason(event.target.value)}
                      placeholder="Ví dụ: Thu thêm do hóa đơn đã chốt thiếu sản phẩm bán."
                      maxLength={500}
                      className="min-h-20 rounded-xl border-blue-100 bg-white text-base text-gray-900 placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <div className="mb-1.5 text-sm text-gray-600">Ghi chú đối soát</div>
                    <Textarea
                      value={reconciliationNote}
                      onChange={(event) => setReconciliationNote(event.target.value)}
                      placeholder="Ai xác nhận, thời điểm phát hiện, cách xử lý đã thống nhất..."
                      className="min-h-20 rounded-xl border-blue-100 bg-white text-base text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-1.5 text-sm text-gray-600">Đối tượng {voucherActionLabel}</div>
                <div className="relative">
                  <select
                    value={payerType}
                    onChange={(event) => setPayerType(event.target.value as PayerReceiverType)}
                    className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 text-base text-gray-900"
                  >
                    <option>Khách hàng</option>
                    <option>Nhà cung cấp</option>
                    <option>Nhân viên</option>
                    <option>Khác</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                </div>
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between text-sm text-gray-600">
                  <span>Người {voucherActionLabel}</span>
                  <button onClick={openAddPayerModal} className="text-blue-600">Tạo mới</button>
                </div>
                <Popover open={payerPickerOpen} onOpenChange={setPayerPickerOpen}>
                  <PopoverTrigger asChild>
                    <button
                      className={`flex h-11 w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 text-left text-base ${
                        payerName ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {payerName || `Chọn người ${voucherActionLabel}`}
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="start" side="bottom" sideOffset={6} className="w-[var(--radix-popover-trigger-width)] p-0">
                    <Command>
                      <CommandInput placeholder="Tìm theo tên hoặc số điện thoại" />
                      <CommandList>
                        <CommandEmpty>Không tìm thấy khách hàng</CommandEmpty>
                        <CommandGroup>
                          {payerCustomerOptions.map((option) => (
                            <CommandItem
                              key={option.value}
                              value={option.label}
                              onSelect={() => {
                                setPayerName(option.value);
                                setPayerPickerOpen(false);
                              }}
                            >
                              {option.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {showTransferFields && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="mb-1.5 text-sm text-gray-600">Phương thức</div>
                  <div className="relative">
                    <select
                      value={voucherMethod}
                      onChange={(event) => setVoucherMethod(event.target.value as VoucherMethod)}
                      disabled={createVoucherFund === 'Ví điện tử'}
                      className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 text-base text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      {createVoucherFund === 'Ví điện tử' ? (
                        <option value="Ví điện tử">Ví điện tử</option>
                      ) : (
                        <option value="Chuyển khoản">Chuyển khoản</option>
                      )}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                  </div>
                </div>
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-sm text-gray-600">
                    <span>{accountLabel}</span>
                    <button onClick={openAddAccountModal} className="text-blue-600">Tạo mới</button>
                  </div>
                  <div className="relative">
                    <select
                      value={voucherAccount}
                      onChange={(event) => setVoucherAccount(event.target.value)}
                      className={`h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 pr-10 text-base ${
                        voucherAccount ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      <option value="">{accountPlaceholder}</option>
                      {createVoucherMode === 'Phiếu thu' ? (
                        <>
                          <option value="BIDV - 9704229200">BIDV - 9704229200</option>
                          <option value="MB Bank - 46881999">MB Bank - 46881999</option>
                          <option value="Momo Business">Momo Business</option>
                        </>
                      ) : (
                        <>
                          <option value="BIDV - 9704229200">BIDV - 9704229200</option>
                          <option value="VCB - 0011223344">VCB - 0011223344</option>
                          <option value="ZaloPay Merchant">ZaloPay Merchant</option>
                        </>
                      )}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                  </div>
                </div>
              </div>
            )}

            <div>
              <div className="mb-1.5 text-sm text-gray-600">Số tiền</div>
              <Input
                value={voucherAmount}
                onChange={(event) => setVoucherAmount(event.target.value)}
                className="h-11 rounded-xl border-gray-200 text-right text-base text-gray-900"
              />
            </div>

            <div>
              <div className="mb-1.5 text-sm text-gray-600">Ghi chú</div>
              <Textarea
                value={voucherNote}
                onChange={(event) => setVoucherNote(event.target.value)}
                placeholder="Nhập ghi chú"
                className="min-h-24 rounded-xl border-gray-200 text-base text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <label className="flex items-center gap-2 text-base text-gray-800">
              <Checkbox checked={isBusinessAccounting} onCheckedChange={(checked) => setIsBusinessAccounting(checked === true)} />
              Hạch toán vào kết quả hoạt động kinh doanh
              <Info className="h-4 w-4 text-gray-500" />
            </label>

            {createVoucherError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {createVoucherError}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
            <button
              onClick={() => setShowCreateVoucherModal(false)}
              className="h-10 rounded-xl bg-gray-100 px-6 text-sm text-gray-700"
            >
              Bỏ qua
            </button>
            <button onClick={saveCreateVoucher} className="h-10 rounded-xl bg-gray-100 px-6 text-sm text-gray-700">Lưu & in</button>
            <button onClick={saveCreateVoucher} className="h-10 rounded-xl bg-blue-600 px-8 text-sm text-white">Lưu</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-gray-500">{label}</div>
      <div className="mt-1 text-gray-900">{value}</div>
    </div>
  );
}

function DetailField({ label, value, link = false }: { label: string; value: string; link?: boolean }) {
  return (
    <div className="border-b border-blue-100 pb-1">
      <div>{label}</div>
      <div className={`mt-1 text-xs ${link ? 'text-blue-600' : 'text-gray-900'}`}>{value}</div>
    </div>
  );
}
