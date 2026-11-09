import { useId } from "react";
import { EtiquetaCampo, MensajesCampo } from "./CampoBase.jsx";
import { clasesControl, describirPor } from "./campoEstilos.js";

export default function SelectInput({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder,
  hint,
  error,
  required = false,
  disabled = false,
  loading = false,
  id,
  className = "",
  ...rest
}) {
  const generatedId = useId();
  const inputId = id || name || generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className={`w-full ${className}`}>
      <EtiquetaCampo htmlFor={inputId} label={label} required={required} />

      <select
        id={inputId}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled || loading}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describirPor(hintId, errorId)}
        className={clasesControl(error)}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled={required}>
            {placeholder}
          </option>
        )}
        {loading ? (
          <option value="" disabled>
            Cargando...
          </option>
        ) : (
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
              {option.description ? ` (${option.description})` : ""}
            </option>
          ))
        )}
      </select>

      <MensajesCampo hintId={hintId} hint={hint} errorId={errorId} error={error} />
    </div>
  );
}
