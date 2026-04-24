/**
 * Modal
 *
 * A centered overlay modal with header, body, and footer slots.
 *
 * Props:
 *  isOpen   – boolean controls visibility
 *  onClose  – called when backdrop or ✕ is clicked
 *  title    – string shown in the header
 *  children – modal body content
 *  footer   – ReactNode for action buttons (optional)
 *  size     – "sm" | "md" | "lg"   (default: "md")
 *
 * Usage:
 *   <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add User">
 *     <p>Form content here…</p>
 *     <Modal.Footer>
 *       <Button variant="outline" onClick={onClose}>Cancel</Button>
 *       <Button type="submit">Save</Button>
 *     </Modal.Footer>
 *   </Modal>
 */

const SIZES = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={[
          "bg-white rounded-2xl shadow-xl w-full p-6 max-h-[90vh] overflow-y-auto",
          SIZES[size] ?? SIZES.md,
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          {title && (
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          )}
          <button
            onClick={onClose}
            className="ml-auto text-gray-400 hover:text-gray-600 text-xl leading-none transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        {children}
      </div>
    </div>
  );
};

// Optional footer sub-component for consistent button row
Modal.Footer = function ModalFooter({ children }) {
  return (
    <div className="flex items-center justify-end gap-3 pt-4 mt-2 border-t border-gray-100">
      {children}
    </div>
  );
};

export default Modal;
