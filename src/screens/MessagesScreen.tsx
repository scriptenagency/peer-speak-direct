import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Mic, Paperclip, MessageCircle, Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAudio } from '@/hooks/useAudio';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  message_type: 'text' | 'audio';
  content: string | null;
  audio_url: string | null;
  duration_seconds: number | null;
  is_read: boolean;
  sent_at: string;
  sender_profile?: {
    display_name: string;
  };
}

export const MessagesScreen = () => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const { user } = useAuth();
  const { startRecording, stopRecording, playAudio, isPlaying } = useAudio();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user?.id},recipient_id.eq.${user?.id}`)
        .order('sent_at', { ascending: true });

      if (error) throw error;
      setMessages((data || []) as any);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load messages.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      // For demo purposes, sending to first friend
      const { data: friends } = await supabase
        .from('friends')
        .select('friend_user_id')
        .eq('user_id', user.id)
        .limit(1);

      if (!friends || friends.length === 0) {
        toast({
          title: "No Recipients",
          description: "Add friends to send messages.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: friends[0].friend_user_id,
          message_type: 'text',
          content: newMessage.trim(),
        });

      if (error) throw error;
      
      setNewMessage('');
      fetchMessages();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    }
  };

  const handleRecordAudio = async () => {
    if (isRecording) {
      const audioBlob = await stopRecording();
      setIsRecording(false);
      
      if (audioBlob) {
        // TODO: Upload audio and send audio message
        toast({
          title: "Audio Recorded",
          description: "Audio message functionality coming soon!",
        });
      }
    } else {
      await startRecording();
      setIsRecording(true);
    }
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-bold text-foreground">Messages</h1>
        <p className="text-sm text-muted-foreground">Offline messaging with friends</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No messages yet.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Start a conversation with your friends!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map(message => {
              const isOwn = message.sender_id === user?.id;
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[70%] ${
                    isOwn ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    {!isOwn && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary/20 text-primary text-xs">
                          {(message.sender_profile?.display_name || 'U').split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <Card className={`p-3 ${
                      isOwn 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-card'
                    }`}>
                      {!isOwn && (
                        <p className="text-xs font-medium mb-1 text-muted-foreground">
                          {message.sender_profile?.display_name || 'Unknown'}
                        </p>
                      )}
                      
                      {message.message_type === 'audio' ? (
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 bg-primary/20 hover:bg-primary/30"
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                          <div className="flex-1">
                            <div className="w-32 h-1 bg-muted rounded-full">
                              <div className="w-8 h-1 bg-primary rounded-full" />
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {message.duration_seconds ? `0:${message.duration_seconds.toString().padStart(2, '0')}` : '0:00'}
                          </span>
                        </div>
                      ) : (
                        <p className="text-sm">{message.content}</p>
                      )}
                      
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTime(message.sent_at)}
                      </p>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="touch-target"
          >
            <Paperclip className="w-5 h-5" />
          </Button>
          
          <div className="flex-1 flex items-center space-x-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="bg-input/50"
            />
            <Button
              variant="ghost"
              size="icon"
              onMouseDown={handleRecordAudio}
              onMouseUp={handleRecordAudio}
              onTouchStart={handleRecordAudio}
              onTouchEnd={handleRecordAudio}
              className={`touch-target ${isRecording ? 'bg-destructive text-destructive-foreground animate-pulse' : ''}`}
            >
              <Mic className="w-5 h-5" />
            </Button>
          </div>
          
          <Button
            variant="connect"
            size="icon"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="touch-target"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};