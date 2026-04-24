/**
 * Badge
 *
 * Small coloured pill for status, tags, and labels.
 *
 * Props:
 *  variant – "success" | "danger" | "warning" | "info" | "default"  (default: "default")
 *  size    – "sm" | "md"                                             (default: "md")
 *  children
 *
 * Usage:
 *   <Badge variant="success">Active</Badge>
 *   <Badge variant="danger">Inactive</Badge>
 *   <Badge variant="info">#react</Badge>
 */

const VARIANTS = {
  success: "bg-green-100 text-green-700",
  danger:  "bg-red-100   text-red-600",
  warning: "bg-yellow-100 text-yellow-700",
  info:    "bg-indigo-100 text-indigo-700",
  default: "bg-gray-100  text-gray-600",
};

const SIZES = {
  sm: "text-xs px-2 py-0.5",
  md: "text-xs px-2.5 py-1",
};

const Badge = ({
  variant = "default",
  size = "md",
  children,
  className = "",
}) => {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full font-medium",
        VARIANTS[variant] ?? VARIANTS.default,
        SIZES[size] ?? SIZES.md,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
};

export default Badge;
