// src/components/Modal.jsx
import React from "react";

const Modal = ({ isOpen, onClose, children, title = "Modal" }) => {
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleEscapeKey = (e) => {
        if (e.key === "Escape") {
            onClose();
        }
    };

    React.useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleEscapeKey);
        } else {
            document.removeEventListener("keydown", handleEscapeKey);
        }
        return () => {
            document.removeEventListener("keydown", handleEscapeKey);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50" onClick={handleOverlayClick}>
            <div className="relative bg-white p-6 rounded shadow-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-2 right-2 text-black hover:text-2xl rounded-full w-8 h-8 flex items-center justify-center"aria-label="Close">
                    &times;
                </button>

                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                {children}
            </div>
        </div>
    );
};

export default Modal;