import { useEffect, useRef } from "react";
import Button from "./Button.jsx";

export default function ModalConfirmacion({
  open = false,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "primary",
  loading = false,
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null);
  const cancelButtonRef = useRef(null);

  const titleId = "modal-confirmacion-title";
  const descId = "modal-confirmacion-desc";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) {
        dialog.showModal();
      }
      if (variant === "danger" && cancelButtonRef.current) {
        cancelButtonRef.current.focus();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [open, variant]);

  const handleBackdropClick = (e) => {
    if (e.target === dialogRef.current && !loading) {
      onCancel?.();
    }
  };

  const handleCancelEvent = (e) => {
    e.preventDefault();
    if (!loading) {
      onCancel?.();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descId}
      onClick={handleBackdropClick}
      onCancel={handleCancelEvent}
      className="p-0 rounded-lg shadow-xl backdrop:bg-slate-900/50 max-w-md w-full border border-slate-200 bg-white text-slate-900 focus-visible:outline-none"
    >
      <div className="p-6">
        <h2 id={titleId} className="text-lg font-semibold text-slate-900">
          {title}
        </h2>
        {message && (
          <p id={descId} className="mt-2 text-sm text-slate-600 leading-relaxed">
            {message}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <Button
            ref={cancelButtonRef}
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            loading={loading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
