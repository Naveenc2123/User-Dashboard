/**
 * Avatar
 *
 * Shows a profile picture or falls back to initials.
 *
 * Props:
 *  src    – image URL (optional)
 *  name   – full name used to generate initials fallback
 *  size   – "sm" | "md" | "lg" | "xl"   (default: "md")
 *
 * Usage:
 *   <Avatar src={user.profilePic} name={user.name} size="lg" />
 *   <Avatar name="John Doe" />          ← initials fallback
 */

const SIZES = {
  sm: "w-8  h-8  text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
  xl: "w-20 h-20 text-xl",
};

const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0][0].toUpperCase();
};

const Avatar = ({ src, name = "", size = "md", className = "" }) => {
  const sizeClass = SIZES[size] ?? SIZES.md;

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        onError={(e) => {
          // Swap to initials on broken image
          e.target.style.display = "none";
          e.target.nextSibling && (e.target.nextSibling.style.display = "flex");
        }}
        className={[
          "rounded-full object-cover shrink-0",
          sizeClass,
          className,
        ].join(" ")}
      />
    );
  }

  return (
    <div
      className={[
        "rounded-full bg-indigo-100 text-indigo-700 font-semibold",
        "flex items-center justify-center shrink-0 select-none",
        sizeClass,
        className,
      ].join(" ")}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
