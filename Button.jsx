/**
 * Button
 *
 * Props:
 *  variant   – "primary" | "danger" | "success" | "outline" | "ghost"   (default: "primary")
 *  size      – "sm" | "md" | "lg"                                        (default: "md")
 *  type      – html button type                                           (default: "button")
 *  disabled  – boolean
 *  fullWidth – boolean
 *  icon      – ReactNode rendered before children
 *  onClick   – handler
 *  children  – label
 *
 * Usage:
 *   <Button variant="primary" onClick={handleSave}>Save</Button>
 *   <Button variant="danger" size="sm" icon={<TrashIcon />}>Delete</Button>
 *   <Button variant="outline" fullWidth>Cancel</Button>
 */

const VARIANTS = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700 border-transparent",
  danger:  "bg-red-500   text-white hover:bg-red-600   border-transparent",
  success: "bg-green-500 text-white hover:bg-green-600 border-transparent",
  outline: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
  ghost:   "bg-transparent text-gray-600 border-transparent hover:bg-gray-100",
};

const SIZES = {
  sm: "px-3 py-1 text-xs rounded-lg",
  md: "px-4 py-2 text-sm rounded-lg",
  lg: "px-5 py-2.5 text-base rounded-xl",
};

const Button = ({
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  fullWidth = false,
  icon = null,
  onClick,
  children,
  className = "",
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        "inline-flex items-center justify-center gap-1.5 font-medium border transition active:scale-95",
        VARIANTS[variant] ?? VARIANTS.primary,
        SIZES[size] ?? SIZES.md,
        fullWidth ? "w-full" : "",
        disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
