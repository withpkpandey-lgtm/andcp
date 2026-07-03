import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  Users, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  X, 
  Search, 
  LogOut, 
  ShieldAlert,
  UserCheck,
  UserX,
  FileCheck,
  Camera,
  Video
} from 'lucide-react';
import { StudentProfile } from '../types';
import VideoLecturesView from './VideoLecturesView';

interface AdminPanelProps {
  profiles: StudentProfile[];
  onApproveStudent: (profileId: string) => void;
  onRejectStudent: (profileId: string) => void;
  onDeleteStudent: (profileId: string) => void;
  onDeleteAllStudents: () => void;
  onTogglePermission: (profileId: string, permissionKey: 'syllabusAllowed' | 'labsAllowed' | 'certAllowed' | 'pharmaAllowed') => void;
  onUpdateStudentPin: (profileId: string, newPin: string) => void;
  tutorPhoto: string;
  onUpdateTutorPhoto: (newPhoto: string) => void;
  onClose: () => void;
}

export default function AdminPanel({
  profiles,
  onApproveStudent,
  onRejectStudent,
  onDeleteStudent,
  onDeleteAllStudents,
  onTogglePermission,
  onUpdateStudentPin,
  tutorPhoto,
  onUpdateTutorPhoto,
  onClose
 }: AdminPanelProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('tutor_admin_auth') === 'true';
  });
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [profileToDelete, setProfileToDelete] = useState<StudentProfile | null>(null);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [adminWarning, setAdminWarning] = useState<string | null>(null);

  const [editingPinId, setEditingPinId] = useState<string | null>(null);
  const [editingPinValue, setEditingPinValue] = useState('');

  const handleSavePin = (profileId: string) => {
    onUpdateStudentPin(profileId, editingPinValue);
    setEditingPinId(null);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'admin' && password === 'Pawan@94522') {
      setIsAuthenticated(true);
      localStorage.setItem('tutor_admin_auth', 'true');
      setError('');
    } else {
      setError('Invalid Username or Password! Beta check the default credentials.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('tutor_admin_auth');
    setUsername('');
    setPassword('');
  };

  const filteredProfiles = profiles.filter(p => {
    const matchesSearch = (p.progress.userName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.progress.rollNumber || '').includes(searchQuery) ||
                          (p.progress.stream || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const status = p.progress.approvalStatus || 'pending';
    const matchesFilter = statusFilter === 'all' || status === statusFilter;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: 'pending' | 'approved' | 'rejected' | undefined) => {
    const s = status || 'pending';
    switch (s) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
            <CheckCircle className="w-3 h-3" /> Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider animate-pulse">
            <ShieldAlert className="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-7xl w-full h-[90vh] flex flex-col overflow-hidden animate-fadeIn text-left">
        
        {/* Header section */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-md shadow-indigo-600/20">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-lg">Pawan Sir's Admin Control Panel 🔑</h3>
              <p className="text-[11px] text-slate-400 font-semibold">Manage student approvals, rejections and profile credentials</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conditional body content */}
        {!isAuthenticated ? (
          /* LOGIN FORM SCREEN */
          <div className="flex-1 overflow-y-auto p-8 max-w-md mx-auto w-full flex flex-col justify-center space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto border border-indigo-100 shadow-xs">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="font-black text-slate-800 text-base">Admin Verification Required</h4>
              <p className="text-xs text-slate-400 font-semibold">Please authenticate to manage python students portal</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">Username</label>
                <input
                  type="text"
                  required
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white font-bold text-slate-800 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white font-mono text-slate-800 transition-all"
                />
              </div>

              {error && (
                <p className="text-[11px] text-rose-500 font-bold bg-rose-50 border border-rose-100 p-2.5 rounded-xl text-center">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-indigo-600/25 active:scale-95 transition-all cursor-pointer text-center"
              >
                Authenticate & Login 🚀
              </button>
            </form>
          </div>
        ) : (
          /* MAIN ADMIN CONTROL PANEL DASHBOARD */
          <div className="flex-1 overflow-hidden flex flex-col lg:flex-row h-full bg-slate-50/50 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            {/* LEFT SIDE: STUDENT DIRECTORY */}
            <div className="flex-1 flex flex-col overflow-hidden h-1/2 lg:h-full">
                {/* Filter and Stats Bar */}
                <div className="p-4 bg-white border-b border-slate-100 flex flex-col md:flex-row gap-3 items-center justify-between">
                  
                  {/* Search input */}
                  <div className="relative w-full md:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search by student name, roll..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white font-bold text-slate-800 transition-all"
                    />
                  </div>

                  {/* Status Filter buttons */}
                  <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-full md:w-auto">
                    {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
                      <button
                        key={f}
                        onClick={() => setStatusFilter(f)}
                        className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                          statusFilter === f 
                            ? 'bg-white text-indigo-600 shadow-xs' 
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>

                  {/* Delete All Students Button */}
                  {profiles.length > 0 && (
                    <button
                      onClick={() => setShowDeleteAllConfirm(true)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer w-full md:w-auto justify-center border border-rose-700 shadow-md shadow-rose-600/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Sabhi Students Delete 🗑️
                    </button>
                  )}

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-black transition-all cursor-pointer w-full md:w-auto justify-center border border-slate-200"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Logout Sir
                  </button>
                </div>

                {/* Students Table / Cards Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                  
                  {/* Tutor Profile Photo Settings */}
                  <div className="mb-6 bg-gradient-to-r from-indigo-50 to-indigo-100/40 border border-indigo-100 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative group">
                        {tutorPhoto ? (
                          <img 
                            src={tutorPhoto} 
                            alt="Mr. Pawan Pandey" 
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-200 shadow-md"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white font-serif font-extrabold text-2xl border-2 border-indigo-300 shadow-md">
                            PP
                          </div>
                        )}
                        <label htmlFor="tutor-photo-upload" className="absolute -bottom-1 -right-1 bg-indigo-600 hover:bg-indigo-700 text-white p-1.5 rounded-xl border-2 border-white shadow-sm cursor-pointer hover:scale-105 active:scale-95 transition-all">
                          <Camera className="w-3.5 h-3.5" />
                        </label>
                        <input 
                          id="tutor-photo-upload"
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                if (typeof reader.result === 'string') {
                                  onUpdateTutorPhoto(reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </div>
                      <div className="space-y-1 text-center md:text-left">
                        <h4 className="font-extrabold text-slate-800 text-sm">Mr. Pawan Pandey (Pawan Sir)</h4>
                        <p className="text-[11px] text-slate-500 font-bold leading-none">PyGuru AI Tutor Official Profile Photo</p>
                        <p className="text-[10px] text-indigo-600 font-semibold italic">Is photo ko change karne par ye chat panel aur certificates me live update ho jayega!</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {tutorPhoto && (
                        <button
                          onClick={() => {
                            if (confirm("Beta, kya aap sach me profile photo delete karna chahte hain?")) {
                              onUpdateTutorPhoto('');
                            }
                          }}
                          className="px-3.5 py-2 bg-white hover:bg-slate-50 text-rose-600 border border-slate-200 hover:border-rose-200 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs"
                        >
                          Delete Photo 🗑️
                        </button>
                      )}
                      <label 
                        htmlFor="tutor-photo-upload"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-md shadow-indigo-600/10 text-center"
                      >
                        Naya Photo Upload Karein 📤
                      </label>
                    </div>
                  </div>

                  {filteredProfiles.length === 0 ? (
                    <div className="p-12 text-center space-y-2">
                      <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                        <Users className="w-6 h-6" />
                      </div>
                      <h4 className="font-black text-slate-600 text-sm">No Students Found</h4>
                      <p className="text-xs text-slate-400 font-semibold">Is filter status ya criteria ke sath koi profile matches nahi hua beta</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
                      <table className="w-full border-collapse text-left">
                        <thead>
                          <tr className="bg-slate-50 text-slate-400 text-[9px] uppercase tracking-wider font-extrabold border-b border-slate-100">
                            <th className="p-4">Student Info</th>
                            <th className="p-4">Stream & Roll</th>
                            <th className="p-4">Verification Status</th>
                            <th className="p-4 text-center">Module Permissions 🔒</th>
                            <th className="p-4 text-center">Syllabus Progress</th>
                            <th className="p-4 text-right">Approval Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-xs">
                          {filteredProfiles.map(p => {
                            const status = p.progress.approvalStatus || 'pending';
                            const completedCount = p.progress.completedTopics.length;
                            // Assuming 12 default chapters/topics
                            const totalTopics = p.topicsState?.length || 12;
                            const percent = Math.round((completedCount / totalTopics) * 100);

                            return (
                              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                {/* Student Info */}
                                <td className="p-4">
                                  <div className="flex items-center gap-2.5">
                                    {p.progress.profilePic ? (
                                      <img 
                                        src={p.progress.profilePic} 
                                        alt={p.progress.userName} 
                                        referrerPolicy="no-referrer"
                                        className="w-9 h-9 rounded-xl object-cover shadow-sm border border-slate-200"
                                      />
                                    ) : (
                                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white flex items-center justify-center font-black text-xs uppercase shadow-sm">
                                        {p.progress.userName ? p.progress.userName[0] : '?'}
                                      </div>
                                    )}
                                    <div>
                                      <p className="font-extrabold text-slate-800 line-clamp-1">{p.progress.userName || "Unnamed Guest 👥"}</p>
                                      <p className="text-[10px] text-slate-400 font-semibold">Joined: {p.progress.joinedDate}</p>
                                    </div>
                                  </div>
                                </td>

                                {/* Stream & Roll */}
                                <td className="p-4">
                                  <p className="font-bold text-slate-700">{p.progress.stream || 'General Python'}</p>
                                  {p.progress.rollNumber && (
                                    <p className="text-[10px] text-slate-400 font-mono font-bold">Roll: {p.progress.rollNumber}</p>
                                  )}
                                  {/* Security PIN Display & Edit */}
                                  <div className="mt-1.5 flex items-center gap-1.5">
                                    <span className="text-[10px] text-slate-400 font-extrabold uppercase">🔒 PIN:</span>
                                    {editingPinId === p.id ? (
                                      <div className="flex items-center gap-1">
                                        <input 
                                          type="text"
                                          maxLength={4}
                                          value={editingPinValue}
                                          onChange={(e) => setEditingPinValue(e.target.value.replace(/\D/g, ''))}
                                          className="w-12 px-1 py-0.5 text-[10px] font-mono font-black text-slate-800 bg-white border border-rose-200 rounded text-center focus:outline-none animate-pulse"
                                        />
                                        <button 
                                          type="button"
                                          onClick={() => handleSavePin(p.id)}
                                          className="px-1.5 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-black rounded transition-all cursor-pointer"
                                        >
                                          Save
                                        </button>
                                        <button 
                                          type="button"
                                          onClick={() => setEditingPinId(null)}
                                          className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-500 text-[9px] font-black rounded transition-all cursor-pointer"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-1">
                                        <span className="font-mono text-[11px] font-extrabold text-rose-600 bg-rose-50 border border-rose-100/50 px-1.5 py-0.5 rounded">
                                          {p.progress.pinCode || 'None'}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setEditingPinId(p.id);
                                            setEditingPinValue(p.progress.pinCode || '');
                                          }}
                                          className="text-[9px] text-indigo-600 hover:text-indigo-700 font-extrabold cursor-pointer hover:underline"
                                          title="Edit PIN"
                                        >
                                          ✏️ Badlein
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </td>

                                {/* Verification Status */}
                                <td className="p-4">
                                  {getStatusBadge(p.progress.approvalStatus)}
                                </td>

                                {/* Module Permissions */}
                                <td className="p-4 text-center">
                                  <div className="flex items-center justify-center gap-1.5 flex-wrap max-w-[220px] mx-auto">
                                    <button
                                      onClick={() => onTogglePermission(p.id, 'syllabusAllowed')}
                                      className={`px-2 py-1 rounded-lg text-[9px] font-black transition-all flex items-center gap-1 cursor-pointer hover:scale-[1.05] ${
                                        p.progress.syllabusAllowed !== false
                                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                          : 'bg-slate-100 text-slate-400 border border-slate-200 line-through'
                                      }`}
                                      title="Toggle Syllabus Access"
                                    >
                                      <span>📚</span>
                                      <span>Syllabus</span>
                                      <span>{p.progress.syllabusAllowed !== false ? '✅' : '🔒'}</span>
                                    </button>

                                    <button
                                      onClick={() => onTogglePermission(p.id, 'labsAllowed')}
                                      className={`px-2 py-1 rounded-lg text-[9px] font-black transition-all flex items-center gap-1 cursor-pointer hover:scale-[1.05] ${
                                        p.progress.labsAllowed !== false
                                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                          : 'bg-slate-100 text-slate-400 border border-slate-200 line-through'
                                      }`}
                                      title="Toggle Labs Library Access"
                                    >
                                      <span>🧪</span>
                                      <span>Labs</span>
                                      <span>{p.progress.labsAllowed !== false ? '✅' : '🔒'}</span>
                                    </button>

                                    <button
                                      onClick={() => onTogglePermission(p.id, 'certAllowed')}
                                      className={`px-2 py-1 rounded-lg text-[9px] font-black transition-all flex items-center gap-1 cursor-pointer hover:scale-[1.05] ${
                                        p.progress.certAllowed !== false
                                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                          : 'bg-slate-100 text-slate-400 border border-slate-200 line-through'
                                      }`}
                                      title="Toggle Certificate Printing"
                                    >
                                      <span>🏆</span>
                                      <span>Cert</span>
                                      <span>{p.progress.certAllowed !== false ? '✅' : '🔒'}</span>
                                    </button>

                                    <button
                                      onClick={() => onTogglePermission(p.id, 'pharmaAllowed')}
                                      className={`px-2 py-1 rounded-lg text-[9px] font-black transition-all flex items-center gap-1 cursor-pointer hover:scale-[1.05] ${
                                        p.progress.pharmaAllowed !== false
                                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                          : 'bg-slate-100 text-slate-400 border border-slate-200 line-through'
                                      }`}
                                      title="Toggle Pharma Library Access"
                                    >
                                      <span>💊</span>
                                      <span>Pharma</span>
                                      <span>{p.progress.pharmaAllowed !== false ? '✅' : '🔒'}</span>
                                    </button>
                                  </div>
                                </td>

                                {/* Syllabus Progress */}
                                <td className="p-4">
                                  <div className="flex flex-col items-center justify-center">
                                    <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden mb-1">
                                      <div className="bg-indigo-600 h-full transition-all duration-300" style={{ width: `${percent}%` }} />
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-extrabold">{percent}% Completed</span>
                                  </div>
                                </td>

                                {/* Approval Actions */}
                                <td className="p-4 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    {status !== 'approved' && (
                                      <button
                                        onClick={() => onApproveStudent(p.id)}
                                        className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-150 border border-emerald-100 rounded-lg transition-all cursor-pointer"
                                        title="Approve Student"
                                      >
                                        <UserCheck className="w-4 h-4" />
                                      </button>
                                    )}
                                    {status !== 'rejected' && (
                                      <button
                                        onClick={() => onRejectStudent(p.id)}
                                        className="p-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-100 rounded-lg transition-all cursor-pointer"
                                        title="Reject Student"
                                      >
                                        <UserX className="w-4 h-4" />
                                      </button>
                                    )}
                                    <button
                                      onClick={() => {
                                        if (profiles.length <= 1) {
                                          setAdminWarning("Beta, kam se kam ek student profile ka hona zaroori hai! 😊");
                                        } else {
                                          setProfileToDelete(p);
                                        }
                                      }}
                                      className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 rounded-lg transition-all cursor-pointer"
                                      title="Delete Profile"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

            {/* RIGHT SIDE: VIDEO VAULT / LECTURE VIDEO MANAGER */}
            <div className="lg:w-[420px] xl:w-[480px] shrink-0 flex flex-col overflow-hidden h-1/2 lg:h-full bg-slate-50">
              <div className="p-4 bg-slate-100/60 border-b border-slate-200 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Video className="w-4 h-4" />
                  </span>
                  <span className="font-extrabold text-slate-800 text-xs sm:text-sm uppercase tracking-wider">Lecture Video Manager (वीडियो मैनेजर) 🎥</span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 sm:p-5">
                <VideoLecturesView approvalStatus="approved" isAdmin={true} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Alert/Warning Modal */}
      {adminWarning && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-sm w-full shadow-2xl animate-fadeIn space-y-4 text-center">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 border border-amber-100 rounded-full flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6 animate-bounce" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-800 text-sm">Action Blocked! ❌</h4>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">{adminWarning}</p>
            </div>
            <button
              onClick={() => setAdminWarning(null)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Theek Hai Beta 👍
            </button>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {profileToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-sm w-full shadow-2xl animate-fadeIn space-y-4 text-center">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 border border-rose-100 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-800 text-sm">Confirm Delete Profile? 🗑️</h4>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Beta, kya aap sach me <span className="font-extrabold text-slate-800">"{profileToDelete.progress.userName || 'this student'}"</span> ka profile delete karna chahte hain?
                Iska saara chat history aur progress permanent delete ho jayega!
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setProfileToDelete(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Nahi, Cancel 🚫
              </button>
              <button
                onClick={() => {
                  onDeleteStudent(profileToDelete.id);
                  setProfileToDelete(null);
                }}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/20 transition-all cursor-pointer"
              >
                Haan, Delete 🗑️
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete All Students Confirmation Modal */}
      {showDeleteAllConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-sm w-full shadow-2xl animate-fadeIn space-y-4 text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 border border-rose-200 rounded-full flex items-center justify-center mx-auto shadow-inner animate-pulse">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-extrabold text-slate-800 text-sm">Sabhi Students Delete Karein? ⚠️</h4>
              <p className="text-xs text-rose-600 font-extrabold bg-rose-50 border border-rose-100 p-2.5 rounded-xl">
                WARNING: Kya aap sach me sabhi students ke profiles aur unki progress/chats ko permanent delete karna chahte hain? Ye action undo nahi kiya ja sakta!
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowDeleteAllConfirm(false)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Nahi, Cancel 🚫
              </button>
              <button
                onClick={() => {
                  onDeleteAllStudents();
                  setShowDeleteAllConfirm(false);
                }}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow-md shadow-rose-600/20 transition-all cursor-pointer animate-pulse"
              >
                Haan, Delete All 🗑️
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
