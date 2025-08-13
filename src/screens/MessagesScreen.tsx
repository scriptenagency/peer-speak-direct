import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Mic, Paperclip } from 'lucide-react';
import { useState } from 'react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  type: 'text' | 'audio';
  timestamp: Date;
  isOwn: boolean;
}

export const MessagesScreen = () => {
  const [messages] = useState<Message[]>([
    {
      id: '1',
      senderId: 'alex',
      senderName: 'Alex Trail',
      content: 'Hey everyone! Ready for the hike?',
      type: 'text',
      timestamp: new Date('2024-01-01T10:00:00'),
      isOwn: false
    },
    {
      id: '2',
      senderId: 'me',
      senderName: 'You',
      content: 'Yes! Already at base camp',
      type: 'text',
      timestamp: new Date('2024-01-01T10:02:00'),
      isOwn: true
    },
    {
      id: '3',
      senderId: 'sarah',
      senderName: 'Sarah Mountain',
      content: 'Audio message about weather conditions',
      type: 'audio',
      timestamp: new Date('2024-01-01T10:05:00'),
      isOwn: false
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    console.log('Sending message:', newMessage);
    setNewMessage('');
    // TODO: Send message via peer connection
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    console.log('Started recording audio message');
    // TODO: Start audio recording
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    console.log('Stopped recording audio message');
    // TODO: Stop audio recording and send
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-bold text-foreground">Group Chat</h1>
        <p className="text-sm text-muted-foreground">4 members connected</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-[70%] ${
              message.isOwn ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              {!message.isOwn && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary/20 text-primary text-xs">
                    {message.senderName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <Card className={`p-3 ${
                message.isOwn 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-card'
              }`}>
                {!message.isOwn && (
                  <p className="text-xs font-medium mb-1 text-muted-foreground">
                    {message.senderName}
                  </p>
                )}
                
                {message.type === 'audio' ? (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 bg-primary/20 hover:bg-primary/30"
                    >
                      <Mic className="w-4 h-4" />
                    </Button>
                    <div className="flex-1">
                      <div className="w-32 h-1 bg-muted rounded-full">
                        <div className="w-8 h-1 bg-primary rounded-full" />
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">0:15</span>
                  </div>
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
                
                <p className="text-xs text-muted-foreground mt-1">
                  {formatTime(message.timestamp)}
                </p>
              </Card>
            </div>
          </div>
        ))}
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
              onMouseDown={handleStartRecording}
              onMouseUp={handleStopRecording}
              onTouchStart={handleStartRecording}
              onTouchEnd={handleStopRecording}
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