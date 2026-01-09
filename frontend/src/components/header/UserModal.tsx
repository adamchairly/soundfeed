import { useState } from "react";
import { X, Mail } from "lucide-react";
import httpClient from "@/api/HttpClient";

interface UserModalProps {
  email?: string;
  emailNotifications: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const UserModal = ({
  email,
  emailNotifications,
  onClose,
  onUpdate,
}: UserModalProps) => {
  const [inputEmail, setInputEmail] = useState(email || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(emailNotifications);
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (value: string) => {
    setInputEmail(value);
    if (value && !validateEmail(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async () => {
    if (!inputEmail) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(inputEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    try {
      await httpClient.patch("/api/Email", { Email: inputEmail });
      onUpdate();
    } catch (err) {
      console.error("Failed to save email:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotificationsToggle = async (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    try {
      await httpClient.patch("/api/Email", { Enabled: enabled });
      onUpdate();
    } catch (err) {
      console.error("Failed to update notifications:", err);
      setNotificationsEnabled(!enabled);
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

        <div className="p-6 pt-8 space-y-6">
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
                onClick={handleSubmit}
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
              checked={notificationsEnabled}
              onChange={(e) => handleNotificationsToggle(e.target.checked)}
              className="w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-slate-500"
            />
            <label
              htmlFor="emailNotifications"
              className="text-sm text-slate-700 cursor-pointer"
            >
              Receive weekly digest emails
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};