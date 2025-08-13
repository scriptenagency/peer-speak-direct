import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserPlus, Signal, MessageCircle, Phone } from 'lucide-react';
import { useState } from 'react';

interface Friend {
  id: string;
  name: string;
  isOnline: boolean;
  lastSeen: string;
  avatar?: string;
}

export const FriendsScreen = () => {
  const [friends] = useState<Friend[]>([
    { id: '1', name: 'Alex Trail', isOnline: true, lastSeen: 'now' },
    { id: '2', name: 'Sarah Mountain', isOnline: true, lastSeen: '2 min ago' },
    { id: '3', name: 'Mike Explorer', isOnline: false, lastSeen: '1 hour ago' },
    { id: '4', name: 'Lisa Adventure', isOnline: false, lastSeen: 'yesterday' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddFriend, setShowAddFriend] = useState(false);

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-foreground">Friends</h1>
          <Button
            variant="signal"
            size="icon"
            onClick={() => setShowAddFriend(true)}
            className="touch-target"
          >
            <UserPlus className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Search */}
        <Input
          placeholder="Search friends..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-input/50"
        />
      </div>

      {/* Online Friends */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          <div className="flex items-center space-x-2">
            <Signal className="w-4 h-4 text-signal-green" />
            <h2 className="font-semibold text-foreground">Online Now</h2>
            <span className="text-sm text-muted-foreground">
              ({filteredFriends.filter(f => f.isOnline).length})
            </span>
          </div>

          {filteredFriends.filter(friend => friend.isOnline).map(friend => (
            <Card key={friend.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {friend.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-signal-green rounded-full border-2 border-card" />
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground">{friend.name}</p>
                    <p className="text-sm text-signal-green">Online {friend.lastSeen}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" className="touch-target">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                  <Button variant="connect" size="icon" className="touch-target">
                    <Phone className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {/* Offline Friends */}
          <div className="mt-6">
            <h2 className="font-semibold text-muted-foreground mb-4">Offline</h2>
            {filteredFriends.filter(friend => !friend.isOnline).map(friend => (
              <Card key={friend.id} className="p-4 opacity-75">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-muted text-muted-foreground">
                        {friend.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-card-foreground">{friend.name}</p>
                      <p className="text-sm text-muted-foreground">Last seen {friend.lastSeen}</p>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="icon" className="touch-target">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};