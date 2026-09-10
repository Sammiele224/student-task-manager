import { useState } from "react";
import "./DeleteConfirmDialog.css";
import Button from "./Button";
import Card from "./Card";

export default function DeleteConfirmDialog({
  open,
  onCancel,
  onConfirm,
  title = "Delete item?",
  message = "Are you sure you want to delete? This action cannot be undone.",
  successTitle = "Deleted successfully",
  successMessage = "The item has been removed.",
}) {
  const [success, setSuccess] = useState(false);

  if (!open && !success) return null;

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }

    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      if (onCancel) {
        onCancel();
      }
    }, 1200);
  };

  const handleCancel = () => {
    setSuccess(false);
    onCancel?.();
  };

  if (success) {
    return (
      <div className="dialog-overlay">
        <Card
          className="dialog dialog--success"
          padding="lg"
          tone="default"
        >
          <div className="dialog__success">
            <div className="dialog__success-icon">✓</div>

            <h2 className="dialog__title">
              {successTitle}
            </h2>

            <p className="dialog__message">
              {successMessage}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="dialog-overlay"
      role="dialog"
      aria-modal="true"
    >
      <Card
        className="dialog"
        padding="lg"
        tone="default"
      >
        <div className="dialog__content">
          <h2 className="dialog__title">
            {title}
          </h2>

          <p className="dialog__message">
            {message}
          </p>
        </div>

        <div className="dialog__actions">
          <Button
            variant="secondary"
            size="md"
            onClick={handleCancel}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            size="md"
            onClick={handleConfirm}
          >
            Delete
          </Button>
        </div>
      </Card>
    </div>
  );
}