export interface Customer {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  gender: string;
  dob: string;
  status: string;
  source: string;
  address: string;
  channel: string;
  channelLinked: boolean;
  tags: string[];
  debt: number;
  chatbot: boolean;
  avatar?: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  totalSpend: number;
  treatmentCount: number;
  sessionsCompleted: number;
  lastVisit: string;
  score: number;
  scoreRank: string;
  assignedTo: string;
}

export const customers: Customer[] = [
  { id: '1', code: 'KH0001', name: 'Tuấn', phone: '*****21033', email: 'tuan@gmail.com', gender: 'Nam', dob: '15/06/1990', status: 'Hoạt động', source: 'Pancake', address: 'Hà Nội', channel: 'Pancake', channelLinked: true, tags: [], debt: 0, chatbot: false, note: '', createdAt: '15/03/2024', updatedAt: '22/04/2026 10:30', totalSpend: 0, treatmentCount: 0, sessionsCompleted: 0, lastVisit: '', score: 65, scoreRank: 'B', assignedTo: 'Trần Thị Hạnh' },
  { id: '2', code: 'KH0002', name: 'Kiên', phone: '*****31033', email: 'kien@gmail.com', gender: 'Nam', dob: '20/01/1988', status: 'Hoạt động', source: 'Pancake', address: 'Hà Nội', channel: 'Pancake', channelLinked: true, tags: ['1 tháng', 'VIP'], debt: 0, chatbot: true, note: '', createdAt: '10/02/2024', updatedAt: '20/04/2026', totalSpend: 5000000, treatmentCount: 1, sessionsCompleted: 4, lastVisit: '10/04/2026', score: 72, scoreRank: 'B', assignedTo: 'Nguyễn Văn A' },
  { id: '3', code: 'KH0003', name: 'Nam', phone: '*****14686', email: 'huydre37@gmail.com', gender: 'Nam', dob: '', status: 'Tạm nghỉ', source: 'Zalo', address: '', channel: 'Pancake', channelLinked: true, tags: ['Tiềm năng'], debt: 1200000, chatbot: true, note: '', createdAt: '12/01/2024', updatedAt: '18/04/2026', totalSpend: 1200000, treatmentCount: 0, sessionsCompleted: 0, lastVisit: '', score: 50, scoreRank: 'C', assignedTo: '' },
  { id: '4', code: 'KH0004', name: 'Phạm Thị Hương', phone: '*****20473', email: 'huongnguyen@gmail.com', gender: 'Nữ', dob: '12/06/1996', status: 'Hoạt động', source: 'Pancake - Zalo OA', address: 'Số 88, Phố Huế, Hai Bà Trưng, Hà Nội', channel: 'Pancake', channelLinked: true, tags: ['1 tháng'], debt: 0, chatbot: false, note: '', createdAt: '15/03/2024', updatedAt: '22/04/2026 10:30', totalSpend: 12450000, treatmentCount: 2, sessionsCompleted: 8, lastVisit: '18/04/2026', score: 86, scoreRank: 'A', assignedTo: 'Trần Thị Hạnh' },
  { id: '5', code: 'KH0005', name: 'Nguyễn Thị Nhật', phone: '*****54673', email: 'nhat@gmail.com', gender: 'Nữ', dob: '05/09/1995', status: 'Hoạt động', source: 'Pancake', address: 'Hà Nội', channel: 'Pancake', channelLinked: true, tags: ['1 tháng'], debt: 0, chatbot: false, note: '', createdAt: '20/03/2024', updatedAt: '15/04/2026', totalSpend: 3200000, treatmentCount: 1, sessionsCompleted: 3, lastVisit: '15/04/2026', score: 70, scoreRank: 'B', assignedTo: '' },
  { id: '6', code: 'KH0006', name: 'Nguyễn Thị Hạnh', phone: '*****99180', email: 'hanh@gmail.com', gender: 'Nữ', dob: '', status: 'Hoạt động', source: 'Pancake', address: '', channel: 'Pancake', channelLinked: true, tags: ['1 tháng'], debt: 0, chatbot: false, note: '', createdAt: '01/04/2024', updatedAt: '10/04/2026', totalSpend: 0, treatmentCount: 0, sessionsCompleted: 0, lastVisit: '', score: 40, scoreRank: 'C', assignedTo: '' },
  { id: '7', code: 'KH0007', name: 'Trần Thị Hạnh', phone: '*****52003', email: 'tranhanh@gmail.com', gender: 'Nữ', dob: '18/03/1992', status: 'Hoạt động', source: 'Pancake', address: 'Hà Nội', channel: 'Pancake', channelLinked: true, tags: ['1 tháng'], debt: 0, chatbot: false, note: '', createdAt: '15/04/2024', updatedAt: '08/04/2026', totalSpend: 8500000, treatmentCount: 1, sessionsCompleted: 6, lastVisit: '08/04/2026', score: 78, scoreRank: 'B', assignedTo: '' },
  { id: '8', code: 'KH0008', name: 'Nguyễn Thị Thuỷ', phone: '*****20867', email: 'thuy@gmail.com', gender: 'Nữ', dob: '', status: 'Hoạt động', source: 'Pancake', address: '', channel: 'Pancake', channelLinked: true, tags: ['1 tháng'], debt: 0, chatbot: false, note: '', createdAt: '20/04/2024', updatedAt: '05/04/2026', totalSpend: 0, treatmentCount: 0, sessionsCompleted: 0, lastVisit: '', score: 35, scoreRank: 'D', assignedTo: '' },
  { id: '9', code: 'KH0009', name: 'Vũ Thị Lan', phone: '*****92101', email: 'lan@gmail.com', gender: 'Nữ', dob: '25/12/1994', status: 'Hoạt động', source: 'Pancake', address: 'Hà Nội', channel: 'Pancake', channelLinked: true, tags: ['1 tháng'], debt: 0, chatbot: false, note: '', createdAt: '01/05/2024', updatedAt: '01/04/2026', totalSpend: 2000000, treatmentCount: 1, sessionsCompleted: 2, lastVisit: '01/04/2026', score: 60, scoreRank: 'B', assignedTo: '' },
  { id: '10', code: 'KH0010', name: 'Nguyễn Viết Quyết', phone: '*****03592', email: 'quyet@gmail.com', gender: 'Nam', dob: '', status: 'Hoạt động', source: 'Pancake', address: '', channel: 'Pancake', channelLinked: true, tags: ['1 tháng'], debt: 0, chatbot: false, note: '', createdAt: '10/05/2024', updatedAt: '28/03/2026', totalSpend: 0, treatmentCount: 0, sessionsCompleted: 0, lastVisit: '', score: 30, scoreRank: 'D', assignedTo: '' },
];

