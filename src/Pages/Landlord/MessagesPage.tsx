import React, { useEffect, useState } from "react";
import supabase from "../../api/supabaseClient";
import ChatBox from "./ChatBox";
import "../iMessageChat.css"; // GLOBAL CSS

type ConversationItem = {
  id: string;
  landlord_id: string;
  tenant_id: string;
  last_message: string;
  updated_at: string;
};

const MessagesPage: React.FC = () => {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setConversations([]);
      setLoading(false);
      return;
    }

    setUserId(user.id);

    const { data, error } = await supabase
      .from("conversations")
      .select(`
        id,
        landlord_id,
        tenant_id,
        updated_at,
        messages!inner(content)
      `)
      .or(`landlord_id.eq.${user.id},tenant_id.eq.${user.id}`)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Fetch conversations error:", error);
      setConversations([]);
    } else {
      const mapped: ConversationItem[] = (data || []).map((c: any) => ({
        id: c.id,
        landlord_id: c.landlord_id,
        tenant_id: c.tenant_id,
        updated_at: c.updated_at,
        last_message: c.messages?.[c.messages.length - 1]?.content || "",
      }));
      setConversations(mapped);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <div className="messages-wrapper">

      {/* HEADER */}
      <div className="messages-header">
        <h1 className="messages-header-title">Messages</h1>
      </div>

      {/* MAIN */}
      <div className={`messages-main ${selectedConversation ? "chat-open" : ""}`}>

        {/* CONVERSATION LIST */}
        <div className="messages-left">
          {loading && <p className="messages-loading">Loading…</p>}

          {!loading && conversations.length === 0 && (
            <p className="messages-empty">No conversations yet.</p>
          )}

          <div className="messages-list">
            {conversations.map((c) => (
              <div
                key={c.id}
                className={`messages-item ${
                  selectedConversation === c.id ? "messages-item-active" : ""
                }`}
                onClick={() => setSelectedConversation(c.id)}
              >
                <p className="messages-last">{c.last_message || "No messages yet"}</p>
                <small className="messages-timestamp">
                  {new Date(c.updated_at).toLocaleString()}
                </small>
              </div>
            ))}
          </div>
        </div>

        {/* CHAT AREA */}
        <div className="messages-right">
          {selectedConversation ? (
            <ChatBox
              conversationId={selectedConversation}
              onBack={() => setSelectedConversation(null)} // <-- back button
            />
          ) : (
            <div className="messages-empty-chat">
              Select a conversation to start chatting
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MessagesPage;