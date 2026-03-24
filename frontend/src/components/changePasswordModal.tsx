import { useState } from "react";

import "./CreateChatModal.css";

type ChangePasswordModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (oldPass: string, newPass: string) => void;
};

export function ChangePasswordModal({ isOpen, onClose, onSubmit }: ChangePasswordModalProps) {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (oldPassword && newPassword) {
            onSubmit(oldPassword, newPassword);
            setOldPassword("");
            setNewPassword("");
        } else {
            alert("Wypełnij oba pola");
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Zmień hasło</h3>
                <p>Wprowadź swoje obecne hasło, aby ustawić nowe.</p>

                <div className="modal-body">
                    <input
                        type="password"
                        placeholder="Stare hasło"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Nowe hasło (min. 8 znaków)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <div className="modal-buttons">
                        <button type="button" onClick={onClose} className="btn-cancel">
                            Anuluj
                        </button>
                        <button type="button" onClick={handleSubmit} className="btn-confirm">
                            Zatwierdź
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}