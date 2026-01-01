import { useState } from "react";
import { RefreshCw, X, Copy, Check } from "lucide-react";

interface RecoveryModalProps {
  currentCode: string;
  onClose: () => void;
  onRecover: (code: string) => void;
}

export const RecoveryModal = ({
  currentCode,
  onClose,
  onRecover,
}: RecoveryModalProps) => {
  const [inputCode, setInputCode] = useState("");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
              Your recovery code
            </label>
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5">
              <span className="font-mono font-bold text-slate-800 text-lg tracking-wide pl-1">
                {currentCode}
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

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-slate-400 font-medium">OR</span>
            </div>
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
                onClick={() => onRecover(inputCode)}
                disabled={!inputCode}
                className="bg-slate-900 text-white px-4 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};