import { useState } from "react";
import TextInput from "./TextInput.jsx";

export default function PasswordInput(props) {
  const [showPassword, setShowPassword] = useState(false);

  const toggleButton = (
    <button
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      aria-pressed={showPassword}
      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
      className="min-h-[40px] shrink-0 px-3 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-upla-500 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white dark:focus-visible:outline-[#7FD0FF]"
    >
      {showPassword ? "Ocultar" : "Mostrar"}
    </button>
  );

  return (
    <TextInput
      {...props}
      type={showPassword ? "text" : "password"}
      rightElement={toggleButton}
    />
  );
}
