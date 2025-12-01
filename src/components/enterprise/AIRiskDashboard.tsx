import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShieldCheck, 
  Warning, 
  Lightning, 
  Eye, 
  CheckCircle, 
  XCircle,
  Robot,
  ChartLine,
  ArrowRight
} from '@phosphor-icons/react';
import type { AIRiskAlert } from '@/lib/types';
import { formatTimeAgo, getRiskColor } from '@/lib/mock-data';
import { toast } from 'sonner';

interface AIRiskDashboardProps {
  alerts: AIRiskAlert[];
}

export function AIRiskDashboard({ alerts }: AIRiskDashboardProps) {
  const [localAlerts, setLocalAlerts] = useState(alerts);
  
  const activeAlerts = localAlerts.filter(a => a.status === 'active');
  const criticalCount = localAlerts.filter(a => a.severity === 'critical' && a.status === 'active').length;
  const highCount = localAlerts.filter(a => a.severity === 'high' && a.status === 'active').length;
  
  const overallRiskScore = Math.min(100, criticalCount * 40 + highCount * 20 + activeAlerts.length * 5);
  const riskLevel = overallRiskScore >= 70 ? 'critical' : overallRiskScore >= 40 ? 'high' : overallRiskScore >= 20 ? 'medium' : 'low';

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Warning size={16} weight="fill" className="text-red-500" />;
      case 'investigating': return <Eye size={16} weight="fill" className="text-yellow-500" />;
      case 'resolved': return <CheckCircle size={16} weight="fill" className="text-green-500" />;
      case 'dismissed': return <XCircle size={16} weight="fill" className="text-gray-500" />;
      default: return null;
    }
  };

  const handleResolveAlert = (alertId: string) => {
    setLocalAlerts(localAlerts.map(alert => 
      alert.id === alertId ? { ...alert, status: 'resolved', resolvedAt: Date.now() } : alert
    ));
    toast.success('Alert resolved', { description: 'The security alert has been marked as resolved.' });
  };

  const handleDismissAlert = (alertId: string) => {
    setLocalAlerts(localAlerts.map(alert => 
      alert.id === alertId ? { ...alert, status: 'dismissed' } : alert
    ));
    toast.info('Alert dismissed');
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-2 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Robot size={18} weight="duotone" className="text-primary" />
              AI Risk Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getRiskColor(riskLevel)}`}>
              {overallRiskScore}
            </div>
            <Progress 
              value={overallRiskScore} 
              className="h-2 mt-2" 
            />
            <p className="text-xs text-muted-foreground mt-1">
              {riskLevel.toUpperCase()} risk level
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Warning size={18} weight="duotone" className="text-red-500" />
              Critical Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{criticalCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires immediate action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Lightning size={18} weight="duotone" className="text-orange-500" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{activeAlerts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Pending review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ShieldCheck size={18} weight="duotone" className="text-green-500" />
              AI Confidence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {localAlerts.length > 0 
                ? Math.round(localAlerts.reduce((sum, a) => sum + a.aiConfidence, 0) / localAlerts.length)
                : 100}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Detection accuracy</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck size={24} weight="duotone" className="text-primary" />
                AI Risk Intelligence
              </CardTitle>
              <CardDescription>
                Real-time threat detection and anomaly analysis powered by machine learning
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <ChartLine size={16} weight="bold" />
              View Analytics
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" className="space-y-4">
            <TabsList>
              <TabsTrigger value="active" className="gap-2">
                Active
                {activeAlerts.length > 0 && (
                  <Badge variant="destructive" className="h-5 px-1.5">
                    {activeAlerts.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="investigating">Investigating</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
              <TabsTrigger value="all">All Alerts</TabsTrigger>
            </TabsList>

            {['active', 'investigating', 'resolved', 'all'].map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-4">
                {localAlerts
                  .filter(alert => tab === 'all' || alert.status === tab)
                  .map((alert) => (
                    <div
                      key={alert.id}
                      className={`border rounded-lg p-4 space-y-3 ${
                        alert.severity === 'critical' ? 'border-red-300 bg-red-50/50' :
                        alert.severity === 'high' ? 'border-orange-300 bg-orange-50/50' :
                        'bg-background'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getStatusIcon(alert.status)}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{alert.title}</span>
                              <Badge className={getSeverityColor(alert.severity)}>
                                {alert.severity.toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {alert.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {alert.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <div>{formatTimeAgo(alert.detectedAt)}</div>
                          <div className="flex items-center gap-1 mt-1">
                            <Robot size={12} />
                            <span>{alert.aiConfidence}% confidence</span>
                          </div>
                        </div>
                      </div>

                      {alert.affectedAssets.length > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Affected:</span>
                          {alert.affectedAssets.map((asset, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {asset}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-start gap-2">
                          <ArrowRight size={14} className="mt-0.5 text-primary" />
                          <div className="text-sm">
                            <span className="font-medium">AI Recommendation: </span>
                            {alert.recommendation}
                          </div>
                        </div>
                      </div>

                      {(alert.status === 'active' || alert.status === 'investigating') && (
                        <div className="flex gap-2 pt-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleResolveAlert(alert.id)}
                            className="gap-2"
                          >
                            <CheckCircle size={14} weight="bold" />
                            Mark Resolved
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDismissAlert(alert.id)}
                          >
                            Dismiss
                          </Button>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}

                {localAlerts.filter(alert => tab === 'all' || alert.status === tab).length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <ShieldCheck size={48} weight="duotone" className="mx-auto mb-4 text-green-500 opacity-50" />
                    <p>No {tab === 'all' ? '' : tab} alerts</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
