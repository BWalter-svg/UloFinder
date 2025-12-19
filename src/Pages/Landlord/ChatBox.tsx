import React, { useEffect, useState } from "react";
import supabase from "../../api/supabaseClient";
import "../iMessageChat.css";
import "./ChatBox.css";

interface ChatBoxProps {
  conversationId: string;
  onBack?: () => void; // optional callback to go back to conversation list
}

const ChatBox: React.FC<ChatBoxProps> = ({ conversationId, onBack }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    loadUser();
  }, []);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    setMessages(data || []);
  };

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel("msg_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => fetchMessages()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [conversationId]);

  const sendMessage = async () => {
    if (!input.trim() || !userId) return;

    await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: userId,
      content: input,
    });

    setInput("");
  };

  return (
    <div className="chat-panel">
      {/* Back button */}
      {onBack && (
        <div className="chat-back-btn" onClick={onBack}>
          ← Back
        </div>
      )}

      <div className="imessage-container">
        <div className="imessage-messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={
                msg.sender_id === userId
                  ? "bubble bubble-me"
                  : "bubble bubble-other"
              }
            >
              {msg.content}
              <span className="timestamp">
                {new Date(msg.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}
        </div>

        <div className="imessage-input-row">
          <input
            className="imessage-input"
            placeholder="Message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="imessage-send-btn" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;