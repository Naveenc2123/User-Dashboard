/**
 * SelectInput
 *
 * A labelled <select> with optional error message.
 *
 * Props:
 *  label    – string label above the field
 *  name     – select name attribute
 *  value    – controlled value
 *  onChange – change handler
 *  options  – array of { value, label } objects
 *  placeholder – first disabled option text (default: "Select…")
 *  error    – error string shown below
 *  disabled – boolean
 *
 * Usage:
 *   <SelectInput
 *     label="Gender"
 *     name="gender"
 *     value={form.gender}
 *     onChange={handleChange}
 *     options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }]}
 *   />
 */

const SelectInput = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select…",
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

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={[
          "w-full px-4 py-2 text-sm border rounded-lg outline-none bg-white transition",
          "focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400",
          "disabled:bg-gray-100 disabled:cursor-not-allowed",
          error ? "border-red-400 focus:ring-red-300" : "border-gray-300",
        ].join(" ")}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-red-500 text-xs mt-0.5">{error}</p>
      )}
    </div>
  );
};

export default SelectInput;
