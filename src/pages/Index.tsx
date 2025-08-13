import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { TalkScreen } from '@/screens/TalkScreen';
import { FriendsScreen } from '@/screens/FriendsScreen';
import { MessagesScreen } from '@/screens/MessagesScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'talk' | 'friends' | 'messages' | 'settings'>('talk');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionType, setConnectionType] = useState<'bluetooth' | 'wifi' | 'none'>('none');
  const [connectedDevices, setConnectedDevices] = useState(0);

  // Simulate connection for demo
  const handleConnect = () => {
    setIsConnected(true);
    setConnectionType('bluetooth');
    setConnectedDevices(2);
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'talk':
        return (
          <TalkScreen 
            isConnected={isConnected}
            connectionType={connectionType}
            connectedDevices={connectedDevices}
          />
        );
      case 'friends':
        return <FriendsScreen />;
      case 'messages':
        return <MessagesScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <TalkScreen isConnected={isConnected} connectionType={connectionType} connectedDevices={connectedDevices} />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* App Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">PT</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-card-foreground">PeerTalk</h1>
              <p className="text-xs text-muted-foreground">Direct Communication</p>
            </div>
          </div>
          
          {/* Quick Connect Button (Demo) */}
          {!isConnected && activeTab === 'talk' && (
            <button
              onClick={handleConnect}
              className="px-3 py-1 text-xs bg-signal-green text-white rounded-full"
            >
              Demo Connect
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {renderActiveScreen()}
      </main>

      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
