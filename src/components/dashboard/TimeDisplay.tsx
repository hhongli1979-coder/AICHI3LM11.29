import { useState, useEffect } from 'react';
import { Clock } from '@phosphor-icons/react';

export function TimeDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short',
    });
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20">
      <Clock size={18} weight="duotone" className="text-accent" />
      <div className="text-sm">
        <div className="font-medium tabular-nums">{formatTime(currentTime)}</div>
        <div className="text-xs text-muted-foreground">{formatDate(currentTime)}</div>
      </div>
    </div>
  );
}
