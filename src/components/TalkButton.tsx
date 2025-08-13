import { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TalkButtonProps {
  isConnected: boolean;
  onTalkStart: () => void;
  onTalkEnd: () => void;
}

export const TalkButton = ({ isConnected, onTalkStart, onTalkEnd }: TalkButtonProps) => {
  const [isTalking, setIsTalking] = useState(false);

  const handleMouseDown = () => {
    if (!isConnected) return;
    setIsTalking(true);
    onTalkStart();
  };

  const handleMouseUp = () => {
    setIsTalking(false);
    onTalkEnd();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    handleMouseDown();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    handleMouseUp();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "w-48 h-48 rounded-full border-4 transition-all duration-300 touch-target",
          "bg-gradient-primary border-primary/30 shadow-talk talk-button",
          isTalking && "animate-talk-pulse scale-105 shadow-glow",
          !isConnected && "opacity-50 cursor-not-allowed bg-muted border-muted-foreground/30"
        )}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        disabled={!isConnected}
      >
        {isTalking ? (
          <Mic className="w-16 h-16 text-primary-foreground animate-pulse" />
        ) : (
          <MicOff className="w-16 h-16 text-primary-foreground" />
        )}
      </Button>
      
      <div className="text-center">
        <p className="text-lg font-semibold text-foreground">
          {isTalking ? 'TALKING...' : isConnected ? 'HOLD TO TALK' : 'DISCONNECTED'}
        </p>
        <p className="text-sm text-muted-foreground">
          {isConnected ? 'Press and hold the button' : 'Connect to start talking'}
        </p>
      </div>
    </div>
  );
};