export const profileCustomer: Customer = customers[3]; // Phạm Thị Hương as the detailed profile

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'staff' | 'system';
  text: string;
  time: string;
  type?: 'text' | 'appointment';
  appointmentData?: {
    title: string;
    time: string;
    staff: string;
  };
}

export const chatMessages: ChatMessage[] = [
  { id: '1', sender: 'customer', text: 'Chào spa, mình muốn đặt lịch tư vấn liệu trình trị mụn a', time: '10:46', type: 'text' },
  { id: '2', sender: 'staff', text: 'Chào chị Hương\nSpa còn lịch tư vấn vào 14:00 chiều nay hoặc 10:00 sáng mai.\nChị muốn đặt lịch thời gian nào ạ?', time: '10:44', type: 'text' },
  { id: '3', sender: 'customer', text: 'Mai sáng giúp mình nhé', time: '10:45', type: 'text' },
  { id: '4', sender: 'system', text: '', time: '10:45', type: 'appointment', appointmentData: { title: 'Tư vấn da - Trị mụn cơ bản', time: '10:00 - 19/04/2026', staff: 'NV tư vấn: Lan Anh' } },
  { id: '5', sender: 'staff', text: 'Dạ vâng, em đã đặt lịch cho chị 10:00 sáng mai với bạn Lan Anh.\nSpa gửi chị địa chỉ và lưu ý trước khi đến nhé!', time: '10:46', type: 'text' },
];

