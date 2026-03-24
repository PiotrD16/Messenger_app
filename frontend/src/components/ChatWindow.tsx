import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import "./ChatWindow.css";

type Message = {
    id: number;
    content: string;
    senderId: number;
    senderName: string;
    createdAt: string;
};
// co dashboard musi przekazac
type ChatWindowProps = {
    chatId: number;
    chatName: string;
    token: string;
    myUserId: number;
    onClose: () => void;
};

export function ChatWindow({chatId, chatName, token, myUserId, onClose}: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch(`http://localhost:3000/api/chat/messages/${chatId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setMessages(data));

        socketRef.current = io("http://localhost:3000", {
            auth: { token }
        });

        socketRef.current.emit("join_room", chatId);

        socketRef.current.on("receive_message", (message: Message) => {
            setMessages(prev => [...prev, message]);
        });

        return () => {
            socketRef.current?.disconnect();
            socketRef.current = null;
        };
    }, [chatId, token]);

    // scrollowanie jak bedzie nowa wiadomosc
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !socketRef.current) return;

        socketRef.current.emit("send_message", {
            conversationId: chatId,
            content: newMessage
        });

        setNewMessage("");
    };

    return (
        <div className="chat-overlay">
            <div className="chat-window">
                <div className="chat-header">
                    <div className="chat-title">{chatName}</div>
                    <button className="chat-close" onClick={onClose}>✕</button>
                </div>

                <div className="chat-body">
                    {messages.map(msg => {
                        const isMe = msg.senderId === myUserId;
                        return (
                            <div key={msg.id} className={`msg ${isMe ? "me" : "other"}`}>
                                {!isMe && <div className="msg-author">{msg.senderName}</div>}
                                <div className="msg-bubble">{msg.content}</div>
                                <div className="msg-time">
                                    {new Date(msg.createdAt).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                <form className="chat-input" onSubmit={handleSend}>
                    <input
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder="Napisz wiadomość…"
                    />
                    <button type="submit">➤</button>
                </form>
            </div>
        </div>
    );
}
