import { useId } from "react";
import { EtiquetaCampo, MensajesCampo } from "./CampoBase.jsx";
import { clasesControl, describirPor } from "./campoEstilos.js";

export default function TextAreaInput({
  label,
  name,
  value,
  onChange,
  rows = 3,
  placeholder,
  hint,
  error,
  required = false,
  maxLength,
  disabled = false,
  id,
  className = "",
  ...rest
}) {
  const generatedId = useId();
  const inputId = id || name || generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const counterId = maxLength ? `${inputId}-counter` : undefined;
  const currentLength = typeof value === "string" ? value.length : 0;

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-1 flex items-center justify-between">
        <EtiquetaCampo htmlFor={inputId} label={label} required={required} />
        {maxLength && (
          <span
            id={counterId}
            className="text-xs text-slate-500"
            aria-live="polite"
          >
            {currentLength} / {maxLength}
          </span>
        )}
      </div>

      <textarea
        id={inputId}
        name={name}
        rows={rows}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describirPor(hintId, errorId, counterId)}
        className={clasesControl(error)}
        {...rest}
      />

      <MensajesCampo hintId={hintId} hint={hint} errorId={errorId} error={error} />
    </div>
  );
}
