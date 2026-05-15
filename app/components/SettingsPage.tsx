import { useMemo, useRef, useState } from 'react';
import {
  BadgeCheck,
  Bell,
  Bot,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  Circle,
  Clock3,
  Copy,
  Database,
  Edit3,
  Eye,
  FileText,
  KeyRound,
  LockKeyhole,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  Upload,
  Trash2,
  UserCheck,
  UserCog,
  UserPlus,
  Users,
  WalletCards,
} from 'lucide-react';
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

type SettingsPanel = 'system' | 'users' | 'roles';
type UserStatus = 'Đang hoạt động' | 'Ngừng hoạt động';
type AccessMode = 'all' | 'fixed';
type PermissionTab = 'role' | 'other';

interface PermissionItem {
  id: string;
  label: string;
  note?: string;
}

interface PermissionCategory {
  id: string;
  title: string;
  description: string;
  permissions: PermissionItem[];
}

interface Branch {
  id: string;
  name: string;
}

interface ExtraAccess {
  commonData: boolean;
  otherStaffReports: boolean;
  otherStaffTransactions: boolean;
}

interface RoleTemplate {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  system?: boolean;
}

interface UserAccount {
  id: string;
  displayName: string;
  username: string;
  employeeCode: string;
  phone: string;
  email: string;
  roleId: string;
  branchIds: string[];
  branchRoleAssignments: Record<string, string>;
  permissionsByBranch: Record<string, string[]>;
  extraAccess: ExtraAccess;
  status: UserStatus;
  accessMode: AccessMode;
  scheduleDays: string[];
  scheduleFrom: string;
  scheduleTo: string;
  lastLogin: string;
  notes: string;
}

interface UserDraft {
  id?: string;
  displayName: string;
  username: string;
  password: string;
  employeeCode: string;
  phone: string;
  email: string;
  roleId: string;
  branchIds: string[];
  extraAccess: ExtraAccess;
  status: UserStatus;
  accessMode: AccessMode;
  scheduleDays: string[];
  scheduleFrom: string;
  scheduleTo: string;
  notes: string;
}

interface RoleDraft {
  id?: string;
  name: string;
  description: string;
  permissions: string[];
}

const branches: Branch[] = [
  { id: 'main', name: 'Chi nhánh trung tâm' },
  { id: 'thanh-xuan', name: 'Cơ sở Thanh Xuân' },
  { id: 'cau-giay', name: 'Cơ sở Cầu Giấy' },
];

const weekDays = [
  { id: 'mon', label: 'T2' },
  { id: 'tue', label: 'T3' },
  { id: 'wed', label: 'T4' },
  { id: 'thu', label: 'T5' },
  { id: 'fri', label: 'T6' },
  { id: 'sat', label: 'T7' },
  { id: 'sun', label: 'CN' },
];

const permissionCatalog: PermissionCategory[] = [
  {
    id: 'schedule',
    title: 'Lịch làm dịch vụ',
    description: 'Quyền xem, tạo và điều phối lịch hẹn dịch vụ.',
    permissions: [
      { id: 'schedule.view', label: 'Xem lịch hẹn' },
      { id: 'schedule.create', label: 'Tạo lịch hẹn' },
      { id: 'schedule.edit', label: 'Sửa, đổi lịch hẹn' },
      { id: 'schedule.cancel', label: 'Hủy lịch hẹn' },
    ],
  },
  {
    id: 'dashboard',
    title: 'Tổng quan',
    description: 'Thông tin vận hành, doanh thu và hiệu suất trong ngày.',
    permissions: [
      { id: 'dashboard.view', label: 'Xem tổng quan' },
      { id: 'dashboard.revenue', label: 'Xem doanh thu tổng' },
      { id: 'dashboard.branch', label: 'Xem số liệu theo chi nhánh' },
    ],
  },
  {
    id: 'customers',
    title: 'Khách hàng',
    description: 'Quản lý hồ sơ khách, tag, công nợ và lịch sử tương tác.',
    permissions: [
      { id: 'customers.view', label: 'Xem danh sách khách hàng' },
      { id: 'customers.create', label: 'Thêm khách hàng' },
      { id: 'customers.edit', label: 'Cập nhật hồ sơ khách hàng' },
      { id: 'customers.delete', label: 'Xóa khách hàng' },
      { id: 'customers.vip', label: 'Xem khách hàng VIP và dữ liệu nhạy cảm' },
      { id: 'customers.export', label: 'Xuất Excel danh sách khách hàng' },
    ],
  },
  {
    id: 'tags',
    title: 'Thẻ tag',
    description: 'Quản lý thẻ tag, quy tắc tự động và nhật ký thực thi.',
    permissions: [
      { id: 'tags.view', label: 'Xem danh sách thẻ tag' },
      { id: 'tags.rules', label: 'Quản lý quy tắc tự động' },
      { id: 'tags.logs', label: 'Xem nhật ký thực thi' },
      { id: 'tags.export', label: 'Xuất Excel nhật ký thực thi' },
    ],
  },
  {
    id: 'orders',
    title: 'Đơn hàng',
    description: 'Tư vấn bán hàng, thanh toán và thao tác hóa đơn.',
    permissions: [
      { id: 'orders.view', label: 'Xem hóa đơn' },
      { id: 'orders.create', label: 'Tạo hóa đơn' },
      { id: 'orders.edit', label: 'Sửa hóa đơn' },
      { id: 'orders.cancel', label: 'Hủy hóa đơn' },
      { id: 'orders.discount', label: 'Điều chỉnh giảm giá' },
    ],
  },
  {
    id: 'catalog',
    title: 'Hàng hóa',
    description: 'Dịch vụ, gói liệu trình, thẻ tài khoản, sản phẩm và giá bán.',
    permissions: [
      { id: 'catalog.view', label: 'Xem danh sách hàng hóa, dịch vụ' },
      { id: 'catalog.create', label: 'Thêm hàng hóa, dịch vụ' },
      { id: 'catalog.edit', label: 'Sửa thông tin và thiết lập giá' },
      { id: 'catalog.cost', label: 'Xem giá vốn' },
      { id: 'catalog.inventory', label: 'Kiểm kho và xuất hủy' },
    ],
  },
  {
    id: 'staff',
    title: 'Nhân viên',
    description: 'Nhân sự, chấm công, hoa hồng và tính lương.',
    permissions: [
      { id: 'staff.view', label: 'Xem danh sách nhân viên' },
      { id: 'staff.create', label: 'Thêm nhân viên' },
      { id: 'staff.edit', label: 'Cập nhật thông tin nhân viên' },
      { id: 'staff.payroll', label: 'Xem và tính lương' },
      { id: 'staff.commission', label: 'Thiết lập hoa hồng' },
    ],
  },
  {
    id: 'cashbook',
    title: 'Sổ quỹ',
    description: 'Phiếu thu, phiếu chi, quỹ tiền mặt, ngân hàng và ví điện tử.',
    permissions: [
      { id: 'cashbook.view', label: 'Xem sổ quỹ' },
      { id: 'cashbook.receive', label: 'Tạo phiếu thu' },
      { id: 'cashbook.pay', label: 'Tạo phiếu chi' },
      { id: 'cashbook.edit', label: 'Sửa phiếu thu chi' },
      { id: 'cashbook.cancel', label: 'Hủy phiếu thu chi' },
      { id: 'cashbook.export', label: 'Xuất file sổ quỹ' },
    ],
  },
  {
    id: 'reports',
    title: 'Báo cáo',
    description: 'Báo cáo cuối ngày, doanh thu, công nợ và hiệu quả nhân viên.',
    permissions: [
      { id: 'reports.day', label: 'Xem báo cáo cuối ngày' },
      { id: 'reports.revenue', label: 'Xem báo cáo doanh thu' },
      { id: 'reports.debt', label: 'Xem báo cáo công nợ' },
      { id: 'reports.staff', label: 'Xem báo cáo nhân viên' },
    ],
  },
  {
    id: 'settings',
    title: 'Thiết lập',
    description: 'Cài đặt cửa hàng, chi nhánh, người dùng và tích hợp.',
    permissions: [
      { id: 'settings.store', label: 'Thiết lập cửa hàng' },
      { id: 'settings.branches', label: 'Quản lý chi nhánh' },
      { id: 'settings.users', label: 'Quản lý người dùng' },
      { id: 'settings.roles', label: 'Quản lý vai trò và phân quyền' },
      { id: 'settings.integrations', label: 'Cấu hình KiotViet, Pancake, AI' },
    ],
  },
];

