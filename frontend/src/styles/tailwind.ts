export const text = {
  primary: "text-slate-900",
  secondary: "text-slate-600",
  muted: "text-slate-400",
  mutedDark: "text-slate-500",
  button: "text-slate-700",
  white: "text-white",
} as const;

export const button = {
  base: "transition-colors",
  hoverText: "hover:text-slate-600",
  hoverBg: "hover:bg-slate-200",
  disabled: "disabled:opacity-50 disabled:cursor-not-allowed",
  
  icon: {
    base: "flex items-center justify-center transition-colors",
    rounded: "rounded-full",
    size: {
      sm: "w-8 h-8",
      md: "w-5 h-5",
    },
    color: {
      default: "text-slate-400 hover:text-slate-600 hover:bg-slate-100",
      red: "text-slate-400 hover:text-red-500 hover:bg-red-50",
    },
  },
  
  primary: "bg-slate-900 text-white hover:bg-slate-800 transition-all",
  secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all",
  
  link: "hover:text-slate-900 transition-colors",
} as const;

export const border = {
  default: "border border-slate-200",
  focus: "focus-within:border-slate-400",
} as const;

export const rounded = {
  sm: "rounded",
  md: "rounded-lg",
  lg: "rounded-xl",
  xl: "rounded-2xl",
  full: "rounded-full",
} as const;

export const shadow = {
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
} as const;

export const divider = {
  line: "h-px bg-slate-200 flex-1",
} as const;

export const page = {
  background: "min-h-screen bg-slate-50 selection:bg-slate-200",
} as const;

export const heading = {
  h1: "text-3xl md:text-5xl tracking-tight",
  h2: "text-lg font-medium",
} as const;

export const badge = {
  base: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-900 text-sm shadow-sm",
} as const;