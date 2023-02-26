import { PropsWithChildren, ReactNode, useEffect } from "react";
import { CloseOutlined } from "@ant-design/icons";

import "./Modal.css";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  title?: string | ReactNode | JSX.Element;
}

export default function Modal({
  children,
  title,
  onClose,
  show,
}: PropsWithChildren<ModalProps>) {
  const displayStyle = { display: show ? "block" : "none" };

  const closeOnEsc = (e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  useEffect(() => {
    document.addEventListener("keydown", closeOnEsc, false);
    return () => {
      document.removeEventListener("keydown", closeOnEsc, false);
    };
  });

  return (
    <>
      <div className="modal-background" style={displayStyle}></div>
      <div className="modal" style={displayStyle}>
        {title && (
          <div className="modal-title">
            {title}
            <CloseOutlined className="modal-title-close" onClick={onClose} />
          </div>
        )}
        <div className="modal-content">{children}</div>
      </div>
    </>
  );
}
