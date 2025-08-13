import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Bluetooth, Wifi, Volume2, Mic, Smartphone, Info } from 'lucide-react';
import { useState } from 'react';

export const SettingsScreen = () => {
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
  const [wifiHotspotEnabled, setWifiHotspotEnabled] = useState(false);
  const [autoConnect, setAutoConnect] = useState(true);
  const [volume, setVolume] = useState([75]);
  const [micSensitivity, setMicSensitivity] = useState([60]);

  const handleBluetoothScan = () => {
    console.log('Scanning for Bluetooth devices...');
    // TODO: Implement Bluetooth device scanning
  };

  const handleCreateHotspot = () => {
    console.log('Creating WiFi hotspot...');
    // TODO: Implement WiFi hotspot creation
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Configure your walkie-talkie</p>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Connection Settings */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
            <Smartphone className="w-5 h-5 mr-2" />
            Connection
          </h2>
          
          <div className="space-y-4">
            {/* Bluetooth */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bluetooth className="w-5 h-5 text-blue-500" />
                <div>
                  <Label htmlFor="bluetooth">Bluetooth</Label>
                  <p className="text-xs text-muted-foreground">Connect via Bluetooth</p>
                </div>
              </div>
              <Switch 
                id="bluetooth"
                checked={bluetoothEnabled}
                onCheckedChange={setBluetoothEnabled}
              />
            </div>
            
            {bluetoothEnabled && (
              <Button 
                variant="outline" 
                onClick={handleBluetoothScan}
                className="w-full"
              >
                Scan for Devices
              </Button>
            )}

            {/* WiFi Hotspot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Wifi className="w-5 h-5 text-signal-green" />
                <div>
                  <Label htmlFor="hotspot">WiFi Hotspot</Label>
                  <p className="text-xs text-muted-foreground">Create local network</p>
                </div>
              </div>
              <Switch 
                id="hotspot"
                checked={wifiHotspotEnabled}
                onCheckedChange={setWifiHotspotEnabled}
              />
            </div>
            
            {wifiHotspotEnabled && (
              <Button 
                variant="signal" 
                onClick={handleCreateHotspot}
                className="w-full"
              >
                Create Hotspot
              </Button>
            )}

            {/* Auto Connect */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-connect">Auto Connect</Label>
                <p className="text-xs text-muted-foreground">Automatically connect to known friends</p>
              </div>
              <Switch 
                id="auto-connect"
                checked={autoConnect}
                onCheckedChange={setAutoConnect}
              />
            </div>
          </div>
        </Card>

        {/* Audio Settings */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
            <Volume2 className="w-5 h-5 mr-2" />
            Audio
          </h2>
          
          <div className="space-y-6">
            {/* Volume */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Speaker Volume</Label>
                <span className="text-sm text-muted-foreground">{volume[0]}%</span>
              </div>
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* Microphone */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="flex items-center">
                  <Mic className="w-4 h-4 mr-2" />
                  Microphone Sensitivity
                </Label>
                <span className="text-sm text-muted-foreground">{micSensitivity[0]}%</span>
              </div>
              <Slider
                value={micSensitivity}
                onValueChange={setMicSensitivity}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          </div>
        </Card>

        {/* App Info */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
            <Info className="w-5 h-5 mr-2" />
            About
          </h2>
          
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>App Version:</strong> 1.0.0</p>
            <p><strong>Build:</strong> Beta</p>
            <p><strong>Connection Type:</strong> Peer-to-Peer</p>
            <p><strong>No Internet Required:</strong> ✓</p>
          </div>
        </Card>

        {/* Connection Guide */}
        <Card className="p-4 bg-primary/5 border-primary/20">
          <h3 className="font-semibold text-card-foreground mb-2">Quick Setup Guide</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>1. Enable Bluetooth or create WiFi hotspot</p>
            <p>2. Have friends connect to your network</p>
            <p>3. Add them to your friends list</p>
            <p>4. Start talking with the main button!</p>
          </div>
        </Card>
      </div>
    </div>
  );
};