export const conversationList = [
  { id: '1', platform: 'Zalo', name: 'Zalo (Pancake)', time: '10:46', preview: 'Dạ vâng, em đã đặt lịch cho chị 10:00...', date: '18/04' },
  { id: '2', platform: 'Facebook', name: 'Facebook (Pancake)', time: '09:15', preview: 'Spa còn lịch tư vấn hôm nay không ạ?', date: '18/04' },
  { id: '3', platform: 'Instagram', name: 'Instagram (Pancake)', time: '16/04', preview: 'Cho mình hỏi giá gói chăm sóc da...', date: '16/04' },
  { id: '4', platform: 'System', name: 'Tin nhắn hệ thống', time: '16/04', preview: 'Nhắc lịch hẹn: 18/04/2026 14:00', date: '16/04' },
  { id: '5', platform: 'Zalo', name: 'Zalo (Pancake)', time: '15/03', preview: 'Chào chị Hương, da mình đang giấp...', date: '15/03' },
];

export const scoreHistory = [
  { date: '15/02', score: 72 },
  { date: '15/03', score: 78 },
  { date: '01/04', score: 82 },
  { date: '18/04', score: 86 },
];

export const scoreFactors = [
  { name: 'Tần suất quay lại', desc: 'Số lần quay lại trong 90 ngày', weight: '30%', score: '26 / 30', note: 'Quay lại 3 lần trong 60 ngày' },
  { name: 'Tổng chi tiêu', desc: 'Tổng tiền đã chi tiêu', weight: '25%', score: '22 / 25', note: '12.450.000 đ' },
  { name: 'Mức độ hoàn thành liệu trình', desc: 'Tỷ lệ buổi đã thực hiện / đã mua', weight: '20%', score: '16 / 20', note: '4 / 8 buổi (50%)' },
  { name: 'Tương tác & phản hồi', desc: 'Nhắn tin, phản hồi, đánh giá', weight: '15%', score: '13 / 15', note: '5 tin nhắn, phản hồi tốt' },
  { name: 'Thanh toán & công nợ', desc: 'Tỷ lệ thanh toán đúng hạn', weight: '10%', score: '9 / 10', note: 'Thanh toán đúng hạn, còn nợ 1.250.000 đ' },
];

export const scoreDetailHistory = [
  { date: '18/04/2026', score: 86, change: '+4', rank: 'A' },
  { date: '01/04/2026', score: 82, change: '+4', rank: 'A' },
  { date: '15/03/2026', score: 78, change: '+6', rank: 'B' },
  { date: '15/02/2026', score: 72, change: '-', rank: 'B' },
];

export const treatments = [
  { name: 'Liệu trình trị mụn nâng cao', package: 'Gói 10 buổi - 5.000.000 đ', total: 10, done: 6, remaining: 4, status: 'Đang thực hiện' },
  { name: 'Liệu trình trẻ hóa da', package: 'Gói 8 buổi - 8.000.000 đ', total: 8, done: 2, remaining: 6, status: 'Chờ bắt đầu' },
];

export const recentProducts = [
  { name: 'Serum trị mụn', qty: 1, date: '10/04/2026' },
  { name: 'Kem dưỡng ẩm', qty: 2, date: '05/04/2026' },
  { name: 'Combo làm sạch sâu', qty: 1, date: '01/04/2026' },
  { name: 'Mặt nạ phục hồi', qty: 3, date: '28/03/2026' },
  { name: 'Toner cân bằng da', qty: 1, date: '18/03/2026' },
];

export const recentActivities = [
  { time: '18/04/2026 09:15', text: 'Nhân viên Trần Thị Hạnh tạo lịch hẹn' },
  { time: '21/04/2026 -', text: 'Chăm sóc da cơ bản' },
  { time: '16/04/2026 14:32', text: 'Gửi tin nhắn CSKH: Nhắc lịch hẹn' },
  { time: '10/04/2026 11:00', text: 'Hoàn thành buổi điều trị #BUO100678' },
  { time: '10/04/2026 11:00', text: 'Liệu trình: Liệu trình trị mụn nâng cao' },
  { time: '05/04/2026 08:45', text: 'Thanh toán 2.000.000 đ - Phiếu thu PT000482' },
  { time: '15/03/2024 16:32', text: 'Nhân viên Nguyễn Văn A thêm mới khách hàng' },
];

