/**
 * Toast + useToast
 *
 * Replaces window.alert() with a non-blocking toast notification.
 *
 * SETUP — wrap your app (or Dashboard) once:
 *   import { ToastProvider } from "../components/Toast";
 *   <ToastProvider><App /></ToastProvider>
 *
 * USAGE anywhere inside the tree:
 *   import { useToast } from "../components/Toast";
 *   const toast = useToast();
 *   toast.success("User added successfully");
 *   toast.error("Something went wrong");
 *   toast.info("Changes saved");
 *   toast.warning("Age must be above 18");
 */

import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(null);

const ICONS = {
  success: "✓",
  error:   "✕",
  warning: "⚠",
  info:    "ℹ",
};

const STYLES = {
  success: "bg-green-50 border-green-400 text-green-800",
  error:   "bg-red-50   border-red-400   text-red-800",
  warning: "bg-yellow-50 border-yellow-400 text-yellow-800",
  info:    "bg-indigo-50 border-indigo-400 text-indigo-800",
};

const ICON_STYLES = {
  success: "bg-green-100 text-green-600",
  error:   "bg-red-100   text-red-500",
  warning: "bg-yellow-100 text-yellow-600",
  info:    "bg-indigo-100 text-indigo-600",
};

let uid = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (type, message, duration = 3500) => {
      const id = ++uid;
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => remove(id), duration);
    },
    [remove]
  );

  const toast = {
    success: (msg) => push("success", msg),
    error:   (msg) => push("error",   msg),
    warning: (msg) => push("warning", msg),
    info:    (msg) => push("info",    msg),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Toast container — top-right */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-72">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={[
              "flex items-start gap-3 p-3 border rounded-xl shadow-md text-sm animate-fade-in",
              STYLES[t.type],
            ].join(" ")}
          >
            <span
              className={[
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5",
                ICON_STYLES[t.type],
              ].join(" ")}
            >
              {ICONS[t.type]}
            </span>
            <span className="flex-1 leading-snug">{t.message}</span>
            <button
              onClick={() => remove(t.id)}
              className="text-current opacity-50 hover:opacity-100 leading-none text-base ml-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
};
