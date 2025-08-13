import { TalkButton } from '@/components/TalkButton';
import { StatusIndicator } from '@/components/StatusIndicator';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';

interface TalkScreenProps {
  isConnected: boolean;
  connectionType: 'bluetooth' | 'wifi' | 'none';
  connectedDevices: number;
}

export const TalkScreen = ({ isConnected, connectionType, connectedDevices }: TalkScreenProps) => {
  const [isMuted, setIsMuted] = useState(false);

  const handleTalkStart = () => {
    console.log('Talk started');
    // TODO: Implement voice recording/transmission
  };

  const handleTalkEnd = () => {
    console.log('Talk ended');
    // TODO: Stop voice recording/transmission
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with status */}
      <div className="p-4 space-y-4">
        <StatusIndicator 
          isConnected={isConnected}
          connectionType={connectionType}
          connectedDevices={connectedDevices}
        />
        
        {/* Volume Control */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Volume</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className="touch-target"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-destructive" />
            ) : (
              <Volume2 className="w-5 h-5 text-foreground" />
            )}
          </Button>
        </div>
      </div>

      {/* Main Talk Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <TalkButton
          isConnected={isConnected}
          onTalkStart={handleTalkStart}
          onTalkEnd={handleTalkEnd}
        />
      </div>

      {/* Connection Info */}
      <div className="p-4 bg-card/50 border-t border-border">
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            {isConnected 
              ? `Connected via ${connectionType.toUpperCase()}` 
              : 'No active connections'
            }
          </p>
          {isConnected && connectedDevices > 0 && (
            <p className="text-xs text-signal-green">
              {connectedDevices} friend{connectedDevices !== 1 ? 's' : ''} in range
            </p>
          )}
        </div>
      </div>
    </div>
  );
};