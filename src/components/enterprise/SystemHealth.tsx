import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  CheckCircle, 
  Warning, 
  XCircle,
  CloudArrowUp,
  Database,
  ShieldCheck,
  Lightning
} from '@phosphor-icons/react';
import type { SystemHealthMetric } from '@/lib/types';
import { formatTimeAgo } from '@/lib/mock-data';

interface SystemHealthProps {
  metrics: SystemHealthMetric[];
}

export function SystemHealth({ metrics }: SystemHealthProps) {
  const healthyCount = metrics.filter(m => m.status === 'healthy').length;
  const degradedCount = metrics.filter(m => m.status === 'degraded').length;
  const downCount = metrics.filter(m => m.status === 'down').length;
  
  const overallStatus = downCount > 0 ? 'down' : degradedCount > 0 ? 'degraded' : 'healthy';
  const uptimePercentage = ((healthyCount + degradedCount * 0.5) / metrics.length) * 100;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'api': return <CloudArrowUp size={16} weight="duotone" className="text-blue-500" />;
      case 'blockchain': return <Database size={16} weight="duotone" className="text-purple-500" />;
      case 'security': return <ShieldCheck size={16} weight="duotone" className="text-green-500" />;
      case 'performance': return <Lightning size={16} weight="duotone" className="text-yellow-500" />;
      default: return <Activity size={16} weight="duotone" className="text-gray-500" />;
    }
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle size={20} weight="fill" className="text-green-500" />;
      case 'degraded': return <Warning size={20} weight="fill" className="text-yellow-500" />;
      case 'down': return <XCircle size={20} weight="fill" className="text-red-500" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': return <Badge className="bg-green-100 text-green-700">Healthy</Badge>;
      case 'degraded': return <Badge className="bg-yellow-100 text-yellow-700">Degraded</Badge>;
      case 'down': return <Badge className="bg-red-100 text-red-700">Down</Badge>;
      default: return null;
    }
  };

  const getProgressColor = (metric: SystemHealthMetric) => {
    const percentage = (metric.value / metric.threshold) * 100;
    if (metric.unit === '%') {
      // For percentage metrics like uptime, higher is better
      return percentage >= 99 ? 'bg-green-500' : percentage >= 95 ? 'bg-yellow-500' : 'bg-red-500';
    }
    // For latency metrics, lower is better
    return percentage <= 50 ? 'bg-green-500' : percentage <= 80 ? 'bg-yellow-500' : 'bg-red-500';
  };

  // Custom progress bar component for colored indicators
  const ColoredProgress = ({ value, colorClass }: { value: number; colorClass: string }) => (
    <div className="bg-muted relative h-2 w-full overflow-hidden rounded-full">
      <div 
        className={`h-full transition-all ${colorClass}`}
        style={{ width: `${Math.min(100, value)}%` }}
      />
    </div>
  );

  // Group metrics by category
  const groupedMetrics = metrics.reduce((acc, metric) => {
    if (!acc[metric.category]) {
      acc[metric.category] = [];
    }
    acc[metric.category].push(metric);
    return acc;
  }, {} as Record<string, SystemHealthMetric[]>);

  return (
    <div className="space-y-6">
      {/* Overall Status Header */}
      <Card className={`border-2 ${
        overallStatus === 'healthy' ? 'border-green-200 bg-green-50/50' :
        overallStatus === 'degraded' ? 'border-yellow-200 bg-yellow-50/50' :
        'border-red-200 bg-red-50/50'
      }`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIndicator(overallStatus)}
              <div>
                <CardTitle>System Status</CardTitle>
                <CardDescription>
                  {overallStatus === 'healthy' ? 'All systems operational' :
                   overallStatus === 'degraded' ? 'Some systems experiencing issues' :
                   'Critical systems are down'}
                </CardDescription>
              </div>
            </div>
            {getStatusBadge(overallStatus)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 pt-2">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{healthyCount}</div>
              <div className="text-xs text-muted-foreground">Healthy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{degradedCount}</div>
              <div className="text-xs text-muted-foreground">Degraded</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{downCount}</div>
              <div className="text-xs text-muted-foreground">Down</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{uptimePercentage.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Uptime</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics by Category */}
      <div className="grid gap-6 md:grid-cols-2">
        {Object.entries(groupedMetrics).map(([category, categoryMetrics]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 capitalize">
                {getCategoryIcon(category)}
                {category} Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {categoryMetrics.map((metric) => {
                const progressValue = metric.unit === '%' 
                  ? metric.value 
                  : Math.min(100, (metric.value / metric.threshold) * 100);
                
                return (
                  <div key={metric.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIndicator(metric.status)}
                        <span className="font-medium text-sm">{metric.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-sm font-medium">
                          {metric.value}{metric.unit}
                        </span>
                        <span className="text-xs text-muted-foreground ml-1">
                          / {metric.threshold}{metric.unit}
                        </span>
                      </div>
                    </div>
                    <ColoredProgress 
                      value={progressValue} 
                      colorClass={getProgressColor(metric)}
                    />
                    <div className="text-xs text-muted-foreground text-right">
                      Updated {formatTimeAgo(metric.lastUpdated)}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Status Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Activity size={20} weight="duotone" className="text-primary" />
            Service Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {metrics.map((metric) => (
              <div 
                key={metric.id}
                className={`p-3 rounded-lg border text-center ${
                  metric.status === 'healthy' ? 'bg-green-50 border-green-200' :
                  metric.status === 'degraded' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex justify-center mb-2">
                  {getStatusIndicator(metric.status)}
                </div>
                <div className="text-xs font-medium truncate" title={metric.name}>
                  {metric.name}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {metric.value}{metric.unit}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
