interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "tel" | "date" | "number" | "textarea" | "select";
  placeholder?: string;
  error?: string;
  required?: boolean;
  value?: string | number;
  onChange?: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  options?: { value: string; label: string }[];
  rows?: number;
}

const baseInputStyles =
  "w-full bg-white border border-gray-200 rounded-xl py-4 px-5 text-sm text-[#1c1b1b] placeholder:text-gray-400 focus:border-[#4cbb17] focus:outline-none transition-colors";

export default function FormField({
  label,
  name,
  type = "text",
  placeholder,
  error,
  required = false,
  value,
  onChange,
  options,
  rows = 4,
}: FormFieldProps) {
  const inputClasses = [baseInputStyles, error ? "border-red-500" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div>
      <label
        htmlFor={name}
        className="block text-xs font-bold uppercase tracking-widest text-[#78716c] mb-2"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          rows={rows}
          className={`${inputClasses} resize-none`}
        />
      ) : type === "select" ? (
        <select
          id={name}
          name={name}
          required={required}
          value={value}
          onChange={onChange}
          className={`${inputClasses} appearance-none`}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          className={inputClasses}
        />
      )}

      {error && <p className="mt-1 text-red-500 text-xs">{error}</p>}
    </div>
  );
}
