import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Car, MapPin, Phone, Star, Clock, CurrencyDollar, 
  NavigationArrow, CheckCircle, User, ChatCircle
} from '@phosphor-icons/react';
import { toast } from 'sonner';

interface RideRequest {
  id: string;
  passenger: {
    name: string;
    phone: string;
    rating: number;
  };
  pickup: string;
  destination: string;
  distance: string;
  estimatedFare: string;
  estimatedTime: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: number;
}

// Mock ride requests
const mockRides: RideRequest[] = [
  {
    id: 'ride-001',
    passenger: { name: '张先生', phone: '138****1234', rating: 4.8 },
    pickup: '北京市朝阳区建国门外大街1号',
    destination: '北京首都国际机场T3航站楼',
    distance: '28.5公里',
    estimatedFare: '¥89.00',
    estimatedTime: '45分钟',
    status: 'pending',
    createdAt: Date.now() - 30000,
  },
  {
    id: 'ride-002',
    passenger: { name: '李女士', phone: '139****5678', rating: 4.9 },
    pickup: '北京市海淀区中关村大街',
    destination: '北京市西城区金融街',
    distance: '12.3公里',
    estimatedFare: '¥45.00',
    estimatedTime: '25分钟',
    status: 'pending',
    createdAt: Date.now() - 60000,
  },
];

export function DriverApp() {
  const [isOnline, setIsOnline] = useState(true);
  const [currentRide, setCurrentRide] = useState<RideRequest | null>(null);
  const [rides, setRides] = useState<RideRequest[]>(mockRides);
  const [earnings, setEarnings] = useState({ today: 523.50, trips: 8 });

  const acceptRide = (ride: RideRequest) => {
    setCurrentRide({ ...ride, status: 'accepted' });
    setRides(rides.filter(r => r.id !== ride.id));
    toast.success('已接单！正在为您导航到乘客位置');
    
    // Simulate voice announcement
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        `已接单。乘客${ride.passenger.name}，上车地点：${ride.pickup}。正在为您规划路线。`
      );
      utterance.lang = 'zh-CN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const startRide = () => {
    if (currentRide) {
      setCurrentRide({ ...currentRide, status: 'in_progress' });
      toast.success('行程开始！正在导航到目的地');
      
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(
          `乘客已上车，开始行程。目的地：${currentRide.destination}。预计${currentRide.estimatedTime}到达。`
        );
        utterance.lang = 'zh-CN';
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const completeRide = () => {
    if (currentRide) {
      const fare = parseFloat(currentRide.estimatedFare.replace('¥', ''));
      setEarnings({
        today: earnings.today + fare,
        trips: earnings.trips + 1,
      });
      
      toast.success(`行程完成！收款 ${currentRide.estimatedFare}`);
      
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(
          `行程完成。本次收款${currentRide.estimatedFare}。感谢您的服务！`
        );
        utterance.lang = 'zh-CN';
        window.speechSynthesis.speak(utterance);
      }
      
      setCurrentRide(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Driver Status Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Car size={32} weight="duotone" className="text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">司机工作台</h2>
                <p className="text-muted-foreground">智能语音导航 · 自动收款</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">今日收入</p>
                <p className="text-2xl font-bold text-green-600">¥{earnings.today.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">{earnings.trips} 单</p>
              </div>
              <Button
                variant={isOnline ? 'default' : 'outline'}
                onClick={() => setIsOnline(!isOnline)}
                className="gap-2"
              >
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-gray-400'}`} />
                {isOnline ? '在线接单' : '离线'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Ride */}
      {currentRide && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <NavigationArrow size={24} weight="duotone" className="text-primary" />
              当前行程
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Passenger Info */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={24} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium">{currentRide.passenger.name}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star size={14} weight="fill" className="text-yellow-500" />
                    {currentRide.passenger.rating}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Phone size={20} />
                </Button>
                <Button variant="outline" size="icon">
                  <ChatCircle size={20} />
                </Button>
              </div>
            </div>

            {/* Route Info */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">上车地点</p>
                  <p className="font-medium">{currentRide.pickup}</p>
                </div>
              </div>
              <div className="ml-3 border-l-2 border-dashed h-6" />
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-1">
                  <MapPin size={14} weight="fill" className="text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">目的地</p>
                  <p className="font-medium">{currentRide.destination}</p>
                </div>
              </div>
            </div>

            {/* Trip Details */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">距离</p>
                <p className="font-bold">{currentRide.distance}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">预计时间</p>
                <p className="font-bold">{currentRide.estimatedTime}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">预计费用</p>
                <p className="font-bold text-green-600">{currentRide.estimatedFare}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {currentRide.status === 'accepted' && (
                <>
                  <Button variant="outline" className="flex-1 gap-2">
                    <NavigationArrow size={18} />
                    开始导航
                  </Button>
                  <Button onClick={startRide} className="flex-1 gap-2">
                    <CheckCircle size={18} />
                    乘客已上车
                  </Button>
                </>
              )}
              {currentRide.status === 'in_progress' && (
                <>
                  <Button variant="outline" className="flex-1 gap-2">
                    <NavigationArrow size={18} />
                    继续导航
                  </Button>
                  <Button onClick={completeRide} className="flex-1 gap-2 bg-green-600 hover:bg-green-700">
                    <CurrencyDollar size={18} />
                    完成并收款
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Rides */}
      {!currentRide && isOnline && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin size={24} weight="duotone" />
              附近订单
            </CardTitle>
            <CardDescription>系统智能推送最优订单</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {rides.map((ride) => (
              <div
                key={ride.id}
                className="p-4 border rounded-lg hover:border-primary transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <User size={20} className="text-muted-foreground" />
                    <span className="font-medium">{ride.passenger.name}</span>
                    <div className="flex items-center gap-1 text-sm">
                      <Star size={12} weight="fill" className="text-yellow-500" />
                      {ride.passenger.rating}
                    </div>
                  </div>
                  <Badge variant="secondary">
                    <Clock size={12} className="mr-1" />
                    {Math.floor((Date.now() - ride.createdAt) / 1000)}秒前
                  </Badge>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-muted-foreground truncate">{ride.pickup}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={12} className="text-red-500" />
                    <span className="truncate">{ride.destination}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{ride.distance}</span>
                    <span>{ride.estimatedTime}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-green-600">{ride.estimatedFare}</span>
                    <Button onClick={() => acceptRide(ride)} className="gap-2">
                      <CheckCircle size={18} />
                      接单
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {rides.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Car size={48} className="mx-auto mb-4 opacity-50" />
                <p>暂无新订单</p>
                <p className="text-sm">系统正在为您匹配最优订单...</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
