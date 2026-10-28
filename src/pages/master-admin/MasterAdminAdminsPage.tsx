import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { adminStorage } from '../../services/adminStorage';
import { AdminAccount } from '../../types';
import {
  UserCheck,
  Shield,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Key,
  Lock,
  Mail,
  User,
  X,
  AlertTriangle,
  Crown,
} from 'lucide-react';

export const MasterAdminAdminsPage: React.FC = () => {
  const { language } = useLanguage();
  const [admins, setAdmins] = useState<AdminAccount[]>(() =>
    adminStorage.getAdminAccounts()
  );
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Invite form state
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<AdminAccount['role']>('admin');
  const [permissions, setPermissions] = useState<string[]>([
    'manage_users',
    'moderate_content',
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleTogglePermission = (perm: string) => {
    setPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    adminStorage.inviteAdminAccount(
      {
        name: inviteName.trim(),
        email: inviteEmail.trim(),
        role: inviteRole,
        adminTitle: inviteRole === 'master-admin' ? 'Executive Master Admin' : 'Operations Specialist',
        permissions,
      },
      'Master Admin',
      'master-admin'
    );

    setAdmins(adminStorage.getAdminAccounts());
    setIsInviteModalOpen(false);
    showToast(`Invitation dispatched to ${inviteEmail.trim()}`);

    // Reset
    setInviteName('');
    setInviteEmail('');
    setPermissions(['manage_users', 'moderate_content']);
  };

  const handleToggleStatus = (admin: AdminAccount) => {
    if (admin.role === 'master-admin' && admins.filter((a) => a.role === 'master-admin').length <= 1) {
      showToast('Cannot deactivate the sole Master Admin account');
      return;
    }

    const isCurrentlyActive = admin.status.toLowerCase() === 'active';
    const newStatus: 'Active' | 'Inactive' = isCurrentlyActive ? 'Inactive' : 'Active';
    adminStorage.addAuditLog({
      actorName: 'Master Admin',
      actorRole: 'master-admin',
      action: 'UPDATE_ADMIN_STATUS',
      target: admin.email,
      details: `Operator account status changed to ${newStatus}`,
      status: 'SUCCESS',
      severity: 'warning',
    });

    setAdmins((prev) =>
      prev.map((a) => (a.id === admin.id ? { ...a, status: newStatus } : a))
    );
    showToast(`Operator ${admin.name} is now ${newStatus}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20 space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-amber-50 text-amber-600">
              <UserCheck className="w-5 h-5 text-amber-600" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {language === 'en' ? 'Admin Accounts & RBAC Permissions' : 'एडमिन प्रबंधन और अनुमतियाँ'}
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-amber-100 text-amber-800 border border-amber-200">
              Security & RBAC
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {language === 'en'
              ? 'Provision administrative operators, grant least-privilege permissions, and inspect authentication status.'
              : 'प्रशासनिक ऑपरेटरों को आमंत्रित करें और रोल-आधारित अनुमतियाँ निर्धारित करें।'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Invite Operator</span>
          </button>
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="p-3 pl-4">Staff Member</th>
                <th className="p-3">Assigned Role</th>
                <th className="p-3">Granular Capabilities</th>
                <th className="p-3">Last Active</th>
                <th className="p-3">Status</th>
                <th className="p-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {admins.map((adm) => (
                <tr key={adm.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3 pl-4 font-semibold text-slate-900">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                        {adm.name[0]}
                      </div>
                      <div>
                        <div>{adm.name}</div>
                        <div className="text-[11px] text-slate-400 font-normal">{adm.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        adm.role === 'master-admin'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {adm.role === 'master-admin' && <Crown className="w-3 h-3 fill-amber-600" />}
                      <span>{adm.role.replace('-', ' ')}</span>
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1 max-w-sm">
                      {adm.permissions.map((p, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium font-mono"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3 font-mono text-slate-500 text-[11px]">{adm.lastLogin}</td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        adm.status.toLowerCase() === 'active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          adm.status.toLowerCase() === 'active' ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                      />
                      <span className="capitalize">{adm.status}</span>
                    </span>
                  </td>
                  <td className="p-3 pr-4 text-right">
                    {adm.role !== 'master-admin' ? (
                      <button
                        onClick={() => handleToggleStatus(adm)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          adm.status.toLowerCase() === 'active'
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {adm.status.toLowerCase() === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Protected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Invite Administrative Staff</h3>
                  <span className="text-xs text-slate-500">
                    Send secure invite link with designated permissions
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Rathore"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Work Email *</label>
                <input
                  type="email"
                  required
                  placeholder="vikram@scripter.ai"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Role Assignment</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium"
                >
                  <option value="admin">Operations Admin</option>
                  <option value="master-admin">Master Admin (Executive)</option>
                </select>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block font-semibold text-slate-700">
                  Granted Capabilities (Least Privilege)
                </label>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  {[
                    { id: 'manage_users', label: 'Manage Creators' },
                    { id: 'moderate_content', label: 'Content Moderation' },
                    { id: 'manage_templates', label: 'Template Library' },
                    { id: 'manage_plans', label: 'Plans & Credit Rules' },
                    { id: 'view_billing', label: 'Billing Oversight' },
                    { id: 'system_config', label: 'System Configuration' },
                  ].map((perm) => (
                    <label key={perm.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={permissions.includes(perm.id)}
                        onChange={() => handleTogglePermission(perm.id)}
                        className="w-4 h-4 text-blue-600 rounded-sm"
                      />
                      <span className="text-slate-700">{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