export const sidebarItems = [
  { icon: 'LayoutDashboard', label: 'Tổng quan', path: '/' },
  { icon: 'Users', label: 'Khách hàng', path: '/customers' },
  { icon: 'Calendar', label: 'Lịch hẹn', path: '#' },
  { icon: 'Tag', label: 'Thẻ tag', path: '#' },
  { icon: 'Route', label: 'Liệu trình', path: '#' },
  { icon: 'ClipboardList', label: 'Ghi nhận điều trị', path: '#' },
  { icon: 'Package', label: 'Gói điều trị', path: '#' },
  { icon: 'ShoppingBag', label: 'Sản phẩm', path: '#' },
  { icon: 'ShoppingCart', label: 'Sản phẩm đã bán', path: '#' },
  { icon: 'Heart', label: 'Chăm sóc khách hàng', path: '#' },
  { icon: 'Image', label: 'Thư viện ảnh', path: '#' },
  { icon: 'Settings', label: 'Cài đặt', path: '#' },
];

export interface CashierCatalogItem {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  section: 'Dịch vụ nổi bật' | 'Gói dịch vụ' | 'Thẻ tài khoản' | 'Sản phẩm';
  tag: 'Dịch vụ' | 'Gói dịch vụ' | 'Thẻ tài khoản' | 'Sản phẩm';
  tone: string;
}

export interface CashierCustomer {
  id: string;
  name: string;
  phone: string;
  memberLevel: string;
  debt: number;
  points: number;
  initials: string;
}

export interface CashierStaff {
  id: string;
  name: string;
  role: 'Kỹ thuật viên' | 'Tư vấn';
  initials: string;
}

export interface CashierPurchasedPackage {
  id: string;
  customerId: string;
  name: string;
  subtitle: string;
  price: number;
}

export const cashierCatalogItems: CashierCatalogItem[] = [
  { id: 'svc-1', name: 'Điều trị nám', subtitle: '60\'', price: 1500000, section: 'Dịch vụ nổi bật', tag: 'Dịch vụ', tone: 'from-orange-100 to-rose-100' },
  { id: 'svc-2', name: 'Hydra Facial', subtitle: '75\'', price: 1800000, section: 'Dịch vụ nổi bật', tag: 'Dịch vụ', tone: 'from-rose-100 to-orange-50' },
  { id: 'svc-3', name: 'Điều trị mụn', subtitle: '60\'', price: 1400000, section: 'Dịch vụ nổi bật', tag: 'Dịch vụ', tone: 'from-amber-100 to-red-50' },
  { id: 'svc-4', name: 'Triệt lông Diode', subtitle: '45\'', price: 900000, section: 'Dịch vụ nổi bật', tag: 'Dịch vụ', tone: 'from-sky-100 to-indigo-50' },
  { id: 'svc-5', name: 'Massage body', subtitle: '60\'', price: 800000, section: 'Dịch vụ nổi bật', tag: 'Dịch vụ', tone: 'from-orange-100 to-amber-50' },
  { id: 'svc-6', name: 'Hút chì thải độc', subtitle: '30\'', price: 600000, section: 'Dịch vụ nổi bật', tag: 'Dịch vụ', tone: 'from-red-100 to-orange-50' },
  { id: 'pkg-1', name: 'Gói chăm sóc da cơ bản 5 buổi', subtitle: '5 buổi', price: 6000000, section: 'Gói dịch vụ', tag: 'Gói dịch vụ', tone: 'from-rose-100 to-pink-50' },
  { id: 'pkg-2', name: 'Gói trị nám chuyên sâu 10 buổi', subtitle: '10 buổi', price: 15000000, section: 'Gói dịch vụ', tag: 'Gói dịch vụ', tone: 'from-orange-100 to-rose-50' },
  { id: 'pkg-3', name: 'Gói triệt lông toàn thân 10 buổi', subtitle: '10 buổi', price: 9000000, section: 'Gói dịch vụ', tag: 'Gói dịch vụ', tone: 'from-pink-100 to-fuchsia-50' },
  { id: 'wallet-1', name: 'Thẻ 5.000.000đ', subtitle: 'Giá trị nạp', price: 5000000, section: 'Thẻ tài khoản', tag: 'Thẻ tài khoản', tone: 'from-emerald-100 to-green-50' },
  { id: 'wallet-2', name: 'Thẻ 10.000.000đ', subtitle: 'Giá trị nạp', price: 10000000, section: 'Thẻ tài khoản', tag: 'Thẻ tài khoản', tone: 'from-amber-100 to-yellow-50' },
  { id: 'wallet-3', name: 'Thẻ 20.000.000đ', subtitle: 'Giá trị nạp', price: 20000000, section: 'Thẻ tài khoản', tag: 'Thẻ tài khoản', tone: 'from-violet-100 to-purple-50' },
  { id: 'prd-1', name: 'Serum Vitamin C', subtitle: '30ml', price: 650000, section: 'Sản phẩm', tag: 'Sản phẩm', tone: 'from-orange-100 to-amber-50' },
  { id: 'prd-2', name: 'Kem chống nắng SPF50+', subtitle: '10ml', price: 450000, section: 'Sản phẩm', tag: 'Sản phẩm', tone: 'from-orange-50 to-yellow-50' },
  { id: 'prd-3', name: 'Sữa rửa mặt Gentle Cleanser', subtitle: '100ml', price: 350000, section: 'Sản phẩm', tag: 'Sản phẩm', tone: 'from-teal-50 to-emerald-50' },
];

