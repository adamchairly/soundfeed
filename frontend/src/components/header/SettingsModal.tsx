import { useState } from "react";
import { RefreshCw, X, Copy, Check, Mail } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

interface SettingsModalProps {
  onClose: () => void;
}

type Tab = "recovery" | "email";

export const SettingsModal = ({ onClose }: SettingsModalProps) => {
  const {
    userCode,
    email,
    emailNotifications,
    recoverIdentity,
    updateEmail,
    toggleNotifications,
  } = useUser();

  const [activeTab, setActiveTab] = useState<Tab>("recovery");

  // Recovery state
  const [inputCode, setInputCode] = useState("");
  const [copied, setCopied] = useState(false);

  // Email state
  const [inputEmail, setInputEmail] = useState(email || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");

  const copyToClipboard = () => {
    navigator.clipboard.writeText(userCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validateEmail = (emailValue: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const handleEmailChange = (value: string) => {
    setInputEmail(value);
    if (value && !validateEmail(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleEmailSubmit = async () => {
    if (!inputEmail) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(inputEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    await updateEmail(inputEmail);
    setIsSubmitting(false);
  };

  const handleRecover = async () => {
    const success = await recoverIdentity(inputCode);
    if (success) {
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex border-b border-slate-200 pt-4 px-6">
          <button
            onClick={() => setActiveTab("recovery")}
            className={`pb-3 px-1 mr-6 text-sm font-medium transition-all border-b-2 ${
              activeTab === "recovery"
                ? "text-slate-900 border-slate-900"
                : "text-slate-400 border-transparent hover:text-slate-600"
            }`}
          >
            Recovery
          </button>
          <button
            onClick={() => setActiveTab("email")}
            className={`pb-3 px-1 text-sm font-medium transition-all border-b-2 ${
              activeTab === "email"
                ? "text-slate-900 border-slate-900"
                : "text-slate-400 border-transparent hover:text-slate-600"
            }`}
          >
            Email
          </button>
        </div>

        <div className="p-6 space-y-4">
          {activeTab === "recovery" && (
            <>
              <div>
                <label className="block text-xs text-slate-500 tracking-wider mb-2">
                  Your recovery code
                </label>
                <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5">
                  <span className="font-mono font-bold text-slate-800 text-lg tracking-wide pl-1">
                    {userCode}
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 rounded-md bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-all active:scale-95"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Use this code to sync your artists across devices
                </p>
              </div>

              <div>
                <label className="block text-xs text-slate-500 tracking-wider mb-2">
                  Sync existing account
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ex: EAC-ASD"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 font-mono font-bold text-slate-800 text-lg tracking-wide outline-none focus:border-slate-400 focus:bg-white transition-all placeholder:text-slate-300 placeholder:font-sans placeholder:text-sm placeholder:font-normal placeholder:tracking-normal"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  />
                  <button
                    onClick={handleRecover}
                    disabled={!inputCode}
                    className="bg-slate-900 text-white px-4 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === "email" && (
            <>
              <div>
                <label className="block text-xs text-slate-500 tracking-wider mb-2">
                  Email
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 outline-none focus:border-slate-400 focus:bg-white transition-all placeholder:text-slate-300"
                    value={inputEmail}
                    onChange={(e) => handleEmailChange(e.target.value)}
                  />
                  <button
                    onClick={handleEmailSubmit}
                    disabled={!inputEmail || !!emailError || isSubmitting}
                    className="bg-slate-900 text-white px-4 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
                {emailError && (
                  <p className="text-xs text-red-500 mt-2">{emailError}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  checked={emailNotifications}
                  onChange={(e) => toggleNotifications(e.target.checked)}
                  className="w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-slate-500"
                />
                <label
                  htmlFor="emailNotifications"
                  className="text-sm text-slate-700 cursor-pointer"
                >
                  Receive weekly digest emails
                </label>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
