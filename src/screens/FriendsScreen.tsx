import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserPlus, Signal, MessageCircle, Phone, Star, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Friend {
  id: string;
  friend_user_id: string;
  friend_display_name: string;
  connection_type: 'bluetooth' | 'wifi_direct' | 'both';
  is_favorite: boolean;
  last_connected: string | null;
  created_at: string;
}

export const FriendsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchFriends();
    }
  }, [user]);

  const fetchFriends = async () => {
    try {
      const { data, error } = await supabase
        .from('friends')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFriends((data || []) as Friend[]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load friends list.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (friendId: string, currentFavorite: boolean) => {
    try {
      const { error } = await supabase
        .from('friends')
        .update({ is_favorite: !currentFavorite })
        .eq('id', friendId);

      if (error) throw error;
      
      setFriends(prev => prev.map(friend => 
        friend.id === friendId 
          ? { ...friend, is_favorite: !currentFavorite }
          : friend
      ));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update favorite status.",
        variant: "destructive",
      });
    }
  };

  const filteredFriends = friends.filter(friend =>
    friend.friend_display_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onlineFriends = filteredFriends.filter(f => f.last_connected);
  const offlineFriends = filteredFriends.filter(f => !f.last_connected);

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

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading friends...</p>
          </div>
        ) : friends.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No friends added yet.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Connect with nearby devices to add friends!
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {/* Online Friends */}
            {onlineFriends.length > 0 && (
              <>
                <div className="flex items-center space-x-2">
                  <Signal className="w-4 h-4 text-signal-green" />
                  <h2 className="font-semibold text-foreground">Recently Connected</h2>
                  <span className="text-sm text-muted-foreground">
                    ({onlineFriends.length})
                  </span>
                </div>

                {onlineFriends.map(friend => (
                  <Card key={friend.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarFallback className="bg-primary/20 text-primary">
                              {friend.friend_display_name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-signal-green rounded-full border-2 border-card" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-card-foreground">{friend.friend_display_name}</p>
                            {friend.is_favorite && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                          </div>
                          <p className="text-sm text-signal-green">Recently connected</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleFavorite(friend.id, friend.is_favorite)}
                          className="touch-target"
                        >
                          <Star className={`w-4 h-4 ${friend.is_favorite ? 'text-yellow-500 fill-current' : ''}`} />
                        </Button>
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
              </>
            )}

            {/* Offline Friends */}
            {offlineFriends.length > 0 && (
              <>
                <div className="mt-6">
                  <h2 className="font-semibold text-muted-foreground mb-4">All Friends</h2>
                  {offlineFriends.map(friend => (
                    <Card key={friend.id} className="p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback className="bg-muted text-muted-foreground">
                              {friend.friend_display_name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium text-card-foreground">{friend.friend_display_name}</p>
                              {friend.is_favorite && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                            </div>
                            <p className="text-sm text-muted-foreground">Never connected</p>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleFavorite(friend.id, friend.is_favorite)}
                            className="touch-target"
                          >
                            <Star className={`w-4 h-4 ${friend.is_favorite ? 'text-yellow-500 fill-current' : ''}`} />
                          </Button>
                          <Button variant="ghost" size="icon" className="touch-target">
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};