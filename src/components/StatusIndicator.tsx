import { Wifi, WifiOff, Bluetooth, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusIndicatorProps {
  isConnected: boolean;
  connectionType: 'bluetooth' | 'wifi' | 'none';
  connectedDevices: number;
}

export const StatusIndicator = ({ isConnected, connectionType, connectedDevices }: StatusIndicatorProps) => {
  const getConnectionIcon = () => {
    switch (connectionType) {
      case 'bluetooth':
        return <Bluetooth className="w-5 h-5" />;
      case 'wifi':
        return isConnected ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />;
      default:
        return <WifiOff className="w-5 h-5" />;
    }
  };

  const getStatusColor = () => {
    if (!isConnected) return 'bg-signal-red';
    return connectedDevices > 0 ? 'bg-signal-green' : 'bg-signal-yellow';
  };

  return (
    <div className="flex items-center justify-between p-4 bg-card rounded-lg border">
      <div className="flex items-center space-x-3">
        <div className={cn(
          "p-2 rounded-full text-white signal-indicator",
          getStatusColor()
        )}>
          {getConnectionIcon()}
        </div>
        <div>
          <p className="font-semibold text-card-foreground">
            {isConnected ? 'Connected' : 'Disconnected'}
          </p>
          <p className="text-sm text-muted-foreground capitalize">
            {connectionType === 'none' ? 'No connection' : connectionType}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 text-card-foreground">
        <Users className="w-4 h-4" />
        <span className="font-semibold">{connectedDevices}</span>
      </div>
    </div>
  );
};