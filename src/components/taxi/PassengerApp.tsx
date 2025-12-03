import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Car, MapPin, Phone, Star, Clock, CurrencyDollar, 
  MapTrifold, User, ChatCircle, X, Check, Microphone
} from '@phosphor-icons/react';
import { toast } from 'sonner';

interface Driver {
  id: string;
  name: string;
  rating: number;
  car: string;
  plate: string;
  photo: string;
  distance: string;
  eta: string;
}

type RideStatus = 'idle' | 'searching' | 'matched' | 'arriving' | 'in_progress' | 'completed';

export function PassengerApp() {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [rideStatus, setRideStatus] = useState<RideStatus>('idle');
  const [driver, setDriver] = useState<Driver | null>(null);
  const [estimatedFare, setEstimatedFare] = useState('');
  const [isVoiceInput, setIsVoiceInput] = useState(false);

  const mockDriver: Driver = {
    id: 'driver-001',
    name: '王师傅',
    rating: 4.9,
    car: '丰田卡罗拉',
    plate: '京A·12345',
    photo: '',
    distance: '1.2公里',
    eta: '3分钟',
  };

  const searchRide = () => {
    if (!pickup || !destination) {
      toast.error('请输入上车地点和目的地');
      return;
    }

    setRideStatus('searching');
    setEstimatedFare('¥' + (Math.random() * 50 + 20).toFixed(2));
    
    // Simulate voice feedback
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('正在为您寻找附近的司机，请稍候');
      utterance.lang = 'zh-CN';
      window.speechSynthesis.speak(utterance);
    }

    // Simulate finding a driver
    setTimeout(() => {
      setDriver(mockDriver);
      setRideStatus('matched');
      toast.success('已为您匹配到司机！');
      
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(
          `已为您匹配到${mockDriver.name}，驾驶${mockDriver.car}，车牌号${mockDriver.plate}，预计${mockDriver.eta}到达`
        );
        utterance.lang = 'zh-CN';
        window.speechSynthesis.speak(utterance);
      }
    }, 3000);
  };

  const cancelRide = () => {
    setRideStatus('idle');
    setDriver(null);
    toast.info('已取消叫车');
  };

  const simulateDriverArrived = () => {
    setRideStatus('arriving');
    toast.success('司机已到达上车点！');
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('司机已到达您的上车地点，请尽快上车');
      utterance.lang = 'zh-CN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const startVoiceInput = (field: 'pickup' | 'destination') => {
    setIsVoiceInput(true);
    toast.info('请说出您的' + (field === 'pickup' ? '上车地点' : '目的地'));
    
    // Simulate voice recognition
    setTimeout(() => {
      const locations = [
        '北京市朝阳区建国门外大街1号',
        '北京西站',
        '中关村软件园',
        '国贸大厦',
        '首都机场T3航站楼',
      ];
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      
      if (field === 'pickup') {
        setPickup(randomLocation);
      } else {
        setDestination(randomLocation);
      }
      
      setIsVoiceInput(false);
      toast.success(`已识别：${randomLocation}`);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Car size={32} weight="duotone" className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">智能叫车</h2>
              <p className="text-muted-foreground">语音叫车 · 安全出行 · 便捷支付</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Form */}
      {rideStatus === 'idle' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapTrifold size={24} weight="duotone" />
              我要叫车
            </CardTitle>
            <CardDescription>输入地址或使用语音输入</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Pickup */}
            <div className="space-y-2">
              <label className="text-sm font-medium">上车地点</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-500" />
                  <Input
                    placeholder="请输入上车地点"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => startVoiceInput('pickup')}
                  className={isVoiceInput ? 'bg-red-100' : ''}
                >
                  <Microphone size={20} />
                </Button>
              </div>
            </div>

            {/* Destination */}
            <div className="space-y-2">
              <label className="text-sm font-medium">目的地</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500" />
                  <Input
                    placeholder="请输入目的地"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => startVoiceInput('destination')}
                >
                  <Microphone size={20} />
                </Button>
              </div>
            </div>

            {/* Quick Destinations */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => setDestination('首都机场T3')}>
                ✈️ 首都机场
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => setDestination('北京西站')}>
                🚄 北京西站
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => setDestination('国贸CBD')}>
                🏢 国贸CBD
              </Badge>
            </div>

            <Button onClick={searchRide} className="w-full gap-2" size="lg">
              <Car size={20} />
              呼叫快车
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Searching */}
      {rideStatus === 'searching' && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
              <Car size={40} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">正在为您寻找司机...</h3>
            <p className="text-muted-foreground mb-4">预计费用：{estimatedFare}</p>
            <Button variant="outline" onClick={cancelRide}>取消叫车</Button>
          </CardContent>
        </Card>
      )}

      {/* Driver Matched */}
      {(rideStatus === 'matched' || rideStatus === 'arriving') && driver && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Car size={24} weight="duotone" className="text-primary" />
                {rideStatus === 'matched' ? '司机正在赶来' : '司机已到达'}
              </span>
              <Badge variant={rideStatus === 'arriving' ? 'default' : 'secondary'}>
                {rideStatus === 'arriving' ? '请上车' : `预计${driver.eta}到达`}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Driver Info */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={28} className="text-primary" />
                </div>
                <div>
                  <p className="font-bold">{driver.name}</p>
                  <div className="flex items-center gap-1 text-sm">
                    <Star size={14} weight="fill" className="text-yellow-500" />
                    <span>{driver.rating}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{driver.car}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{driver.plate}</p>
                <p className="text-sm text-muted-foreground">距离{driver.distance}</p>
              </div>
            </div>

            {/* Route Summary */}
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm">{pickup}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-red-500" />
                <span className="text-sm">{destination}</span>
              </div>
              <div className="pt-2 border-t flex justify-between">
                <span className="text-muted-foreground">预计费用</span>
                <span className="font-bold text-green-600">{estimatedFare}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 gap-2">
                <Phone size={18} />
                联系司机
              </Button>
              <Button variant="outline" className="flex-1 gap-2">
                <ChatCircle size={18} />
                发消息
              </Button>
              <Button variant="destructive" size="icon" onClick={cancelRide}>
                <X size={18} />
              </Button>
            </div>

            {rideStatus === 'matched' && (
              <Button onClick={simulateDriverArrived} variant="outline" className="w-full">
                模拟：司机到达
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Trips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock size={24} weight="duotone" />
            最近行程
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: '今天 14:30', from: '中关村', to: '国贸', fare: '¥45.00' },
              { date: '昨天 09:15', from: '望京', to: '首都机场', fare: '¥89.00' },
              { date: '12月1日', from: '西单', to: '北京西站', fare: '¥32.00' },
            ].map((trip, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{trip.from} → {trip.to}</p>
                  <p className="text-sm text-muted-foreground">{trip.date}</p>
                </div>
                <span className="font-bold">{trip.fare}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
