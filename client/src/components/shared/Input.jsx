export default function Input({
  label,
  error,
  className = '',
  required,
  id,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`input-field ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function Select({ label, error, children, className = '', required, id, ...props }) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className={className}>
      {label && (
        <label htmlFor={selectId} className="label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={selectId}
        className={`input-field ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function Textarea({ label, error, className = '', required, id, ...props }) {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className={className}>
      {label && (
        <label htmlFor={textareaId} className="label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`input-field resize-none ${error ? 'border-red-400' : ''}`}
        rows={3}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
