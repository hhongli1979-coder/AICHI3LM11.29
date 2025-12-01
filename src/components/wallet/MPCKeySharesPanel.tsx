import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  ShieldCheck, 
  Key, 
  DeviceMobile, 
  Cloud, 
  Desktop, 
  Clock, 
  ArrowsClockwise,
  Plus,
  Warning
} from '@phosphor-icons/react';
import type { Wallet, MPCKeyShare } from '@/lib/types';
import { formatTimeAgo } from '@/lib/mock-data';

interface MPCKeySharesPanelProps {
  wallet: Wallet;
}

export function MPCKeySharesPanel({ wallet }: MPCKeySharesPanelProps) {
  if (wallet.type !== 'mpc' || !wallet.mpcConfig) {
    return null;
  }

  const { mpcConfig } = wallet;
  const activeShares = mpcConfig.keyShares.filter(s => s.status === 'active').length;
  const thresholdProgress = (activeShares / mpcConfig.threshold) * 100;

  const getDeviceIcon = (type: MPCKeyShare['deviceType']) => {
    switch (type) {
      case 'mobile': return <DeviceMobile size={18} weight="duotone" />;
      case 'hardware': return <Key size={18} weight="duotone" />;
      case 'cloud': return <Cloud size={18} weight="duotone" />;
      case 'server': return <Desktop size={18} weight="duotone" />;
    }
  };

  const getStatusColor = (status: MPCKeyShare['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-300';
      case 'backup': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'revoked': return 'bg-red-100 text-red-700 border-red-300';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck size={20} weight="bold" className="text-violet-600" />
              MPC Key Shares
            </CardTitle>
            <CardDescription>
              Distributed key management for {wallet.name}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="bg-violet-100 text-violet-700">
            {mpcConfig.threshold}/{mpcConfig.totalShares} Threshold
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Threshold Status */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Signing Capability</span>
            <span className="font-medium">
              {activeShares >= mpcConfig.threshold ? (
                <span className="text-green-600">Ready</span>
              ) : (
                <span className="text-yellow-600">
                  {mpcConfig.threshold - activeShares} more share(s) needed
                </span>
              )}
            </span>
          </div>
          <Progress value={thresholdProgress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{activeShares} active shares</span>
            <span>{mpcConfig.threshold} required</span>
          </div>
        </div>

        <Separator />

        {/* Key Shares List */}
        <div className="space-y-3">
          <div className="text-sm font-medium">Key Share Parties</div>
          {mpcConfig.keyShares.map((share) => (
            <div
              key={share.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                  {getDeviceIcon(share.deviceType)}
                </div>
                <div>
                  <div className="font-medium text-sm">{share.partyName}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <span className="capitalize">{share.deviceType}</span>
                    {share.lastUsed && (
                      <>
                        <span>•</span>
                        <Clock size={12} />
                        <span>Last used {formatTimeAgo(share.lastUsed)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <Badge variant="outline" className={getStatusColor(share.status)}>
                {share.status}
              </Badge>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 gap-2">
            <Plus size={16} weight="bold" />
            Add Share
          </Button>
          <Button variant="outline" size="sm" className="flex-1 gap-2">
            <ArrowsClockwise size={16} weight="bold" />
            Rotate Keys
          </Button>
        </div>

        {/* Security Info */}
        <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
          <div className="text-sm font-medium flex items-center gap-2">
            <ShieldCheck size={16} weight="bold" className="text-green-600" />
            Security Status
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Recovery</span>
              <Badge variant={mpcConfig.recoveryEnabled ? "default" : "secondary"}>
                {mpcConfig.recoveryEnabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Backup Shares</span>
              <span className="font-medium">{mpcConfig.backupShares}</span>
            </div>
            {mpcConfig.lastKeyRotation && (
              <div className="col-span-2 flex items-center justify-between">
                <span className="text-muted-foreground">Last Key Rotation</span>
                <span className="font-medium">{formatTimeAgo(mpcConfig.lastKeyRotation)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Warning if threshold not met */}
        {activeShares < mpcConfig.threshold && (
          <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
            <Warning size={18} weight="bold" className="mt-0.5" />
            <div className="text-sm">
              <div className="font-medium">Insufficient Active Shares</div>
              <div className="text-yellow-700">
                You need at least {mpcConfig.threshold} active key shares to sign transactions.
                Currently {activeShares} of {mpcConfig.threshold} shares are active.
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