const allPermissionIds = permissionCatalog.flatMap((category) =>
  category.permissions.map((permission) => permission.id),
);

const managerPermissionIds = allPermissionIds.filter(
  (id) => !['settings.integrations', 'catalog.cost'].includes(id),
);

const receptionistPermissionIds = [
  'schedule.view',
  'schedule.create',
  'schedule.edit',
  'dashboard.view',
  'customers.view',
  'customers.create',
  'customers.edit',
  'orders.view',
  'orders.create',
  'cashbook.view',
  'cashbook.receive',
  'catalog.view',
];

const technicianPermissionIds = [
  'schedule.view',
  'customers.view',
  'customers.edit',
  'catalog.view',
  'orders.view',
];

const cashierPermissionIds = [
  'dashboard.view',
  'customers.view',
  'orders.view',
  'orders.create',
  'orders.edit',
  'orders.discount',
  'cashbook.view',
  'cashbook.receive',
  'cashbook.pay',
  'reports.day',
  'catalog.view',
];

const initialRoles: RoleTemplate[] = [
  {
    id: 'owner',
    name: 'Chủ cửa hàng',
    description: 'Toàn quyền cấu hình hệ thống, dữ liệu và báo cáo.',
    permissions: allPermissionIds,
    system: true,
  },
  {
    id: 'manager',
    name: 'Quản lý chi nhánh',
    description: 'Quản lý vận hành, khách hàng, nhân viên và báo cáo chi nhánh.',
    permissions: managerPermissionIds,
    system: true,
  },
  {
    id: 'receptionist',
    name: 'Lễ tân',
    description: 'Tạo lịch hẹn, tiếp nhận khách và lập hóa đơn cơ bản.',
    permissions: receptionistPermissionIds,
  },
  {
    id: 'technician',
    name: 'Kỹ thuật viên',
    description: 'Xem lịch dịch vụ và cập nhật hồ sơ điều trị được phân công.',
    permissions: technicianPermissionIds,
  },
  {
    id: 'cashier',
    name: 'Thu ngân',
    description: 'Thanh toán hóa đơn, tạo phiếu thu chi và xem báo cáo cuối ngày.',
    permissions: cashierPermissionIds,
  },
];

const defaultExtraAccess: ExtraAccess = {
  commonData: true,
  otherStaffReports: false,
  otherStaffTransactions: false,
};

const createPermissionsByBranch = (branchIds: string[], permissionIds: string[]) =>
  branchIds.reduce<Record<string, string[]>>((acc, branchId) => {
    acc[branchId] = permissionIds;
    return acc;
  }, {});

const createRoleAssignments = (branchIds: string[], roleId: string) =>
  branchIds.reduce<Record<string, string>>((acc, branchId) => {
    acc[branchId] = roleId;
    return acc;
  }, {});

const initialUsers: UserAccount[] = [
  {
    id: 'u-1',
    displayName: 'Nguyễn Thị Hoa',
    username: 'HOA-QL',
    employeeCode: 'NV000001',
    phone: '0901 234 567',
    email: 'hoa@spa.com',
    roleId: 'manager',
    branchIds: ['main', 'thanh-xuan'],
    branchRoleAssignments: createRoleAssignments(['main', 'thanh-xuan'], 'manager'),
    permissionsByBranch: createPermissionsByBranch(['main', 'thanh-xuan'], managerPermissionIds),
    extraAccess: {
      commonData: true,
      otherStaffReports: true,
      otherStaffTransactions: true,
    },
    status: 'Đang hoạt động',
    accessMode: 'all',
    scheduleDays: weekDays.map((day) => day.id),
    scheduleFrom: '08:00',
    scheduleTo: '21:00',
    lastLogin: '23/04/2026 17:10',
    notes: 'Quản lý cơ sở trung tâm và Thanh Xuân.',
  },
  {
    id: 'u-2',
    displayName: 'Nguyễn Thị Thu Dịu',
    username: 'KTV-THUDIU',
    employeeCode: 'NV000047',
    phone: '0912 456 789',
    email: 'thudiu@spa.com',
    roleId: 'technician',
    branchIds: ['main'],
    branchRoleAssignments: createRoleAssignments(['main'], 'technician'),
    permissionsByBranch: createPermissionsByBranch(['main'], technicianPermissionIds),
    extraAccess: defaultExtraAccess,
    status: 'Đang hoạt động',
    accessMode: 'fixed',
    scheduleDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
    scheduleFrom: '09:00',
    scheduleTo: '18:00',
    lastLogin: '23/04/2026 13:42',
    notes: 'KTV mới, chỉ truy cập trong ca làm việc.',
  },
  {
    id: 'u-3',
    displayName: 'Trần Minh Anh',
    username: 'TMANH',
    employeeCode: 'NV000022',
    phone: '0988 000 123',
    email: 'minhanh@spa.com',
    roleId: 'cashier',
    branchIds: ['main'],
    branchRoleAssignments: createRoleAssignments(['main'], 'cashier'),
    permissionsByBranch: createPermissionsByBranch(['main'], cashierPermissionIds),
    extraAccess: {
      commonData: true,
      otherStaffReports: true,
      otherStaffTransactions: false,
    },
    status: 'Đang hoạt động',
    accessMode: 'all',
    scheduleDays: weekDays.map((day) => day.id),
    scheduleFrom: '08:00',
    scheduleTo: '21:00',
    lastLogin: '23/04/2026 14:54',
    notes: 'Thu ngân chính.',
  },
  {
    id: 'u-4',
    displayName: 'Phạm Thu Hà',
    username: 'LE-TAN-HA',
    employeeCode: 'NV000031',
    phone: '0904 262 629',
    email: 'hapt@spa.com',
    roleId: 'receptionist',
    branchIds: ['cau-giay'],
    branchRoleAssignments: createRoleAssignments(['cau-giay'], 'receptionist'),
    permissionsByBranch: createPermissionsByBranch(['cau-giay'], receptionistPermissionIds),
    extraAccess: defaultExtraAccess,
    status: 'Ngừng hoạt động',
    accessMode: 'fixed',
    scheduleDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
    scheduleFrom: '08:30',
    scheduleTo: '17:30',
    lastLogin: '18/04/2026 09:18',
    notes: 'Tài khoản tạm khóa sau khi nghỉ việc.',
  },
];

const emptyUserDraft = (roleId = initialRoles[1].id): UserDraft => ({
  displayName: '',
  username: '',
  password: '',
  employeeCode: '',
  phone: '',
  email: '',
  roleId,
  branchIds: [branches[0].id],
  extraAccess: defaultExtraAccess,
  status: 'Đang hoạt động',
  accessMode: 'all',
  scheduleDays: weekDays.map((day) => day.id),
  scheduleFrom: '08:00',
  scheduleTo: '21:00',
  notes: '',
});

