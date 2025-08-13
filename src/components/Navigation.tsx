import { MessageCircle, Users, Settings, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activeTab: 'talk' | 'friends' | 'messages' | 'settings';
  onTabChange: (tab: 'talk' | 'friends' | 'messages' | 'settings') => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const tabs = [
    { id: 'talk' as const, icon: Radio, label: 'Talk' },
    { id: 'friends' as const, icon: Users, label: 'Friends' },
    { id: 'messages' as const, icon: MessageCircle, label: 'Messages' },
    { id: 'settings' as const, icon: Settings, label: 'Settings' }
  ];

  return (
    <nav className="flex justify-around items-center p-4 bg-card border-t border-border">
      {tabs.map(({ id, icon: Icon, label }) => (
        <Button
          key={id}
          variant="ghost"
          size="sm"
          onClick={() => onTabChange(id)}
          className={cn(
            "flex flex-col items-center space-y-1 p-2 touch-target",
            "text-muted-foreground hover:text-foreground transition-colors",
            activeTab === id && "text-primary bg-primary/10"
          )}
        >
          <Icon className="w-5 h-5" />
          <span className="text-xs font-medium">{label}</span>
        </Button>
      ))}
    </nav>
  );
};