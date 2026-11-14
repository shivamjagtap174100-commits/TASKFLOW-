import React, { useRef, useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  Download,
  Upload,
  RotateCcw,
  Keyboard,
  Sliders,
  Info,
  User,
  LogOut
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    exportData,
    importData,
    resetToSampleData,
    activeWorkspace,
    overallStats,
    userProfile,
    updateUserProfile
  } = useTasks();

  const { currentUser, setIsAuthModalOpen } = useAuth();

  const [nameInput, setNameInput] = useState(userProfile.name);
  const [roleInput, setRoleInput] = useState(userProfile.role);
  const [isSaved, setIsSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    updateUserProfile({ name: nameInput.trim(), role: roleInput.trim() });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importData(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const shortcuts = [
    { key: 'N', desc: 'Create new task' },
    { key: '/', desc: 'Quick focus search' },
    { key: '⌘ / Ctrl + Enter', desc: 'Save task in modal' },
    { key: 'Esc', desc: 'Close open dialogs & menus' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className="w-full max-w-lg bg-[#141513]/95 backdrop-blur-2xl border border-white/[0.12] rounded-2xl shadow-modal animate-modal-in overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#C5A46D] shadow-[0_0_8px_#C5A46D]" />
            <Sliders className="w-4 h-4 text-[#C5A46D]" />
            <h2 className="text-base font-medium text-[#F6F5F0]">Settings & Workspace</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#9B9D95] hover:text-[#F6F5F0] p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Creator Profile */}
          <div>
            <h3 className="text-xs uppercase tracking-wider text-[#9B9D95] font-semibold mb-3 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#C5A46D]" />
              <span>Creator Profile & Attribution</span>
            </h3>
            <form onSubmit={handleSaveProfile} className="p-4 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-xl space-y-3 shadow-glass">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#9B9D95] font-medium mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-white/[0.04] border border-white/[0.09] rounded-lg px-3 py-2 text-xs text-[#F6F5F0] placeholder-[#9B9D95]/40 focus:outline-none focus:border-[#C5A46D]/80 focus:ring-1 focus:ring-[#C5A46D]/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#9B9D95] font-medium mb-1">
                    Title / Role
                  </label>
                  <input
                    type="text"
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    placeholder="e.g., Founder & Lead Designer"
                    className="w-full bg-white/[0.04] border border-white/[0.09] rounded-lg px-3 py-2 text-xs text-[#F6F5F0] placeholder-[#9B9D95]/40 focus:outline-none focus:border-[#C5A46D]/80 focus:ring-1 focus:ring-[#C5A46D]/30 transition-all"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-[#9B9D95]">
                  Displayed in sidebar and application header
                </span>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-semibold bg-gradient-to-r from-[#C5A46D] to-[#D4B57E] hover:brightness-110 text-[#101110] rounded-lg transition-all shadow-sm active:scale-95"
                >
                  {isSaved ? 'Saved ✓' : 'Update Profile'}
                </button>
              </div>

              {currentUser && (
                <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-white/[0.06]">
                  <div className="text-[11px] text-[#9B9D95]">
                    Signed in as <span className="text-[#F6F5F0] font-medium">{currentUser.email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      setIsAuthModalOpen(true);
                    }}
                    className="flex items-center gap-1 text-[11px] text-[#C5A46D] hover:underline"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Switch Account</span>
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Workspace Info */}
          <div>
            <h3 className="text-xs uppercase tracking-wider text-[#9B9D95] font-semibold mb-3">
              Active Workspace
            </h3>
            <div className="p-4 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-xl flex items-center justify-between shadow-glass">
              <div>
                <div className="text-sm font-medium text-[#F6F5F0] flex items-center gap-2">
                  <span>{activeWorkspace.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#C5A46D]/15 text-[#C5A46D] border border-[#C5A46D]/30">
                    {activeWorkspace.role}
                  </span>
                </div>
                <div className="text-xs text-[#9B9D95] mt-0.5">
                  {overallStats.total} total tasks in workspace database
                </div>
              </div>
            </div>
          </div>

          {/* Data Backup & Restore */}
          <div>
            <h3 className="text-xs uppercase tracking-wider text-[#9B9D95] font-semibold mb-3">
              Data Management & Persistence
            </h3>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3.5 bg-white/[0.025] hover:bg-white/[0.04] border border-white/[0.07] rounded-xl transition-all shadow-glass">
                <div>
                  <div className="text-xs font-medium text-[#F6F5F0]">Export JSON Backup</div>
                  <div className="text-[11px] text-[#9B9D95]">Download snapshot of all active & archived tasks</div>
                </div>
                <button
                  type="button"
                  onClick={exportData}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white/[0.05] hover:bg-white/[0.09] text-[#F6F5F0] border border-white/[0.1] rounded-lg transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-[#C5A46D]" />
                  <span>Export</span>
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-white/[0.025] hover:bg-white/[0.04] border border-white/[0.07] rounded-xl transition-all shadow-glass">
                <div>
                  <div className="text-xs font-medium text-[#F6F5F0]">Import Tasks</div>
                  <div className="text-[11px] text-[#9B9D95]">Restore tasks from previously exported JSON</div>
                </div>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white/[0.05] hover:bg-white/[0.09] text-[#F6F5F0] border border-white/[0.1] rounded-lg transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#C5A46D]" />
                    <span>Import</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-white/[0.025] hover:bg-white/[0.04] border border-white/[0.07] rounded-xl transition-all shadow-glass">
                <div>
                  <div className="text-xs font-medium text-[#F6F5F0]">Reset Sample Tasks</div>
                  <div className="text-[11px] text-[#9B9D95]">Restore clean default editorial task list</div>
                </div>
                <button
                  type="button"
                  onClick={resetToSampleData}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white/[0.05] hover:bg-white/[0.09] text-[#9B9D95] hover:text-[#F6F5F0] border border-white/[0.1] rounded-lg transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div>
            <h3 className="text-xs uppercase tracking-wider text-[#9B9D95] font-semibold mb-3 flex items-center gap-1.5">
              <Keyboard className="w-3.5 h-3.5 text-[#C5A46D]" />
              <span>Keyboard Shortcuts</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {shortcuts.map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-white/[0.025] border border-white/[0.07] rounded-xl text-xs"
                >
                  <span className="text-[#9B9D95] text-[11px]">{s.desc}</span>
                  <kbd className="font-mono text-[10px] text-[#F6F5F0] bg-white/[0.06] border border-white/[0.1] px-2 py-0.5 rounded shadow-sm">
                    {s.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>

          {/* Product About & Creator Credit */}
          <div className="pt-3 border-t border-white/[0.08] space-y-1.5 text-[11px] text-[#9B9D95]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#C5A46D]" />
                <span className="font-medium text-[#F6F5F0]">TASKFLOW</span>
                <span>v1.0.0</span>
              </div>
              <span className="text-[#C5A46D] font-mono">Make Every Day Count.</span>
            </div>
            <div className="text-[11px] text-[#9B9D95]/80 pt-1">
              Engineered & Crafted by <span className="text-[#F6F5F0] font-medium">{userProfile.name}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3.5 bg-white/[0.02] border-t border-white/[0.08]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-gradient-to-r from-[#C5A46D] to-[#D4B57E] hover:brightness-110 text-[#101110] rounded-lg transition-all shadow-[0_2px_12px_rgba(197,164,109,0.3)] active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
