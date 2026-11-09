import AlertMessage from "./AlertMessage.jsx";
import Button from "./Button.jsx";

export default function AlertaErrorCarga({
  title = "No se pudo cargar la información",
  message,
  onRetry,
  onClose,
}) {
  return (
    <AlertMessage
      type="error"
      title={title}
      message={
        <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span>{message}</span>
          {onRetry && (
            <Button
              variant="secondary"
              onClick={onRetry}
              className="w-fit text-xs"
            >
              Reintentar
            </Button>
          )}
        </div>
      }
      onClose={onClose}
    />
  );
}
