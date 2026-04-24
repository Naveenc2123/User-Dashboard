/**
 * Input
 *
 * A labelled text input with optional error message.
 *
 * Props:
 *  label       – string label above the field
 *  name        – input name attribute
 *  type        – input type (default: "text")
 *  value       – controlled value
 *  onChange    – change handler
 *  placeholder – placeholder text
 *  error       – error string; shown in red below the field when present
 *  disabled    – boolean
 *  required    – boolean
 *
 * Usage:
 *   <Input
 *     label="Email"
 *     name="email"
 *     type="email"
 *     value={form.email}
 *     onChange={handleChange}
 *     error={errors.email}
 *   />
 */

const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  required = false,
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={[
          "w-full px-4 py-2 text-sm border rounded-lg outline-none transition",
          "focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400",
          "disabled:bg-gray-100 disabled:cursor-not-allowed",
          error ? "border-red-400 focus:ring-red-300" : "border-gray-300",
        ].join(" ")}
      />

      {error && (
        <p className="text-red-500 text-xs mt-0.5">{error}</p>
      )}
    </div>
  );
};

export default Input;