export const cashierCustomers: CashierCustomer[] = [
  { id: 'cashier-kh-1', name: 'Nguyễn Thị Thanh', phone: '0986 123 456', memberLevel: 'Thành viên', debt: 1200000, points: 1250, initials: 'NT' },
  { id: 'cashier-kh-2', name: 'Phạm Thu Hà', phone: '0912 456 788', memberLevel: 'VIP', debt: 350000, points: 2480, initials: 'PH' },
  { id: 'cashier-kh-3', name: 'Trần Ngọc Lan', phone: '0978 888 222', memberLevel: 'Khách mới', debt: 0, points: 120, initials: 'TL' },
];

export const cashierStaffs: CashierStaff[] = [
  { id: 'staff-1', name: 'Nguyễn Thị Hoa', role: 'Kỹ thuật viên', initials: 'NH' },
  { id: 'staff-2', name: 'Trần Minh Anh', role: 'Tư vấn', initials: 'TA' },
  { id: 'staff-3', name: 'Lê Thu Trang', role: 'Kỹ thuật viên', initials: 'LT' },
  { id: 'staff-4', name: 'Phạm Quỳnh Nga', role: 'Tư vấn', initials: 'PN' },
];

export const cashierPurchasedPackages: CashierPurchasedPackage[] = [
  { id: 'owned-pkg-1', customerId: '4', name: 'Gói chăm sóc da cơ bản 5 buổi', subtitle: 'Còn 5/5 buổi', price: 0 },
  { id: 'owned-pkg-2', customerId: '4', name: 'Gói trị nám chuyên sâu 10 buổi', subtitle: 'Còn 7/10 buổi', price: 0 },
  { id: 'owned-pkg-3', customerId: '7', name: 'Gói triệt lông toàn thân 10 buổi', subtitle: 'Còn 4/10 buổi', price: 0 },
];

export const cashierPaymentMethods = [
  'Tiền mặt',
  'Chuyển khoản',
  'Thẻ',
  'Ví điện tử',
  'Trả góp',
  'Kết hợp nhiều phương thức',
] as const;

export interface TreatmentPackageSessionItem {
  id: string;
  itemId: string;
  name: string;
  packageName: string;
  quantity: number;
}

export interface TreatmentSaleProductItem {
  id: string;
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface TreatmentUsedProductItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  stockStatus: 'deducted' | 'pending';
}

export interface TreatmentSessionDraft {
  id: string;
  draftInvoiceId: string;
  customerId: string;
  treatmentName: string;
  sessionNumber: number;
  totalSessions: number;
  date: string;
  status: 'draft' | 'done' | 'locked';
  therapist: string;
  createdBy: string;
  skinCondition: string;
  reaction: string;
  nextAppointment: string;
  note: string;
  aftercare: string;
  packageSessions: TreatmentPackageSessionItem[];
  saleProducts: TreatmentSaleProductItem[];
  usedProducts: TreatmentUsedProductItem[];
}

