import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type?: "warning" | "error" | "success";
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type = "warning",
  onClose,
  duration = 4000,
}: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    warning: "bg-amber-50 border-amber-400 text-amber-800",
    error: "bg-red-50 border-red-400 text-red-800",
    success: "bg-emerald-50 border-emerald-400 text-emerald-800",
  }[type];

  const icon = {
    warning: "⚠️",
    error: "❌",
    success: "✅",
  }[type];

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 max-w-sm border-l-4 rounded-lg px-4 py-3 shadow-lg
        transition-all duration-300
        ${bgColor}
        ${visible ? "animate-slide-up opacity-100" : "opacity-0 translate-y-[-16px]"}
      `}
    >
      <div className="flex items-start gap-2">
        <span className="text-lg flex-shrink-0">{icon}</span>
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-auto flex-shrink-0 text-current opacity-50 hover:opacity-100 transition-opacity"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
