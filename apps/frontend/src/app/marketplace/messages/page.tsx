'use client';

import { useEffect, useState } from 'react';
import { MessagesService } from '@/lib/messages.service';
import { useSession } from '@/lib/auth-client';
import type { Message } from '@/lib';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Send, User, Loader2, Inbox } from 'lucide-react';

interface ConversationThread {
  partnerId: string;
  partnerName: string;
  lastMessage: Message;
  messages: Message[];
  unreadCount: number;
}

function groupIntoThreads(messages: Message[], currentUserId: string): ConversationThread[] {
  const threadMap = new Map<string, ConversationThread>();

  for (const msg of messages) {
    const partnerId = msg.senderId === currentUserId ? msg.receiverId : msg.senderId;
    const partnerName =
      msg.senderId === currentUserId
        ? msg.receiver?.name || partnerId
        : msg.sender?.name || partnerId;

    if (!threadMap.has(partnerId)) {
      threadMap.set(partnerId, {
        partnerId,
        partnerName,
        lastMessage: msg,
        messages: [],
        unreadCount: 0,
      });
    }

    const thread = threadMap.get(partnerId)!;
    thread.messages.push(msg);

    if (!msg.isRead && msg.receiverId === currentUserId) {
      thread.unreadCount++;
    }

    // Keep the latest message
    if (new Date(msg.createdAt) > new Date(thread.lastMessage.createdAt)) {
      thread.lastMessage = msg;
    }
  }

  return Array.from(threadMap.values()).sort(
    (a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
  );
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeThread, setActiveThread] = useState<ConversationThread | null>(null);
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);

  const currentUserId = session?.user?.id || '';

  async function loadMessages() {
    try {
      setLoading(true);
      setError(null);
      const data = await MessagesService.list({ take: 100 });
      setMessages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (currentUserId) {
      loadMessages();
    }
  }, [currentUserId]);

  const threads = currentUserId ? groupIntoThreads(messages, currentUserId) : [];

  // Update active thread when messages reload
  useEffect(() => {
    if (activeThread) {
      const updated = threads.find((t) => t.partnerId === activeThread.partnerId);
      if (updated) setActiveThread(updated);
    }
  }, [messages]);

  const handleSend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeThread || !content.trim()) return;

    try {
      setSending(true);
      await MessagesService.create({
        receiverId: activeThread.partnerId,
        content: content.trim(),
      });
      setContent('');
      await loadMessages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleMarkRead = async (msg: Message) => {
    if (!msg.isRead && msg.receiverId === currentUserId) {
      try {
        await MessagesService.markAsRead(msg.id);
      } catch {
        // Silently fail
      }
    }
  };

  const formatTime = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHrs = diffMs / (1000 * 60 * 60);

    if (diffHrs < 1) return `${Math.max(1, Math.floor(diffMs / 60000))}m ago`;
    if (diffHrs < 24) return `${Math.floor(diffHrs)}h ago`;
    if (diffHrs < 48) return "Yesterday";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
        <p className="mt-3 text-slate-500">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Messages</h1>
        <p className="text-slate-500 mt-1">
          Conversations with clients and freelancers from your projects.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
        {/* Thread List */}
        <Card className="lg:col-span-1 overflow-hidden">
          <div className="p-4 border-b bg-slate-50">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Conversations
            </h2>
          </div>

          {threads.length === 0 ? (
            <div className="p-8 text-center">
              <Inbox className="h-12 w-12 mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-medium text-slate-500">No conversations yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Messages will appear here when you or a client starts a conversation on a job.
              </p>
            </div>
          ) : (
            <div className="divide-y max-h-[540px] overflow-y-auto">
              {threads.map((thread) => (
                <button
                  key={thread.partnerId}
                  onClick={() => {
                    setActiveThread(thread);
                    // Mark unread messages as read
                    thread.messages.forEach(handleMarkRead);
                  }}
                  className={`w-full text-left p-4 hover:bg-slate-50 transition-colors ${
                    activeThread?.partnerId === thread.partnerId
                      ? 'bg-blue-50 border-l-3 border-l-blue-600'
                      : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {thread.partnerName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {thread.partnerName}
                        </p>
                        <span className="text-xs text-slate-400 flex-shrink-0 ml-2">
                          {formatTime(thread.lastMessage.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {thread.lastMessage.senderId === currentUserId && (
                          <span className="text-slate-400">You: </span>
                        )}
                        {thread.lastMessage.content}
                      </p>
                    </div>
                    {thread.unreadCount > 0 && (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex-shrink-0">
                        {thread.unreadCount}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>

        {/* Active Conversation */}
        <Card className="lg:col-span-2 flex flex-col overflow-hidden">
          {activeThread ? (
            <>
              {/* Header */}
              <div className="p-4 border-b bg-slate-50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                  {activeThread.partnerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{activeThread.partnerName}</p>
                  <p className="text-xs text-slate-400">
                    {activeThread.messages.length} message{activeThread.messages.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[400px] max-h-[440px]">
                {[...activeThread.messages]
                  .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                  .map((msg) => {
                    const isMine = msg.senderId === currentUserId;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                            isMine
                              ? 'bg-blue-600 text-white rounded-br-md'
                              : 'bg-slate-100 text-slate-900 rounded-bl-md'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                          <p
                            className={`text-[10px] mt-1.5 ${
                              isMine ? 'text-blue-200' : 'text-slate-400'
                            }`}
                          >
                            {formatTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Input */}
              <div className="p-4 border-t bg-white">
                <form onSubmit={handleSend} className="flex gap-3">
                  <Textarea
                    rows={1}
                    placeholder="Type a message..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="flex-1 resize-none rounded-xl min-h-[44px]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend(e as any);
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    disabled={sending || !content.trim()}
                    className="rounded-xl h-[44px] px-4"
                  >
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 mx-auto text-slate-200 mb-4" />
                <h3 className="text-lg font-semibold text-slate-700">
                  Select a conversation
                </h3>
                <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">
                  Choose a conversation from the left to start messaging. Conversations are created when you apply for a job or receive an application.
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
