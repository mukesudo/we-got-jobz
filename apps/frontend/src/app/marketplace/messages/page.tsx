'use client';

import { useEffect, useState } from 'react';
import { MessagesService } from '@/lib/messages.service';
import type { Message } from '@/lib';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [receiverId, setReceiverId] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);

  async function loadMessages() {
    try {
      setLoading(true);
      setError(null);
      const data = await MessagesService.list({ take: 30 });
      setMessages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, []);

  const handleSend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!receiverId.trim() || !content.trim()) return;

    try {
      setSending(true);
      await MessagesService.create({
        receiverId: receiverId.trim(),
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Messages</h1>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <Card className="mb-6 p-6">
        <h2 className="mb-4 text-xl font-semibold">Send Message</h2>
        <form className="space-y-4" onSubmit={handleSend}>
          <Input
            placeholder="Receiver user ID"
            value={receiverId}
            onChange={(event) => setReceiverId(event.target.value)}
          />
          <Textarea
            rows={4}
            placeholder="Write your message..."
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
          <Button type="submit" disabled={sending}>
            {sending ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold">Recent Messages</h2>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">No messages yet.</p>
        ) : (
          <ul className="space-y-3">
            {messages.map((message) => (
              <li key={message.id} className="rounded-md border p-3">
                <p className="text-sm">{message.content}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  From: {message.sender?.name || message.senderId} | To: {message.receiverId}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