export const pendingTreatmentDrafts: TreatmentSessionDraft[] = [
  {
    id: 'TS-240423-001',
    draftInvoiceId: 'HDN-240423-001',
    customerId: '4',
    treatmentName: '5 buổi Laser công nghệ cao (Tặng)',
    sessionNumber: 2,
    totalSessions: 5,
    date: '19/05/2026',
    status: 'done',
    therapist: 'Nguyễn Thị Hoa',
    createdBy: 'Admin User',
    skinCondition: 'Da hơi đỏ nhẹ sau laser, vùng má phục hồi tốt.',
    reaction: 'Khách phản ứng bình thường, không rát kéo dài.',
    nextAppointment: '26/05/2026',
    note: 'Dặn khách tránh nắng mạnh trong 48 giờ.',
    aftercare: 'Dùng kem phục hồi buổi tối và chống nắng SPF50 ban ngày.',
    packageSessions: [
      {
        id: 'pkg-session-1',
        itemId: 'owned-pkg-1',
        name: 'Buổi Laser công nghệ cao',
        packageName: '5 buổi Laser công nghệ cao (Tặng)',
        quantity: 1,
      },
    ],
    saleProducts: [
      {
        id: 'sale-1',
        itemId: 'prd-2',
        name: 'Kem chống nắng SPF50+',
        quantity: 1,
        unitPrice: 450000,
      },
    ],
    usedProducts: [
      {
        id: 'used-1',
        name: 'AMORA-PINK PLUS 5DAY NATURAL PINK NIPPLE CREAM - Bộ kem làm hồng',
        quantity: 1,
        unit: 'lần dùng',
        stockStatus: 'deducted',
      },
    ],
  },
  {
    id: 'TS-240423-002',
    draftInvoiceId: 'HDN-240423-002',
    customerId: '7',
    treatmentName: 'Gói triệt lông toàn thân 10 buổi',
    sessionNumber: 7,
    totalSessions: 10,
    date: '19/05/2026',
    status: 'done',
    therapist: 'Lê Thu Trang',
    createdBy: 'Admin User',
    skinCondition: 'Da ổn định, không kích ứng trước buổi điều trị.',
    reaction: 'Khách hơi nóng vùng cánh tay, đã làm dịu.',
    nextAppointment: '02/06/2026',
    note: 'Tư vấn thêm serum phục hồi sau điều trị.',
    aftercare: 'Không tẩy da chết trong 3 ngày.',
    packageSessions: [
      {
        id: 'pkg-session-2',
        itemId: 'owned-pkg-3',
        name: 'Buổi triệt lông toàn thân',
        packageName: 'Gói triệt lông toàn thân 10 buổi',
        quantity: 1,
      },
    ],
    saleProducts: [
      {
        id: 'sale-2',
        itemId: 'prd-1',
        name: 'Serum Vitamin C',
        quantity: 1,
        unitPrice: 650000,
      },
      {
        id: 'sale-3',
        itemId: 'prd-3',
        name: 'Sữa rửa mặt Gentle Cleanser',
        quantity: 2,
        unitPrice: 350000,
      },
    ],
    usedProducts: [
      {
        id: 'used-2',
        name: 'Gel làm dịu sau triệt lông',
        quantity: 2,
        unit: 'ml',
        stockStatus: 'deducted',
      },
    ],
  },
  {
    id: 'TS-240423-003',
    draftInvoiceId: 'HDN-240423-003',
    customerId: '2',
    treatmentName: 'Liệu trình trị mụn nâng cao',
    sessionNumber: 4,
    totalSessions: 10,
    date: '19/05/2026',
    status: 'done',
    therapist: 'Nguyễn Thị Hoa',
    createdBy: 'Admin User',
    skinCondition: 'Mụn viêm giảm, còn thâm nhẹ vùng cằm.',
    reaction: 'Khách hơi châm chích 5 phút đầu, sau đó ổn định.',
    nextAppointment: '29/05/2026',
    note: 'Dặn khách không tự nặn mụn trong tuần này.',
    aftercare: 'Dùng serum phục hồi và sữa rửa mặt dịu nhẹ.',
    packageSessions: [
      {
        id: 'pkg-session-3',
        itemId: 'pkg-2',
        name: 'Buổi trị mụn nâng cao',
        packageName: 'Liệu trình trị mụn nâng cao',
        quantity: 1,
      },
    ],
    saleProducts: [
      {
        id: 'sale-4',
        itemId: 'prd-1',
        name: 'Serum Vitamin C',
        quantity: 1,
        unitPrice: 650000,
      },
    ],
    usedProducts: [
      {
        id: 'used-3',
        name: 'Bông tẩy trang vô khuẩn',
        quantity: 6,
        unit: 'miếng',
        stockStatus: 'deducted',
      },
      {
        id: 'used-4',
        name: 'Dung dịch sát khuẩn da',
        quantity: 10,
        unit: 'ml',
        stockStatus: 'deducted',
      },
    ],
  },
];
