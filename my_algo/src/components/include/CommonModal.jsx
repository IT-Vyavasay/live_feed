"use client";
import { Modal } from "react-bootstrap";

const CommonModal = ({
  show,
  onClose,
  title,
  children,
  size = "md",
  centered = true,
  showCloseIcon = true,

  // footer buttons config
  footerButtons = [],
}) => {
  return (
    <Modal show={show} onHide={onClose} size={size} centered={centered}>
      {/* Header */}
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>

        {showCloseIcon && (
          <span className="modalCloseBtn" onClick={onClose}>
            <i className="mdi mdi-close"></i>
          </span>
        )}
      </Modal.Header>

      {/* Body */}
      <Modal.Body>{children}</Modal.Body>

      {/* Footer */}
      {footerButtons.length > 0 && (
        <Modal.Footer>
          {footerButtons.map((btn, index) => (
            <button
              key={index}
              type={btn.type || "button"}
              className={btn.className}
              onClick={btn.onClick}
              disabled={btn.disabled || btn.loading}
            >
              {btn.loading && btn.Loader ? <btn.Loader /> : btn.icon}
              {btn.label}
            </button>
          ))}
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default CommonModal;
