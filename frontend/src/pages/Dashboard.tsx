import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import "./Dashboard.css";

import { ChatWindow } from "../components/ChatWindow";
import { CreateChatModal } from "../components/CreateChatModal";
import { ChangePasswordModal } from "../components/changePasswordModal";

import useAxiosPrivate, { getAccessToken, setAccessToken } from "../hooks/useAxiosPrivate";
import { useAuth } from "../context/AuthProvider";

type Chat = {
    id: number;
    conversation_name: string;
    created_at: string;
};

type Notification = {
    message: string;
    type: "success" | "error";
} | null;

export function Dashboard() {
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    // Pobieramy usera z RAM (Context API), nie z localStorage
    const { auth, setAuth } = useAuth();
    const user = auth.user;

    const [chats, setChats] = useState<Chat[]>([]);
    const [activeChat, setActiveChat] = useState<Chat | null>(null);

    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);

    const [notification, setNotification] = useState<Notification>(null);
    const socketRef = useRef<Socket | null>(null);

    const showNotification = (msg: string, type: "success" | "error") => {
        setNotification({ message: msg, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const fetchChats = async () => {
        try {
            const res = await axiosPrivate.get("/chat/my-chats");
            setChats(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate("/");
            return;
        }

        fetchChats();

        const token = getAccessToken();

        socketRef.current = io("http://localhost:3000", {
            auth: { token }
        });

        socketRef.current.on("receive_message", () => {
            fetchChats();
        });

        socketRef.current.on("should_refresh_chats", () => {
            fetchChats();
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, [navigate, user]);

    const handleCreateChat = async (email: string) => {
        try {
            const res = await axiosPrivate.post("/chat/create", { recipientEmail: email });

            showNotification("Czat został utworzony pomyślnie!", "success");
            setCreateModalOpen(false);
            fetchChats();

            if (res.data.id) {
                if (socketRef.current) {
                    socketRef.current.emit("join_room", res.data.id);
                }
                setActiveChat({
                    id: res.data.id,
                    conversation_name: res.data.conversation_name,
                    created_at: new Date().toISOString()
                });
            }
        } catch (e: any) {
            showNotification(e.response?.data?.error || "Błąd tworzenia czatu", "error");
        }
    };

    const handleDeleteChat = async (e: React.MouseEvent, chatId: number) => {
        e.stopPropagation();

        if (!confirm("Czy na pewno chcesz usunąć ten czat?")) {
            return;
        }

        try {
            await axiosPrivate.delete(`/chat/${chatId}`);
            showNotification("Czat usunięty", "success");
            setChats(prev => prev.filter(c => c.id !== chatId));
        } catch (err) {
            showNotification("Błąd połączenia", "error");
        }
    };

    const handleChangePassword = async (oldPass: string, newPass: string) => {
        try {
            await axiosPrivate.post("/auth/change-password", {
                oldPassword: oldPass,
                newPassword: newPass
            });

            showNotification("Hasło zostało zmienione!", "success");
            setPasswordModalOpen(false);
        } catch (e: any) {
            showNotification(e.response?.data?.error || "Błąd zmiany hasła", "error");
        }
    };

    const handleLogout = async () => {
        try {
            await axiosPrivate.post("/auth/logout");
        } catch (e) {
            console.error(e);
        }

        setAuth({ user: null, accessToken: null });
        setAccessToken("");

        navigate("/");
    };

    if (!user) return <div className="dashboard-container">Ładowanie...</div>;

    return (
        <div className="dashboard-container">
            {notification && (
                <div className={`notification-toast ${notification.type}`}>
                    {notification.message}
                </div>
            )}

            <CreateChatModal
                isOpen={isCreateModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSubmit={handleCreateChat}
            />

            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setPasswordModalOpen(false)}
                onSubmit={handleChangePassword}
            />

            {activeChat && (
                <ChatWindow
                    chatId={activeChat.id}
                    chatName={activeChat.conversation_name}
                    token={getAccessToken()}
                    myUserId={user.userId || user.id}
                    onClose={() => setActiveChat(null)}
                />
            )}

            <header className="dashboard-header">
                <div className="user-info">
                    <h2>Witaj, {user.userName || user.user_name}!</h2>
                    <small>{user.email}</small>

                    <button
                        className="btn-change-password"
                        onClick={() => setPasswordModalOpen(true)}
                    >
                        Zmień hasło
                    </button>
                </div>
                <button onClick={handleLogout} className="btn-logout">
                    Wyloguj
                </button>
            </header>

            <main>
                <button onClick={() => setCreateModalOpen(true)} className="btn-create-chat">
                    <span>+</span> Rozpocznij nowy czat
                </button>

                <h3 className="section-title">Twoje rozmowy</h3>

                {chats.length === 0 ? (
                    <div className="empty-state">
                        Nie masz jeszcze żadnych rozmów. Kliknij przycisk powyżej, aby zacząć!
                    </div>
                ) : (
                    <ul className="chat-list">
                        {chats.map(chat => (
                            <li
                                key={chat.id}
                                onClick={() => setActiveChat(chat)}
                                className="chat-item"
                            >
                                <div className="chat-info">
                                    <strong>{chat.conversation_name}</strong>
                                    <span className="chat-date">
                                        {new Date(chat.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <button
                                    className="btn-delete-chat"
                                    onClick={(e) => handleDeleteChat(e, chat.id)}
                                    title="Usuń czat"
                                >
                                    X
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </div>
    );
}