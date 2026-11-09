import { useId } from "react";
import { EtiquetaCampo, MensajesCampo } from "./CampoBase.jsx";
import { clasesControl, describirPor } from "./campoEstilos.js";

export default function TextInput({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  hint,
  error,
  required = false,
  maxLength,
  autoComplete,
  disabled = false,
  id,
  className = "",
  inputClassName = "",
  leadingIcon = null,
  rightElement = null,
  ...rest
}) {
  const generatedId = useId();
  const inputId = id || name || generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const paddingClasses = `${leadingIcon ? "pl-11" : "pl-3"} ${
    rightElement ? "pr-20" : "pr-3"
  }`;

  return (
    <div className={`w-full ${className}`}>
      <EtiquetaCampo htmlFor={inputId} label={label} required={required} />

      <div className="relative">
        {leadingIcon && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 transition-colors duration-300 dark:text-slate-400">
            {leadingIcon}
          </span>
        )}
        <input
          id={inputId}
          name={name}
          type={type}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          autoComplete={autoComplete}
          disabled={disabled}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={describirPor(hintId, errorId)}
          className={clasesControl(
            error,
            `${paddingClasses} ${inputClassName}`.trim()
          )}
          {...rest}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            {rightElement}
          </div>
        )}
      </div>

      <MensajesCampo hintId={hintId} hint={hint} errorId={errorId} error={error} />
    </div>
  );
}