const getRoleName = (roles: RoleTemplate[], roleId: string) =>
  roles.find((role) => role.id === roleId)?.name || 'Chưa gán vai trò';

const getBranchNames = (branchIds: string[]) =>
  branchIds
    .map((branchId) => branches.find((branch) => branch.id === branchId)?.name)
    .filter(Boolean)
    .join(', ');

const countPermissions = (permissionIds: string[]) => permissionIds.length;

const cloneExtraAccess = (extraAccess: ExtraAccess): ExtraAccess => ({ ...extraAccess });

export function SettingsPage() {
  const [activePanel, setActivePanel] = useState<SettingsPanel>('system');
  const [users, setUsers] = useState<UserAccount[]>(initialUsers);
  const [roles, setRoles] = useState<RoleTemplate[]>(initialRoles);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | UserStatus>('all');
  const [userDialogMode, setUserDialogMode] = useState<'create' | 'edit' | 'copy' | null>(null);
  const [userDraft, setUserDraft] = useState<UserDraft>(emptyUserDraft());
  const [permissionUser, setPermissionUser] = useState<UserAccount | null>(null);
  const [permissionTab, setPermissionTab] = useState<PermissionTab>('role');
  const [permissionBranchId, setPermissionBranchId] = useState(branches[0].id);
  const [permissionRoleId, setPermissionRoleId] = useState(initialRoles[1].id);
  const [permissionIds, setPermissionIds] = useState<string[]>(managerPermissionIds);
  const [extraAccess, setExtraAccess] = useState<ExtraAccess>(defaultExtraAccess);
  const [permissionAccessMode, setPermissionAccessMode] = useState<AccessMode>('all');
  const [permissionScheduleDays, setPermissionScheduleDays] = useState<string[]>(weekDays.map((day) => day.id));
  const [permissionScheduleFrom, setPermissionScheduleFrom] = useState('08:00');
  const [permissionScheduleTo, setPermissionScheduleTo] = useState('21:00');
  const [roleDialogMode, setRoleDialogMode] = useState<'create' | 'edit' | 'copy' | null>(null);
  const [roleDraft, setRoleDraft] = useState<RoleDraft>({
    name: '',
    description: '',
    permissions: receptionistPermissionIds,
  });
  const [selectedRoleId, setSelectedRoleId] = useState(initialRoles[1].id);

  const roleUsage = useMemo(() => {
    return roles.reduce<Record<string, number>>((acc, role) => {
      acc[role.id] = users.filter((user) => user.roleId === role.id).length;
      return acc;
    }, {});
  }, [roles, users]);

  const filteredUsers = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesSearch =
        !normalized ||
        `${user.displayName} ${user.username} ${user.employeeCode} ${user.phone}`
          .toLowerCase()
          .includes(normalized);
      const matchesRole = roleFilter === 'all' || user.roleId === roleFilter;
      const matchesBranch = branchFilter === 'all' || user.branchIds.includes(branchFilter);
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesBranch && matchesStatus;
    });
  }, [branchFilter, roleFilter, search, statusFilter, users]);

  const selectedRole = roles.find((role) => role.id === selectedRoleId) || roles[0];
  const openCreateUser = () => {
    setUserDraft(emptyUserDraft(roles[1]?.id || roles[0]?.id));
    setUserDialogMode('create');
  };

  const openEditUser = (user: UserAccount) => {
    setUserDraft({
      id: user.id,
      displayName: user.displayName,
      username: user.username,
      password: '',
      employeeCode: user.employeeCode,
      phone: user.phone,
      email: user.email,
      roleId: user.roleId,
      branchIds: user.branchIds,
      extraAccess: cloneExtraAccess(user.extraAccess),
      status: user.status,
      accessMode: user.accessMode,
      scheduleDays: user.scheduleDays,
      scheduleFrom: user.scheduleFrom,
      scheduleTo: user.scheduleTo,
      notes: user.notes,
    });
    setUserDialogMode('edit');
  };

  const openCopyUser = (user: UserAccount) => {
    setUserDraft({
      displayName: '',
      username: '',
      password: '',
      employeeCode: '',
      phone: '',
      email: '',
      roleId: user.roleId,
      branchIds: user.branchIds,
      extraAccess: cloneExtraAccess(user.extraAccess),
      status: 'Đang hoạt động',
      accessMode: user.accessMode,
      scheduleDays: user.scheduleDays,
      scheduleFrom: user.scheduleFrom,
      scheduleTo: user.scheduleTo,
      notes: `Sao chép quyền từ ${user.displayName}`,
    });
    setUserDialogMode('copy');
  };

  const saveUser = () => {
    const role = roles.find((item) => item.id === userDraft.roleId) || roles[0];
    const branchIds = userDraft.branchIds.length ? userDraft.branchIds : [branches[0].id];
    if (userDialogMode === 'edit' && userDraft.id) {
      setUsers((current) =>
        current.map((user) => {
          if (user.id !== userDraft.id) return user;
          const nextPermissionsByBranch = { ...user.permissionsByBranch };
          branchIds.forEach((branchId) => {
            if (!nextPermissionsByBranch[branchId]) {
              nextPermissionsByBranch[branchId] = role.permissions;
            }
          });
          return {
            ...user,
            displayName: userDraft.displayName || user.displayName,
            username: userDraft.username || user.username,
            employeeCode: userDraft.employeeCode || user.employeeCode,
            phone: userDraft.phone,
            email: userDraft.email,
            roleId: userDraft.roleId,
            branchIds,
            branchRoleAssignments: createRoleAssignments(branchIds, userDraft.roleId),
            permissionsByBranch: nextPermissionsByBranch,
            extraAccess: userDraft.extraAccess,
            status: userDraft.status,
            accessMode: userDraft.accessMode,
            scheduleDays: userDraft.scheduleDays,
            scheduleFrom: userDraft.scheduleFrom,
            scheduleTo: userDraft.scheduleTo,
            notes: userDraft.notes,
          };
        }),
      );
    } else {
      const id = `u-${Date.now()}`;
      setUsers((current) => [
        {
          id,
          displayName: userDraft.displayName || 'Người dùng mới',
          username: userDraft.username || `USER-${current.length + 1}`,
          employeeCode: userDraft.employeeCode || `NV${String(current.length + 1).padStart(6, '0')}`,
          phone: userDraft.phone,
          email: userDraft.email,
          roleId: userDraft.roleId,
          branchIds,
          branchRoleAssignments: createRoleAssignments(branchIds, userDraft.roleId),
          permissionsByBranch: createPermissionsByBranch(branchIds, role.permissions),
          extraAccess: userDraft.extraAccess,
          status: userDraft.status,
          accessMode: userDraft.accessMode,
          scheduleDays: userDraft.scheduleDays,
          scheduleFrom: userDraft.scheduleFrom,
          scheduleTo: userDraft.scheduleTo,
          lastLogin: 'Chưa đăng nhập',
          notes: userDraft.notes,
        },
        ...current,
      ]);
    }
    setUserDialogMode(null);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers((current) =>
      current.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === 'Đang hoạt động' ? 'Ngừng hoạt động' : 'Đang hoạt động',
            }
          : user,
      ),
    );
  };

  const deleteUser = (userId: string) => {
    setUsers((current) => current.filter((user) => user.id !== userId));
  };

  const openPermissionEditor = (user: UserAccount) => {
    const branchId = user.branchIds[0] || branches[0].id;
    const roleId = user.branchRoleAssignments[branchId] || user.roleId;
    const role = roles.find((item) => item.id === roleId) || roles[0];
    setPermissionUser(user);
    setPermissionTab('role');
    setPermissionBranchId(branchId);
    setPermissionRoleId(roleId);
    setPermissionIds(user.permissionsByBranch[branchId] || role.permissions);
    setExtraAccess(cloneExtraAccess(user.extraAccess));
    setPermissionAccessMode(user.accessMode);
    setPermissionScheduleDays(user.scheduleDays);
    setPermissionScheduleFrom(user.scheduleFrom);
    setPermissionScheduleTo(user.scheduleTo);
  };

  const changePermissionBranch = (branchId: string) => {
    if (!permissionUser) return;
    const roleId = permissionUser.branchRoleAssignments[branchId] || permissionUser.roleId;
    const role = roles.find((item) => item.id === roleId) || roles[0];
    setPermissionBranchId(branchId);
    setPermissionRoleId(roleId);
    setPermissionIds(permissionUser.permissionsByBranch[branchId] || role.permissions);
  };

  const changePermissionRole = (roleId: string) => {
    const role = roles.find((item) => item.id === roleId);
    setPermissionRoleId(roleId);
    setPermissionIds(role?.permissions || []);
  };

  const savePermissions = () => {
    if (!permissionUser) return;
    setUsers((current) =>
      current.map((user) => {
        if (user.id !== permissionUser.id) return user;
        return {
          ...user,
          roleId: permissionBranchId === user.branchIds[0] ? permissionRoleId : user.roleId,
          branchRoleAssignments: {
            ...user.branchRoleAssignments,
            [permissionBranchId]: permissionRoleId,
          },
          permissionsByBranch: {
            ...user.permissionsByBranch,
            [permissionBranchId]: permissionIds,
          },
          extraAccess,
          accessMode: permissionAccessMode,
          scheduleDays: permissionScheduleDays,
          scheduleFrom: permissionScheduleFrom,
          scheduleTo: permissionScheduleTo,
        };
      }),
    );
    setPermissionUser(null);
  };

  const openCreateRole = () => {
    setRoleDraft({
      name: '',
      description: '',
      permissions: receptionistPermissionIds,
    });
    setRoleDialogMode('create');
  };

  const openEditRole = (role: RoleTemplate) => {
    setRoleDraft({
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    });
    setRoleDialogMode('edit');
  };

  const openCopyRole = (role: RoleTemplate) => {
    setRoleDraft({
      name: `${role.name} sao chép`,
      description: role.description,
      permissions: role.permissions,
    });
    setRoleDialogMode('copy');
  };

  const saveRole = () => {
    if (roleDialogMode === 'edit' && roleDraft.id) {
      setRoles((current) =>
        current.map((role) =>
          role.id === roleDraft.id
            ? {
                ...role,
                name: roleDraft.name || role.name,
                description: roleDraft.description,
                permissions: roleDraft.permissions,
              }
            : role,
        ),
      );
    } else {
      const id = `role-${Date.now()}`;
      setRoles((current) => [
        ...current,
        {
          id,
          name: roleDraft.name || 'Vai trò mới',
          description: roleDraft.description,
          permissions: roleDraft.permissions,
        },
      ]);
      setSelectedRoleId(id);
    }
    setRoleDialogMode(null);
  };

  const deleteRole = (roleId: string) => {
    const role = roles.find((item) => item.id === roleId);
    if (!role || role.system || roleUsage[roleId] > 0) return;
    setRoles((current) => current.filter((item) => item.id !== roleId));
    if (selectedRoleId === roleId) {
      setSelectedRoleId(roles[0]?.id || '');
    }
  };

  return (
    <div className="min-h-full bg-gray-50 px-8 py-8">
      <main className="mx-auto max-w-[1680px]">
        {activePanel === 'system' ? (
          <SystemSettingsScreen onOpenUserManagement={() => setActivePanel('users')} />
        ) : (
          <>
            <button
              onClick={() => setActivePanel('system')}
              className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft className="h-4 w-4" />
              Cài đặt hệ thống
            </button>

            <div className="mb-7 flex items-end justify-between gap-6">
              <div>
                <h1 className="text-[32px] leading-tight text-gray-950">Quản lý người dùng</h1>
                <p className="mt-2 text-base text-gray-500">Thêm, sửa, xóa tài khoản nhân viên</p>
              </div>
              <button
                onClick={activePanel === 'users' ? openCreateUser : openCreateRole}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm text-white shadow-sm hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                {activePanel === 'users' ? 'Tài khoản' : 'Tạo vai trò'}
              </button>
            </div>

            <div className="mb-5 inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
              <button
                onClick={() => setActivePanel('users')}
                className={`inline-flex h-9 items-center gap-2 rounded-md px-4 text-sm ${
                  activePanel === 'users' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Users className="h-4 w-4" />
                Tài khoản
              </button>
              <button
                onClick={() => setActivePanel('roles')}
                className={`inline-flex h-9 items-center gap-2 rounded-md px-4 text-sm ${
                  activePanel === 'roles' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                Vai trò
              </button>
            </div>

            {activePanel === 'users' && (
              <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <table className="w-full min-w-[1100px] text-sm">
              <thead>
                <tr className="bg-gray-100 text-left text-xs text-gray-500">
                  <th className="rounded-l-lg px-4 py-3">Tài khoản</th>
                  <th className="px-4 py-3">Mã NV</th>
                  <th className="px-4 py-3">Chi nhánh</th>
                  <th className="px-4 py-3">Vai trò</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="rounded-r-lg px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          <Users className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-950">{user.displayName}</div>
                          <div className="text-xs text-gray-500">@{user.username.toLowerCase()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-900">{user.employeeCode}</td>
                    <td className="max-w-[250px] px-4 py-4 text-gray-900">
                      <div className="truncate">{getBranchNames(user.branchIds)}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs ${
                        user.roleId === 'owner' || user.roleId === 'manager'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {getRoleName(roles, user.roleId)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className="inline-flex items-center gap-2 text-sm text-gray-900"
                      >
                        <span className={`flex h-6 w-11 items-center rounded-full p-0.5 transition-colors ${
                          user.status === 'Đang hoạt động' ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'
                        }`}>
                          <span className="h-5 w-5 rounded-full bg-white shadow-sm" />
                        </span>
                        {user.status}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openPermissionEditor(user)}
                          className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-300 px-3 text-sm text-gray-800 hover:bg-gray-50"
                        >
                          <KeyRound className="h-4 w-4" />
                          Phân quyền
                        </button>
                        <button
                          onClick={() => openEditUser(user)}
                          className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-300 px-3 text-sm text-gray-800 hover:bg-gray-50"
                        >
                          <Edit3 className="h-4 w-4" />
                          Sửa
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="inline-flex h-9 items-center gap-2 rounded-lg border border-pink-500 px-3 text-sm text-pink-600 hover:bg-pink-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
              </section>
            )}

            {activePanel === 'roles' && (
              <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <table className="w-full min-w-[1100px] text-sm">
                  <thead>
                    <tr className="bg-gray-100 text-left text-xs text-gray-500">
                      <th className="rounded-l-lg px-4 py-3">Vai trò</th>
                      <th className="px-4 py-3">Mô tả</th>
                      <th className="px-4 py-3">Số quyền</th>
                      <th className="px-4 py-3">Người dùng</th>
                      <th className="px-4 py-3">Loại vai trò</th>
                      <th className="rounded-r-lg px-4 py-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map((role) => {
                      const usersCount = roleUsage[role.id] || 0;
                      const canDelete = !role.system && usersCount === 0;
                      return (
                        <tr key={role.id} className="border-b border-gray-50 last:border-0">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                <ShieldCheck className="h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="truncate text-sm text-gray-950">{role.name}</div>
                                <div className="text-xs text-gray-500">Mã: {role.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="max-w-[420px] px-4 py-4 text-gray-600">
                            <div className="line-clamp-2">{role.description}</div>
                          </td>
                          <td className="px-4 py-4 text-gray-900">
                            {countPermissions(role.permissions)} quyền
                          </td>
                          <td className="px-4 py-4">
                            <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                              {usersCount} người dùng
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex rounded-full px-3 py-1 text-xs ${
                              role.system ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {role.system ? 'Hệ thống' : 'Tùy chỉnh'}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => openEditRole(role)}
                                className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-300 px-3 text-sm text-gray-800 hover:bg-gray-50"
                              >
                                <Edit3 className="h-4 w-4" />
                                Sửa quyền
                              </button>
                              <button
                                onClick={() => openCopyRole(role)}
                                className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-300 px-3 text-sm text-gray-800 hover:bg-gray-50"
                              >
                                <Copy className="h-4 w-4" />
                                Sao chép
                              </button>
                              <button
                                onClick={() => deleteRole(role.id)}
                                disabled={!canDelete}
                                className="inline-flex h-9 items-center gap-2 rounded-lg border border-pink-500 px-3 text-sm text-pink-600 hover:bg-pink-50 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-300 disabled:hover:bg-white"
                                title={role.system ? 'Không thể xóa vai trò hệ thống' : usersCount > 0 ? 'Không thể xóa vai trò đang có người dùng' : 'Xóa vai trò'}
                              >
                                <Trash2 className="h-4 w-4" />
                                Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </section>
            )}
          </>
        )}
      </main>

      <UserAccountDialog
        open={userDialogMode !== null}
        mode={userDialogMode}
        draft={userDraft}
        roles={roles}
        onDraftChange={setUserDraft}
        onClose={() => setUserDialogMode(null)}
        onSave={saveUser}
      />

      <PermissionDialog
        open={permissionUser !== null}
        user={permissionUser}
        roles={roles}
        tab={permissionTab}
        branchId={permissionBranchId}
        roleId={permissionRoleId}
        permissionIds={permissionIds}
        extraAccess={extraAccess}
        accessMode={permissionAccessMode}
        scheduleDays={permissionScheduleDays}
        scheduleFrom={permissionScheduleFrom}
        scheduleTo={permissionScheduleTo}
        onTabChange={setPermissionTab}
        onBranchChange={changePermissionBranch}
        onRoleChange={changePermissionRole}
        onPermissionIdsChange={setPermissionIds}
        onExtraAccessChange={setExtraAccess}
        onAccessModeChange={setPermissionAccessMode}
        onScheduleDaysChange={setPermissionScheduleDays}
        onScheduleFromChange={setPermissionScheduleFrom}
        onScheduleToChange={setPermissionScheduleTo}
        onClose={() => setPermissionUser(null)}
        onSave={savePermissions}
      />

      <RoleDialog
        open={roleDialogMode !== null}
        mode={roleDialogMode}
        draft={roleDraft}
        onDraftChange={setRoleDraft}
        onClose={() => setRoleDialogMode(null)}
        onSave={saveRole}
      />
    </div>
  );
}

function SystemSettingsScreen({ onOpenUserManagement }: { onOpenUserManagement: () => void }) {
  const menuItems = [
    { icon: UserCog, label: 'Hồ sơ cá nhân', active: true },
    { icon: Bell, label: 'Thông báo' },
    { icon: ShieldCheck, label: 'Bảo mật' },
    { icon: Building2, label: 'Hệ thống' },
    { icon: Database, label: 'Dữ liệu' },
    { icon: MessageSquare, label: 'Cấu hình Chatbot' },
    { icon: MessageSquare, label: 'Cấu hình Pancake' },
    { icon: Bot, label: 'Cấu hình AI' },
    { icon: BadgeCheck, label: 'Cấu hình KiotViet' },
    { icon: Database, label: 'Đồng bộ tin nhắn' },
    { icon: ShieldCheck, label: 'MCP / AI Access' },
    { icon: CalendarDays, label: 'Nhắc lịch hẹn' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[34px] leading-tight text-gray-950">Cài đặt hệ thống</h1>
        <p className="mt-2 text-base text-gray-500">Quản lý cấu hình và tùy chỉnh hệ thống</p>
      </div>

      <div className="grid grid-cols-[280px_minmax(0,1fr)] gap-7">
        <aside className="rounded-xl border border-gray-200 bg-white p-3 shadow-xl shadow-gray-200/60">
          <button
            onClick={onOpenUserManagement}
            className="mb-3 flex h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
          >
            <Users className="h-4 w-4" />
            <span>Quản lý người dùng</span>
          </button>
          <div className="mb-2 h-px bg-gray-200" />
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className={`flex h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm transition-colors ${
                    item.active
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="rounded-xl border border-gray-200 bg-white p-7 shadow-xl shadow-gray-200/60">
          <div className="border-b border-gray-200 pb-7">
            <h2 className="text-xl text-gray-950">Hồ sơ cá nhân</h2>
            <p className="mt-1 text-sm text-gray-500">Cập nhật thông tin tài khoản của bạn</p>
          </div>

          <div className="flex items-center gap-5 py-7">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <UserCog className="h-10 w-10" />
            </div>
            <div>
              <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-800 hover:bg-gray-50">
                <Upload className="h-4 w-4" />
                Tải lên ảnh mới
              </button>
              <div className="mt-2 text-xs text-gray-500">JPG, PNG. Tối đa 2MB</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ReadOnlyField label="Họ và tên" value="Quản lý Spa" />
            <ReadOnlyField label="Email" value="admin@spa.com" />
            <ReadOnlyField label="Số điện thoại" value="0901234567" />
            <label className="block rounded-xl bg-gray-100 px-4 py-3">
              <span className="block text-xs text-gray-500">Vai trò</span>
              <select className="mt-1 w-full border-0 bg-transparent p-0 text-sm text-gray-950 outline-none">
                <option>Quản lý</option>
                <option>Chủ cửa hàng</option>
              </select>
            </label>
          </div>

          <label className="mt-4 block rounded-xl bg-gray-100 px-4 py-3">
            <span className="block text-xs text-gray-500">Mô tả</span>
            <textarea
              className="mt-1 min-h-[92px] w-full resize-none border-0 bg-transparent p-0 text-sm text-gray-700 outline-none placeholder:text-gray-500"
              placeholder="Mô tả về bản thân..."
            />
          </label>

          <div className="mt-7 flex justify-end">
            <button className="h-11 rounded-xl bg-blue-600 px-6 text-sm text-white hover:bg-blue-700">
              Lưu thay đổi
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function SettingsNav({
  activePanel,
  onChange,
}: {
  activePanel: SettingsPanel;
  onChange: (panel: SettingsPanel) => void;
}) {
  return (
    <aside className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
      <div className="mb-3 px-2 py-2 text-sm text-gray-950">Cài đặt</div>
      <div className="space-y-5">
        <div>
          <div className="px-2 pb-2 text-xs text-gray-400">Tài khoản</div>
          <SettingsNavButton
            icon={UserCog}
            label="Hồ sơ cá nhân"
            active={activePanel === 'profile'}
            onClick={() => onChange('profile')}
          />
          <SettingsNavButton icon={KeyRound} label="Bảo mật" active={false} muted />
        </div>
        <div>
          <div className="px-2 pb-2 text-xs text-gray-400">Quản lý người dùng</div>
          <SettingsNavButton
            icon={Users}
            label="Tài khoản người dùng"
            active={activePanel === 'users'}
            onClick={() => onChange('users')}
          />
          <SettingsNavButton
            icon={ShieldCheck}
            label="Quản lý vai trò"
            active={activePanel === 'roles'}
            onClick={() => onChange('roles')}
          />
        </div>
        <div>
          <div className="px-2 pb-2 text-xs text-gray-400">Hệ thống</div>
          <SettingsNavButton icon={Building2} label="Chi nhánh" active={false} muted />
          <SettingsNavButton icon={FileText} label="Mẫu in" active={false} muted />
          <SettingsNavButton icon={BadgeCheck} label="Cấu hình KiotViet" active={false} muted />
        </div>
      </div>
    </aside>
  );
}

function SettingsNavButton({
  icon: Icon,
  label,
  active,
  muted,
  onClick,
}: {
  icon: typeof Users;
  label: string;
  active: boolean;
  muted?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={muted}
      className={`mb-1 flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm transition-colors ${
        active
          ? 'bg-blue-600 text-white'
          : muted
            ? 'cursor-not-allowed text-gray-400'
            : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      <Icon className="h-4 w-4" />
      <span className="truncate">{label}</span>
    </button>
  );
}

function ProfilePlaceholder() {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg text-gray-950">Hồ sơ cá nhân</h2>
      <p className="mt-1 text-sm text-gray-500">
        Khu vực này giữ bố cục hồ sơ cá nhân. Phần quản lý tài khoản và phân quyền nằm trong nhóm Quản lý người dùng.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <ReadOnlyField label="Họ và tên" value="Quản lý Spa" />
        <ReadOnlyField label="Email" value="admin@spa.com" />
        <ReadOnlyField label="Số điện thoại" value="0901234567" />
        <ReadOnlyField label="Vai trò" value="Chủ cửa hàng" />
      </div>
    </section>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  tone: 'blue' | 'green' | 'gray' | 'amber';
}) {
  const tones = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    gray: 'bg-gray-100 text-gray-700',
    amber: 'bg-amber-50 text-amber-700',
  };
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${tones[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-xl text-gray-950">{value}</div>
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-gray-100 px-4 py-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 text-sm text-gray-950">{value}</div>
    </div>
  );
}

function UserAccountDialog({
  open,
  mode,
  draft,
  roles,
  onDraftChange,
  onClose,
  onSave,
}: {
  open: boolean;
  mode: 'create' | 'edit' | 'copy' | null;
  draft: UserDraft;
  roles: RoleTemplate[];
  onDraftChange: (draft: UserDraft) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const title =
    mode === 'edit' ? 'Cập nhật người dùng' : mode === 'copy' ? 'Sao chép người dùng' : 'Thêm mới người dùng';
  const selectedRole = roles.find((role) => role.id === draft.roleId) || roles[0];

  const patchDraft = (patch: Partial<UserDraft>) => onDraftChange({ ...draft, ...patch });
  const toggleBranch = (branchId: string) => {
    const next = draft.branchIds.includes(branchId)
      ? draft.branchIds.filter((id) => id !== branchId)
      : [...draft.branchIds, branchId];
    patchDraft({ branchIds: next.length ? next : [branchId] });
  };
  const toggleDay = (dayId: string) => {
    const next = draft.scheduleDays.includes(dayId)
      ? draft.scheduleDays.filter((id) => id !== dayId)
      : [...draft.scheduleDays, dayId];
    patchDraft({ scheduleDays: next });
  };
  const setExtra = (key: keyof ExtraAccess, value: boolean) => {
    patchDraft({ extraAccess: { ...draft.extraAccess, [key]: value } });
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="gap-0 rounded-xl p-0 sm:max-w-[740px]">
        <DialogHeader className="px-7 pb-5 pt-6">
          <DialogTitle className="text-xl">{title}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 px-7 pb-6">
          <FormField
            label="Tên hiển thị"
            required
            placeholder="VD: KTV Minh Anh"
            value={draft.displayName}
            onChange={(value) => patchDraft({ displayName: value })}
          />
          <FormField
            label="Tên đăng nhập"
            required
            placeholder="VD: ktv01"
            value={draft.username}
            onChange={(value) => patchDraft({ username: value })}
          />
          <FormField
            label="Mật khẩu"
            required
            type="password"
            placeholder="Nhập mật khẩu đăng nhập"
            value={draft.password}
            onChange={(value) => patchDraft({ password: value })}
          />
          <label className="block">
            <span className="mb-1 block text-xs text-gray-500">Vai trò <span className="text-pink-500">*</span></span>
            <select
              value={draft.roleId}
              onChange={(event) => patchDraft({ roleId: event.target.value })}
              className="h-[62px] w-full rounded-xl border-0 bg-gray-100 px-4 text-sm text-gray-950 outline-none focus:ring-2 focus:ring-blue-500"
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-gray-500">Chi nhánh làm việc</span>
            <select
              value={draft.branchIds[0] || branches[0].id}
              onChange={(event) => patchDraft({ branchIds: [event.target.value] })}
              className="h-[62px] w-full rounded-xl border-0 bg-gray-100 px-4 text-sm text-gray-950 outline-none focus:ring-2 focus:ring-blue-500"
            >
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
            </select>
          </label>
          <FormField
            label="Số điện thoại"
            placeholder="VD: 0901234567"
            value={draft.phone}
            onChange={(value) => patchDraft({ phone: value })}
          />
          <FormField
            label="Email"
            placeholder="VD: nhanvien@spa.com"
            value={draft.email}
            onChange={(value) => patchDraft({ email: value })}
          />
          <FormField
            label="Mã nhân viên"
            placeholder="VD: NV000047"
            value={draft.employeeCode}
            onChange={(value) => patchDraft({ employeeCode: value })}
          />
        </div>

        <DialogFooter className="border-t border-gray-100 px-7 py-5">
          <button onClick={onClose} className="h-11 rounded-xl border border-gray-300 bg-white px-5 text-sm text-gray-700 hover:bg-gray-50">
            Bỏ qua
          </button>
          <button onClick={onSave} className="h-11 rounded-xl bg-blue-600 px-7 text-sm text-white hover:bg-blue-700">
            Lưu
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PermissionDialog({
  open,
  user,
  roles,
  tab,
  branchId,
  roleId,
  permissionIds,
  extraAccess,
  accessMode,
  scheduleDays,
  scheduleFrom,
  scheduleTo,
  onTabChange,
  onBranchChange,
  onRoleChange,
  onPermissionIdsChange,
  onExtraAccessChange,
  onAccessModeChange,
  onScheduleDaysChange,
  onScheduleFromChange,
  onScheduleToChange,
  onClose,
  onSave,
}: {
  open: boolean;
  user: UserAccount | null;
  roles: RoleTemplate[];
  tab: PermissionTab;
  branchId: string;
  roleId: string;
  permissionIds: string[];
  extraAccess: ExtraAccess;
  accessMode: AccessMode;
  scheduleDays: string[];
  scheduleFrom: string;
  scheduleTo: string;
  onTabChange: (tab: PermissionTab) => void;
  onBranchChange: (branchId: string) => void;
  onRoleChange: (roleId: string) => void;
  onPermissionIdsChange: (permissionIds: string[]) => void;
  onExtraAccessChange: (extraAccess: ExtraAccess) => void;
  onAccessModeChange: (accessMode: AccessMode) => void;
  onScheduleDaysChange: (days: string[]) => void;
  onScheduleFromChange: (value: string) => void;
  onScheduleToChange: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const [activeGroupId, setActiveGroupId] = useState(permissionCatalog[0]?.id || '');
  const permissionScrollRef = useRef<HTMLDivElement | null>(null);
  const userBranches = user?.branchIds.length ? user.branchIds : [branches[0].id];
  const togglePermission = (permissionId: string) => {
    const next = permissionIds.includes(permissionId)
      ? permissionIds.filter((id) => id !== permissionId)
      : [...permissionIds, permissionId];
    onPermissionIdsChange(next);
  };
  const toggleCategory = (category: PermissionCategory) => {
    const categoryIds = category.permissions.map((permission) => permission.id);
    const isAllSelected = categoryIds.every((id) => permissionIds.includes(id));
    if (isAllSelected) {
      onPermissionIdsChange(permissionIds.filter((id) => !categoryIds.includes(id)));
      return;
    }
    onPermissionIdsChange(Array.from(new Set([...permissionIds, ...categoryIds])));
  };
  const setExtra = (key: keyof ExtraAccess, value: boolean) => {
    onExtraAccessChange({ ...extraAccess, [key]: value });
  };
  const toggleScheduleDay = (dayId: string) => {
    const next = scheduleDays.includes(dayId)
      ? scheduleDays.filter((id) => id !== dayId)
      : [...scheduleDays, dayId];
    onScheduleDaysChange(next);
  };
  const focusPermissionGroup = (groupId: string) => {
    setActiveGroupId(groupId);
    requestAnimationFrame(() => {
      const container = permissionScrollRef.current;
      const target = document.getElementById(`permission-${groupId}`);
      if (!container || !target) return;

      const containerTop = container.getBoundingClientRect().top;
      const targetTop = target.getBoundingClientRect().top;
      container.scrollTo({
        top: container.scrollTop + targetTop - containerTop - 16,
        behavior: 'smooth',
      });
    });
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-hidden rounded-xl p-0 sm:max-w-[1280px]">
        <DialogHeader className="border-b border-gray-200 px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <UserCog className="h-5 w-5 text-blue-600" />
            Sửa phân quyền
          </DialogTitle>
        </DialogHeader>

        <div className="border-b border-gray-200 px-6">
          <div className="flex gap-6">
            <button
              onClick={() => onTabChange('role')}
              className={`border-b-2 py-3 text-sm ${
                tab === 'role' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'
              }`}
            >
              Phân quyền theo vai trò
            </button>
            <button
              onClick={() => onTabChange('other')}
              className={`border-b-2 py-3 text-sm ${
                tab === 'other' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'
              }`}
            >
              Phân quyền khác
            </button>
          </div>
        </div>

        <div ref={permissionScrollRef} className="max-h-[68vh] overflow-y-auto px-6 py-5">
          {tab === 'role' ? (
            <div className="grid grid-cols-[minmax(0,1fr)_220px] gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-[180px_220px_220px] items-end gap-3">
                  <ReadOnlyCompact label="Tên đăng nhập" value={user?.username || ''} />
                  <label className="block">
                    <span className="mb-1.5 block text-xs text-gray-500">Chi nhánh</span>
                    <select
                      value={branchId}
                      onChange={(event) => onBranchChange(event.target.value)}
                      className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800"
                    >
                      {userBranches.map((id) => {
                        const branch = branches.find((item) => item.id === id);
                        return <option key={id} value={id}>{branch?.name || id}</option>;
                      })}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs text-gray-500">Vai trò</span>
                    <select
                      value={roleId}
                      onChange={(event) => onRoleChange(event.target.value)}
                      className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800"
                    >
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                      ))}
                    </select>
                  </label>
                </div>

                {permissionCatalog.map((category) => {
                  const selectedCount = category.permissions.filter((permission) => permissionIds.includes(permission.id)).length;
                  const isAllSelected = selectedCount === category.permissions.length;
                  const isFocusedGroup = activeGroupId === category.id;
                  return (
                    <section
                      key={category.id}
                      id={`permission-${category.id}`}
                      className={`scroll-mt-4 rounded-xl border bg-white p-4 shadow-sm ${
                        isFocusedGroup ? 'border-blue-400' : 'border-gray-300'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleCategory(category)}
                        className="mb-3 flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-left"
                      >
                        <span className="flex items-center gap-3">
                          <span className={`flex h-5 w-5 items-center justify-center rounded border ${
                            isAllSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-transparent'
                          }`}>
                            <Check className="h-3.5 w-3.5" />
                          </span>
                          <span>
                            <span className="block text-sm text-gray-950">{category.title}</span>
                            <span className="block text-xs text-gray-500">{category.description}</span>
                          </span>
                        </span>
                        <span className="flex items-center gap-2 text-xs text-gray-500">
                          {selectedCount}/{category.permissions.length}
                          <ChevronDown className="h-4 w-4" />
                        </span>
                      </button>
                      <div className="grid grid-cols-2 gap-2">
                        {category.permissions.map((permission) => (
                          <PermissionCheckRow
                            key={permission.id}
                            checked={permissionIds.includes(permission.id)}
                            label={permission.label}
                            note={permission.note}
                            onChange={() => togglePermission(permission.id)}
                          />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>

              <aside className="sticky top-0 h-fit rounded-xl border border-gray-200 bg-white p-4">
                <div className="mb-3 text-sm text-blue-600">Nhóm quyền</div>
                <div className="space-y-1">
                  {permissionCatalog.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => focusPermissionGroup(category.id)}
                      className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
                        activeGroupId === category.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                      }`}
                    >
                      {category.title}
                    </button>
                  ))}
                </div>
              </aside>
            </div>
          ) : (
            <div className="max-w-[900px] space-y-7">
              <ReadOnlyCompact label="Tên đăng nhập" value={user?.username || ''} />
              <div className="space-y-3">
                <ToggleLine
                  checked={extraAccess.commonData}
                  label="Xem thông tin chung của hàng hóa, giao dịch, đối tác"
                  onChange={(checked) => setExtra('commonData', checked)}
                />
                <ToggleLine
                  checked={extraAccess.otherStaffReports}
                  label="Xem báo cáo cuối ngày và giao dịch tạo bởi nhân viên khác"
                  onChange={(checked) => setExtra('otherStaffReports', checked)}
                />
                <ToggleLine
                  checked={extraAccess.otherStaffTransactions}
                  label="Xem, chỉnh sửa giao dịch của nhân viên khác"
                  onChange={(checked) => setExtra('otherStaffTransactions', checked)}
                />
              </div>

              <div className="h-px bg-gray-200" />

              <section className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-base text-gray-950">Thời gian truy cập</div>
                      <div className="text-sm text-gray-500">Giới hạn nhân viên đăng nhập theo ca làm việc</div>
                    </div>
                  </div>
                  <button
                    onClick={() => onAccessModeChange(accessMode === 'fixed' ? 'all' : 'fixed')}
                    className={`flex h-8 w-14 items-center rounded-full p-1 transition-colors ${
                      accessMode === 'fixed' ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'
                    }`}
                  >
                    <span className="h-6 w-6 rounded-full bg-white shadow-sm" />
                  </button>
                </div>
                {accessMode === 'fixed' && (
                  <div className="mt-5 space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {weekDays.map((day) => (
                        <button
                          key={day.id}
                          onClick={() => toggleScheduleDay(day.id)}
                          className={`h-9 rounded-lg border px-3 text-sm ${
                            scheduleDays.includes(day.id)
                              ? 'border-blue-600 bg-blue-600 text-white'
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <FormField label="Từ giờ" type="time" value={scheduleFrom} onChange={onScheduleFromChange} />
                      <FormField label="Đến giờ" type="time" value={scheduleTo} onChange={onScheduleToChange} />
                    </div>
                  </div>
                )}
              </section>
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-gray-200 px-6 py-4">
          <button onClick={onClose} className="h-10 rounded-lg bg-gray-100 px-4 text-sm text-gray-700 hover:bg-gray-200">
            Bỏ qua
          </button>
          <button onClick={onSave} className="h-10 rounded-lg bg-blue-600 px-5 text-sm text-white hover:bg-blue-700">
            Lưu
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RoleDialog({
  open,
  mode,
  draft,
  onDraftChange,
  onClose,
  onSave,
}: {
  open: boolean;
  mode: 'create' | 'edit' | 'copy' | null;
  draft: RoleDraft;
  onDraftChange: (draft: RoleDraft) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const [activeGroupId, setActiveGroupId] = useState(permissionCatalog[0]?.id || '');
  const roleScrollRef = useRef<HTMLDivElement | null>(null);
  const title = mode === 'edit' ? 'Sửa vai trò' : mode === 'copy' ? 'Sao chép vai trò' : 'Tạo vai trò';
  const togglePermission = (permissionId: string) => {
    const next = draft.permissions.includes(permissionId)
      ? draft.permissions.filter((id) => id !== permissionId)
      : [...draft.permissions, permissionId];
    onDraftChange({ ...draft, permissions: next });
  };
  const toggleCategory = (category: PermissionCategory) => {
    const categoryIds = category.permissions.map((permission) => permission.id);
    const isAllSelected = categoryIds.every((id) => draft.permissions.includes(id));
    const next = isAllSelected
      ? draft.permissions.filter((id) => !categoryIds.includes(id))
      : Array.from(new Set([...draft.permissions, ...categoryIds]));
    onDraftChange({ ...draft, permissions: next });
  };
  const focusPermissionGroup = (groupId: string) => {
    setActiveGroupId(groupId);
    requestAnimationFrame(() => {
      const container = roleScrollRef.current;
      const target = document.getElementById(`role-permission-${groupId}`);
      if (!container || !target) return;

      const containerTop = container.getBoundingClientRect().top;
      const targetTop = target.getBoundingClientRect().top;
      container.scrollTo({
        top: container.scrollTop + targetTop - containerTop - 16,
        behavior: 'smooth',
      });
    });
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[90vh] gap-0 overflow-hidden rounded-xl p-0 sm:max-w-[1280px]">
        <DialogHeader className="px-7 py-6">
          <DialogTitle className="text-xl">{title}</DialogTitle>
        </DialogHeader>

        <div ref={roleScrollRef} className="grid max-h-[calc(90vh-150px)] grid-cols-[minmax(0,1fr)_280px] gap-5 overflow-y-auto px-7 pb-6">
          <div className="min-w-0">
            <div className="mb-5 grid grid-cols-2 gap-5">
              <FormField
                label="Tên vai trò"
                required
                placeholder="VD: KTV mới"
                value={draft.name}
                onChange={(value) => onDraftChange({ ...draft, name: value })}
              />
              <label className="block">
                <span className="mb-1 block text-xs text-gray-500">Mô tả</span>
                <textarea
                  value={draft.description}
                  onChange={(event) => onDraftChange({ ...draft, description: event.target.value })}
                  className="h-[126px] w-full resize-none rounded-xl border-0 bg-gray-100 px-4 py-4 text-sm text-gray-950 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mô tả phạm vi quyền và trách nhiệm của vai trò..."
                />
              </label>
            </div>

            <div className="space-y-5">
              {permissionCatalog.map((category) => {
                const selectedCount = category.permissions.filter((permission) => draft.permissions.includes(permission.id)).length;
                const isAllSelected = selectedCount === category.permissions.length;
                const isFocusedGroup = activeGroupId === category.id;
                return (
                  <section
                    key={category.id}
                    id={`role-permission-${category.id}`}
                    className={`scroll-mt-4 rounded-xl border p-5 shadow-sm ${
                      isFocusedGroup || isAllSelected ? 'border-blue-400 bg-blue-50/20' : 'border-gray-300 bg-white'
                    }`}
                  >
                    <button type="button" onClick={() => toggleCategory(category)} className="mb-4 flex w-full items-center justify-between text-left">
                      <span className="flex items-center gap-3">
                        <CheckBoxMark checked={isAllSelected} size="lg" />
                        <span>
                          <span className="block text-lg text-gray-950">{category.title}</span>
                          <span className="block text-xs text-gray-500">{selectedCount}/{category.permissions.length} quyền được bật</span>
                        </span>
                      </span>
                      <ChevronDown className="h-4 w-4 text-gray-700" />
                    </button>

                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <div className="grid grid-cols-2 gap-3">
                        {category.permissions.map((permission) => (
                          <PermissionCheckRow
                            key={permission.id}
                            checked={draft.permissions.includes(permission.id)}
                            label={permission.label}
                            onChange={() => togglePermission(permission.id)}
                          />
                        ))}
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>
          </div>

          <aside className="sticky top-0 h-fit rounded-xl border border-gray-200 bg-white p-4">
            <div className="space-y-1">
              {permissionCatalog.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => focusPermissionGroup(category.id)}
                  className={`block w-full rounded-lg px-4 py-3 text-left text-sm ${
                    activeGroupId === category.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  {category.title}
                </button>
              ))}
            </div>
          </aside>
        </div>

        <DialogFooter className="border-t border-gray-100 px-7 py-5">
          <button onClick={onClose} className="h-11 rounded-xl border border-gray-300 bg-white px-5 text-sm text-gray-700 hover:bg-gray-50">
            Bỏ qua
          </button>
          <button onClick={onSave} className="h-11 rounded-xl bg-blue-600 px-7 text-sm text-white hover:bg-blue-700">
            Lưu
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = 'text',
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-gray-500">
        {label} {required && <span className="text-pink-500">*</span>}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-[62px] w-full rounded-xl border-0 bg-gray-100 px-4 text-sm text-gray-950 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
      />
    </label>
  );
}

function CheckBoxMark({ checked, size = 'sm' }: { checked: boolean; size?: 'sm' | 'lg' }) {
  const sizeClass = size === 'lg' ? 'h-6 w-6 rounded-lg' : 'h-4 w-4 rounded';
  return (
    <span className={`flex shrink-0 items-center justify-center border ${
      sizeClass
    } ${checked ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-transparent'}`}>
      <Check className={size === 'lg' ? 'h-4 w-4' : 'h-3 w-3'} />
    </span>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-gray-500">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 placeholder:text-gray-400"
      />
    </label>
  );
}

function ReadOnlyCompact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-1.5 text-xs text-gray-500">{label}</div>
      <div className="flex h-10 items-center rounded-lg border border-gray-300 bg-gray-100 px-3 text-sm text-gray-700">
        {value}
      </div>
    </div>
  );
}

function ToggleLine({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-sm text-gray-700">
      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
        checked ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-400 bg-white text-transparent'
      }`}>
        <Check className="h-3.5 w-3.5" />
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
      />
      <span>{label}</span>
    </label>
  );
}

function PermissionCheckRow({
  checked,
  label,
  note,
  onChange,
}: {
  checked: boolean;
  label: string;
  note?: string;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onChange();
      }}
      className={`flex min-h-[42px] w-full cursor-pointer items-start gap-2 rounded-lg border px-3 py-2 text-left text-sm text-gray-700 transition-colors ${
      checked ? 'border-blue-200 bg-blue-50/30 hover:bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
    }`}
    >
      <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
        checked ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-transparent'
      }`}>
        <Check className="h-3 w-3" />
      </span>
      <span className="min-w-0">
        <span className="block">{label}</span>
        {note && <span className="block text-xs text-gray-400">{note}</span>}
      </span>
    </button>
  );
}

function PermissionStaticRow({ checked, label }: { checked: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-600">
      <span className={`flex h-4 w-4 items-center justify-center rounded border ${
        checked ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200 bg-white text-transparent'
      }`}>
        <Check className="h-3 w-3" />
      </span>
      <span>{label}</span>
    </div>
  );
}
