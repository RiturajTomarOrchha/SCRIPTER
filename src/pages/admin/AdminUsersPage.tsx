import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useRole } from '../../context/RoleContext';
import {
  getAdminUsers,
  updateAdminUserStatus,
  adjustUserCredits,
  changeUserPlan,
  changeUserRole,
} from '../../services/adminStorage';
import { AdminUserRecord, PlanTier, UserRole } from '../../types';
import {
  Users,
  Search,
  Filter,
  Shield,
  Crown,
  Sparkles,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Clock,
  X,
  Plus,
  Minus,
  Edit3,
  Ban,
  UserCheck,
  Check,
  Briefcase,
  FolderKanban,
  FileText,
  Mail,
  Phone,
  ShieldAlert,
  Sliders,
  ExternalLink,
} from 'lucide-react';

interface AdminUsersPageProps {
  isMasterAdmin?: boolean;
}

export const AdminUsersPage: React.FC<AdminUsersPageProps> = ({ isMasterAdmin = false }) => {
  const { language } = useLanguage();
  const { role, userProfile } = useRole();
  const navigate = useNavigate();

  const [users, setUsers] = useState<AdminUserRecord[]>(() => getAdminUsers());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlanFilter, setSelectedPlanFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  // Modals & Drawers state
  const [selectedUserForDrawer, setSelectedUserForDrawer] = useState<AdminUserRecord | null>(null);
  const [creditModalUser, setCreditModalUser] = useState<AdminUserRecord | null>(null);
  const [creditAmount, setCreditAmount] = useState<number>(500);
  const [creditOperation, setCreditOperation] = useState<'add' | 'deduct'>('add');
  const [creditReason, setCreditReason] = useState<string>('Support goodwill / webinar promotional credits');

  const [statusModalUser, setStatusModalUser] = useState<AdminUserRecord | null>(null);
  const [newStatus, setNewStatus] = useState<'Active' | 'Suspended' | 'Banned'>('Suspended');
  const [statusReason, setStatusReason] = useState<string>('Terms of Service compliance review');

  const [planModalUser, setPlanModalUser] = useState<AdminUserRecord | null>(null);
  const [targetPlan, setTargetPlan] = useState<PlanTier>('pro');
  const [planReason, setPlanReason] = useState<string>('Enterprise upgrade requested by customer');

  const [roleModalUser, setRoleModalUser] = useState<AdminUserRecord | null>(null);
  const [targetRole, setTargetRole] = useState<UserRole>('admin');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const refreshUsersList = () => {
    setUsers(getAdminUsers());
  };

  // Filtered users calculation
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.phone && u.phone.includes(searchQuery)) ||
        (u.industry && u.industry.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesPlan = selectedPlanFilter === 'all' || u.plan.toLowerCase() === selectedPlanFilter.toLowerCase();
      const matchesStatus = selectedStatusFilter === 'all' || u.status.toLowerCase() === selectedStatusFilter.toLowerCase();

      return matchesSearch && matchesPlan && matchesStatus;
    });
  }, [users, searchQuery, selectedPlanFilter, selectedStatusFilter]);

  // Handle Credit Adjustment Submit
  const handleCreditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!creditModalUser) return;

    adjustUserCredits(
      creditModalUser.id,
      creditAmount,
      creditOperation,
      creditReason,
      userProfile.name || 'Admin Operator',
      role
    );

    refreshUsersList();
    showToast(
      language === 'en'
        ? `Successfully adjusted ${creditOperation === 'add' ? '+' : '-'}${creditAmount} credits for ${creditModalUser.name}`
        : `${creditModalUser.name} के लिए ${creditAmount} क्रेडिट समायोजित किए गए`
    );
    setCreditModalUser(null);
  };

  // Handle Status Update Submit
  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusModalUser) return;

    updateAdminUserStatus(
      statusModalUser.id,
      newStatus,
      statusReason,
      userProfile.name || 'Admin Operator',
      role
    );

    refreshUsersList();
    showToast(
      language === 'en'
        ? `User account status updated to ${newStatus}`
        : `खाता स्थिति ${newStatus} में बदली गई`
    );
    setStatusModalUser(null);
  };

  // Handle Plan Change Submit
  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planModalUser) return;

    changeUserPlan(
      planModalUser.id,
      targetPlan,
      planReason,
      userProfile.name || 'Admin Operator',
      role
    );

    refreshUsersList();
    showToast(language === 'en' ? `User tier changed to ${targetPlan} Plan` : `प्लान ${targetPlan} में बदला गया`);
    setPlanModalUser(null);
  };

  // Handle Role Change (Master Admin only)
  const handleRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleModalUser) return;

    const res = changeUserRole(
      roleModalUser.id,
      targetRole,
      userProfile.name || 'Master Admin',
      role
    );

    if (res.success) {
      refreshUsersList();
      showToast(language === 'en' ? `Role assigned: ${targetRole}` : `रोल असाइन किया गया: ${targetRole}`);
      setRoleModalUser(null);
    } else {
      showToast(res.error || 'Failed to update role');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20 space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#0B132B] text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-slate-700 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-blue-50 text-blue-600">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {language === 'en' ? 'User & Creator Management' : 'उपयोगकर्ता और क्रिएटर प्रबंधन'}
            </h1>
            <span
              className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-md uppercase tracking-wider ${
                isMasterAdmin ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-blue-100 text-blue-900'
              }`}
            >
              {isMasterAdmin ? 'Master Admin Governance' : 'Operations Console'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {language === 'en'
              ? 'Inspect creator accounts, adjust AI balances, review business profiles, and manage subscription statuses.'
              : 'क्रिएटर खातों का निरीक्षण करें, AI क्रेडिट संतुलित करें, और सब्सक्रिप्शन स्थिति प्रबंधित करें।'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">
            Total Creators: <strong className="text-slate-900">{users.length}</strong>
          </span>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'en'
                ? 'Search by name, email, phone, or industry...'
                : 'नाम, ईमेल, फोन या इंडस्ट्री से खोजें...'
            }
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Plan:</span>
            <select
              value={selectedPlanFilter}
              onChange={(e) => setSelectedPlanFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
            >
              <option value="all">All Plans</option>
              <option value="free">Free</option>
              <option value="pro">Pro</option>
              <option value="business">Business</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Status:</span>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Creator / Account</th>
                <th className="py-3 px-4">Plan & Status</th>
                <th className="py-3 px-4">AI Credits</th>
                <th className="py-3 px-4">Profiles & Projects</th>
                <th className="py-3 px-4">Activity</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No creators match the active query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((usr) => (
                  <tr key={usr.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* User info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center shrink-0 shadow-xs">
                          {usr.avatarUrl ? (
                            <img src={usr.avatarUrl} alt={usr.name} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <span>{usr.name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900">{usr.name}</span>
                            {usr.role === 'master-admin' && (
                              <span title="Master Admin">
                                <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              </span>
                            )}
                            {usr.role === 'admin' && (
                              <span title="Operations Admin">
                                <Shield className="w-3.5 h-3.5 text-blue-600" />
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">{usr.email}</div>
                          {usr.industry && (
                            <div className="text-[10px] text-slate-400 mt-0.5">{usr.industry}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Plan & Status */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            usr.plan === 'business'
                              ? 'bg-purple-100 text-purple-800'
                              : usr.plan === 'pro'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {usr.plan === 'business' ? 'Business' : usr.plan === 'pro' ? 'Pro' : 'Free'} Plan
                        </span>
                        <div>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              usr.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : usr.status === 'Suspended'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {usr.status === 'Active' ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <AlertCircle className="w-3 h-3 text-rose-600" />
                            )}
                            <span>{usr.status}</span>
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Credits */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono">
                        <span className="font-bold text-slate-900">{usr.creditsTotal - usr.creditsUsed}</span>
                        <span className="text-slate-400 text-[10px]"> / {usr.creditsTotal}</span>
                      </div>
                      <div className="w-24 bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full"
                          style={{
                            width: `${Math.min(100, Math.round((usr.creditsUsed / Math.max(1, usr.creditsTotal)) * 100))}%`,
                          }}
                        />
                      </div>
                    </td>

                    {/* Profiles & Projects */}
                    <td className="py-3.5 px-4 text-slate-600">
                      <div>
                        <span className="font-bold text-slate-900">{usr.businessProfilesCount}</span> Profiles
                      </div>
                      <div className="text-[11px] text-slate-400">
                        <span className="font-bold text-slate-800">{usr.projectsCount}</span> Projects
                      </div>
                    </td>

                    {/* Activity */}
                    <td className="py-3.5 px-4 text-slate-500">
                      <div className="text-slate-800 font-medium">{usr.lastActive}</div>
                      <div className="text-[10px] text-slate-400">Joined {usr.joinedDate}</div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setSelectedUserForDrawer(usr)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors text-[11px]"
                          title="View Details"
                        >
                          Dossier
                        </button>

                        <button
                          onClick={() => setCreditModalUser(usr)}
                          className="p-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Adjust Credits"
                        >
                          <Sparkles className="w-4 h-4 text-blue-600" />
                        </button>

                        <button
                          onClick={() => setPlanModalUser(usr)}
                          className="p-1 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Change Plan Tier"
                        >
                          <Crown className="w-4 h-4 text-amber-500" />
                        </button>

                        <button
                          onClick={() => setStatusModalUser(usr)}
                          className="p-1 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Update Status / Ban"
                        >
                          <Ban className="w-4 h-4 text-rose-500" />
                        </button>

                        {isMasterAdmin && (
                          <button
                            onClick={() => setRoleModalUser(usr)}
                            className="p-1 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Assign RBAC Role"
                          >
                            <UserCheck className="w-4 h-4 text-purple-600" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Dossier Drawer Modal */}
      {selectedUserForDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedUserForDrawer(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-bold flex items-center justify-center text-lg">
                {selectedUserForDrawer.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedUserForDrawer.name}</h3>
                <p className="text-xs text-slate-500">{selectedUserForDrawer.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    {selectedUserForDrawer.plan} Plan
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {selectedUserForDrawer.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Joined Date</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{selectedUserForDrawer.joinedDate}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Last Active</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{selectedUserForDrawer.lastActive}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Credits Total</span>
                  <span className="font-bold text-blue-600 mt-0.5 block font-mono">{selectedUserForDrawer.creditsTotal}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Credits Consumed</span>
                  <span className="font-bold text-slate-800 mt-0.5 block font-mono">{selectedUserForDrawer.creditsUsed}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Creator Industry & Focus</span>
                <span className="font-medium text-slate-800 block">{selectedUserForDrawer.industry || 'General Creator'}</span>
              </div>

              {selectedUserForDrawer.notes && (
                <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block">Admin Notes</span>
                  <p className="text-slate-700 leading-relaxed">{selectedUserForDrawer.notes}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedUserForDrawer(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Credits Modal */}
      {creditModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setCreditModalUser(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>Adjust AI Credits</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Modifying credits for <strong>{creditModalUser.name}</strong> ({creditModalUser.email}).
            </p>

            <form onSubmit={handleCreditSubmit} className="space-y-3.5 text-xs">
              <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setCreditOperation('add')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    creditOperation === 'add' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  + Grant Credits
                </button>
                <button
                  type="button"
                  onClick={() => setCreditOperation('deduct')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    creditOperation === 'deduct' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  - Deduct Credits
                </button>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Amount of Credits</label>
                <input
                  type="number"
                  min={10}
                  max={50000}
                  step={10}
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(parseInt(e.target.value) || 0)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Audit Log Reason (Required)</label>
                <textarea
                  value={creditReason}
                  onChange={(e) => setCreditReason(e.target.value)}
                  rows={2}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreditModalUser(null)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Confirm Credit Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Account Status / Ban Modal */}
      {statusModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setStatusModalUser(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <span>Update Account Status</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Updating authorization for <strong>{statusModalUser.name}</strong>.
            </p>

            <form onSubmit={handleStatusSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Select New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                >
                  <option value="Active">Active (Full Creator Access)</option>
                  <option value="Suspended">Suspended (Temporary Freeze)</option>
                  <option value="Banned">Banned (Permanent Revocation)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Administrative Reason</label>
                <textarea
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  rows={2}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setStatusModalUser(null)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Save Account Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Plan Modal */}
      {planModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setPlanModalUser(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" />
              <span>Modify Plan Tier</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Current Tier: <strong>{planModalUser.plan} Plan</strong> for {planModalUser.name}.
            </p>

            <form onSubmit={handlePlanSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Target Subscription Tier</label>
                <select
                  value={targetPlan}
                  onChange={(e) => setTargetPlan(e.target.value as PlanTier)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                >
                  <option value="free">Free (100 credits/mo, 2 profiles)</option>
                  <option value="pro">Pro (1,000 credits/mo, 5 profiles, HD Export)</option>
                  <option value="business">Business (5,000 credits/mo, 20 profiles, Team)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Reason for Administrative Override</label>
                <textarea
                  value={planReason}
                  onChange={(e) => setPlanReason(e.target.value)}
                  rows={2}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPlanModalUser(null)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-xs"
                >
                  Update Subscription Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Role Assignment Modal (Master Admin Only) */}
      {roleModalUser && isMasterAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setRoleModalUser(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-purple-600" />
              <span>Assign Administrative Role</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Configure RBAC permissions for <strong>{roleModalUser.name}</strong>.
            </p>

            <form onSubmit={handleRoleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">System Role</label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                >
                  <option value="user">Standard Creator User</option>
                  <option value="admin">Operations Admin (Workspaces & Tickets)</option>
                  <option value="master-admin">Master Admin (Executive Governance)</option>
                </select>
              </div>

              <div className="p-3 bg-purple-50 text-purple-900 rounded-xl border border-purple-200 leading-relaxed text-[11px]">
                <ShieldAlert className="w-4 h-4 text-purple-600 inline mr-1 -mt-0.5" />
                <span>Privilege changes are immutably logged to the security audit trail with your Master Admin signature.</span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRoleModalUser(null)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Save Role Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
