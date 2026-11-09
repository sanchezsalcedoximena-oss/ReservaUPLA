import { useId } from "react";
import { EtiquetaCampo, MensajesCampo } from "./CampoBase.jsx";
import { clasesControl, describirPor } from "./campoEstilos.js";

export default function TimeInput({
  label,
  name,
  value,
  onChange,
  min,
  max,
  hint,
  error,
  required = false,
  disabled = false,
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

      <input
        id={inputId}
        name={name}
        type="time"
        value={value ?? ""}
        onChange={onChange}
        min={min}
        max={max}
        disabled={disabled}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describirPor(hintId, errorId)}
        className={clasesControl(error)}
        {...rest}
      />

      <MensajesCampo hintId={hintId} hint={hint} errorId={errorId} error={error} />
    </div>
  );
}
