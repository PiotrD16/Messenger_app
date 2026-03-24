import { useState } from "react";
import "./CreateChatModal.css";

type CreateChatModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (email: string) => void;
};

export function CreateChatModal({ isOpen, onClose, onSubmit }: CreateChatModalProps) {
    const [email, setEmail] = useState("");

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (email.trim()) {
            onSubmit(email);
            setEmail("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            {}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Rozpocznij nową rozmowę</h3>
                <p>Wpisz adres email użytkownika, z którym chcesz pisać:</p>

                <div className="modal-body">
                    <input
                        type="email"
                        placeholder="np. jan@test.pl"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                    />

                    <div className="modal-buttons">
                        <button type="button" onClick={onClose} className="btn-cancel">
                            Anuluj
                        </button>
                        <button type="button" onClick={handleSubmit} className="btn-confirm">
                            Utwórz
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}