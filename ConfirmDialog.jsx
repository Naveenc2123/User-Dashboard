/**
 * ConfirmDialog
 *
 * Replaces window.confirm() with a styled modal dialog.
 *
 * Props:
 *  isOpen       – boolean
 *  onClose      – called on cancel / backdrop click
 *  onConfirm    – called on confirm
 *  title        – dialog heading              (default: "Are you sure?")
 *  message      – description text
 *  confirmLabel – confirm button text         (default: "Confirm")
 *  cancelLabel  – cancel button text          (default: "Cancel")
 *  variant      – "danger" | "warning"        (default: "danger")
 *
 * Usage:
 *   <ConfirmDialog
 *     isOpen={showConfirm}
 *     onClose={() => setShowConfirm(false)}
 *     onConfirm={handleDelete}
 *     title="Delete User"
 *     message="This action cannot be undone."
 *     confirmLabel="Delete"
 *   />
 */

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
}) => {
  if (!isOpen) return null;

  const confirmBtnClass =
    variant === "danger"
      ? "bg-red-500 hover:bg-red-600 text-white"
      : "bg-yellow-500 hover:bg-yellow-600 text-white";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">

        {/* Icon */}
        <div
          className={[
            "w-12 h-12 rounded-full flex items-center justify-center text-2xl mx-auto mb-4",
            variant === "danger"
              ? "bg-red-100 text-red-500"
              : "bg-yellow-100 text-yellow-500",
          ].join(" ")}
        >
          {variant === "danger" ? "🗑" : "⚠️"}
        </div>

        <h3 className="text-lg font-semibold text-center text-gray-800 mb-2">
          {title}
        </h3>

        {message && (
          <p className="text-sm text-gray-500 text-center mb-5">{message}</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${confirmBtnClass}`}
          >
            {confirmLabel}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmDialog;
