import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Car, 
  MapPin, 
  NavigationArrow, 
  Clock, 
  CurrencyDollar,
  Star,
  Phone,
  User,
  CarSimple,
  Path,
  Lightning,
  Coins,
  CreditCard,
  Wallet,
} from '@phosphor-icons/react';
import {
  generateMockTaxiRides,
  generateMockFareEstimates,
  generateMockTaxidoConfig,
  getVehicleTypeName,
  getTaxiStatusName,
  getTaxiStatusColor,
  getPaymentMethodName,
  formatCurrency,
  formatTimeAgo,
} from '@/lib/mock-data';
import type { TaxiVehicleType, TaxiPaymentMethod } from '@/lib/types';

export function TaxidoBooking() {
  const [activeTab, setActiveTab] = useState('book');
  const [selectedVehicle, setSelectedVehicle] = useState<TaxiVehicleType>('comfort');
  const [selectedPayment, setSelectedPayment] = useState<TaxiPaymentMethod>('omni_token');
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  
  const rides = generateMockTaxiRides();
  const fareEstimates = generateMockFareEstimates();
  const config = generateMockTaxidoConfig();
  
  const currentRide = rides.find(r => r.status === 'in_progress');
  const completedRides = rides.filter(r => r.status === 'completed');
  const totalSpent = completedRides.reduce((sum, r) => sum + (r.actualFare || r.estimatedFare), 0);
  
  const selectedFare = fareEstimates.find(f => f.vehicleType === selectedVehicle);

  const getPaymentIcon = (method: TaxiPaymentMethod) => {
    switch (method) {
      case 'omni_token':
        return <Coins size={16} weight="duotone" />;
      case 'crypto':
        return <Wallet size={16} weight="duotone" />;
      case 'card':
        return <CreditCard size={16} weight="duotone" />;
      default:
        return <CurrencyDollar size={16} weight="duotone" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Car size={32} weight="duotone" className="text-primary" />
            Taxido 出行服务
          </h2>
          <p className="text-muted-foreground mt-1">
            使用加密货币或OMNI代币支付，享受便捷出行
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">总行程</p>
            <p className="text-2xl font-bold">{completedRides.length}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">总消费</p>
            <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
          </div>
          {config.omniTokenDiscount && (
            <Badge variant="secondary" className="gap-1">
              <Coins size={14} weight="duotone" />
              OMNI支付 {config.omniDiscountPercent}% 折扣
            </Badge>
          )}
        </div>
      </div>

      {/* Current ride alert */}
      {currentRide && (
        <Card className="border-primary bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-primary">
              <NavigationArrow size={20} weight="duotone" className="animate-pulse" />
              行程进行中
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={16} weight="duotone" className="text-green-600" />
                    <span>{currentRide.pickup.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <NavigationArrow size={16} weight="duotone" className="text-red-600" />
                    <span>{currentRide.dropoff.name}</span>
                  </div>
                </div>
                <div className="border-l pl-6">
                  <div className="flex items-center gap-2">
                    <User size={16} weight="duotone" />
                    <span className="font-medium">{currentRide.driver?.name}</span>
                    <Badge variant="outline" className="gap-1">
                      <Star size={12} weight="fill" className="text-yellow-500" />
                      {currentRide.driver?.rating}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {currentRide.driver?.vehicleModel} · {currentRide.driver?.vehiclePlate}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">预计剩余</p>
                <p className="text-xl font-bold">{currentRide.estimatedDuration} 分钟</p>
                <Button variant="outline" size="sm" className="mt-2 gap-1">
                  <Phone size={14} weight="duotone" />
                  联系司机
                </Button>
              </div>
            </div>
            <Progress value={65} className="mt-4" />
          </CardContent>
        </Card>
      )}

      {/* Main content tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="book" className="gap-2">
            <Car size={18} weight="duotone" />
            <span className="hidden sm:inline">立即叫车</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <Clock size={18} weight="duotone" />
            <span className="hidden sm:inline">行程记录</span>
          </TabsTrigger>
          <TabsTrigger value="saved" className="gap-2">
            <MapPin size={18} weight="duotone" />
            <span className="hidden sm:inline">常用地址</span>
          </TabsTrigger>
        </TabsList>

        {/* Book a ride */}
        <TabsContent value="book" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Location inputs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Path size={20} weight="duotone" />
                  设置路线
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MapPin size={16} weight="duotone" className="text-green-600" />
                    上车地点
                  </label>
                  <Input 
                    placeholder="输入上车地点或使用当前位置"
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                  />
                  <div className="flex gap-2">
                    {config.savedPickups.slice(0, 2).map((loc) => (
                      <Button 
                        key={loc.name} 
                        variant="outline" 
                        size="sm"
                        onClick={() => setPickupAddress(loc.address)}
                      >
                        {loc.name}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <NavigationArrow size={16} weight="duotone" className="text-red-600" />
                    目的地
                  </label>
                  <Input 
                    placeholder="输入目的地"
                    value={dropoffAddress}
                    onChange={(e) => setDropoffAddress(e.target.value)}
                  />
                  <div className="flex gap-2">
                    {config.savedDropoffs.slice(0, 2).map((loc) => (
                      <Button 
                        key={loc.name} 
                        variant="outline" 
                        size="sm"
                        onClick={() => setDropoffAddress(loc.address)}
                      >
                        {loc.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vehicle selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CarSimple size={20} weight="duotone" />
                  选择车型
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {fareEstimates.map((fare) => (
                  <div
                    key={fare.vehicleType}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedVehicle === fare.vehicleType 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:border-muted-foreground/50'
                    } ${!fare.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => fare.available && setSelectedVehicle(fare.vehicleType)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CarSimple size={24} weight="duotone" className="text-primary" />
                        <div>
                          <p className="font-medium">{fare.vehicleName}</p>
                          <p className="text-sm text-muted-foreground">
                            约 {fare.estimatedWait} 分钟到达
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(fare.estimatedFare)}</p>
                        <p className="text-sm text-muted-foreground">
                          {fare.estimatedDuration} 分钟
                        </p>
                      </div>
                    </div>
                    {!fare.available && (
                      <Badge variant="secondary" className="mt-2">暂无可用车辆</Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Payment selection and confirm */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet size={20} weight="duotone" />
                支付方式
              </CardTitle>
              <CardDescription>
                使用OMNI代币支付可享受 {config.omniDiscountPercent}% 折扣
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3 mb-6">
                {(['omni_token', 'crypto', 'alipay', 'wechat', 'card'] as TaxiPaymentMethod[]).map((method) => (
                  <Button
                    key={method}
                    variant={selectedPayment === method ? 'default' : 'outline'}
                    className="gap-2"
                    onClick={() => setSelectedPayment(method)}
                  >
                    {getPaymentIcon(method)}
                    {getPaymentMethodName(method)}
                    {method === 'omni_token' && (
                      <Badge variant="secondary" className="ml-1">-{config.omniDiscountPercent}%</Badge>
                    )}
                  </Button>
                ))}
              </div>

              {selectedFare && (
                <div className="bg-muted/50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">预估费用</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl font-bold">
                          {formatCurrency(
                            selectedPayment === 'omni_token' 
                              ? selectedFare.estimatedFare * (1 - config.omniDiscountPercent / 100)
                              : selectedFare.estimatedFare
                          )}
                        </span>
                        {selectedPayment === 'omni_token' && (
                          <Badge variant="outline" className="text-green-600">
                            节省 {formatCurrency(selectedFare.estimatedFare * config.omniDiscountPercent / 100)}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>里程: {selectedFare.distance} 公里</p>
                      <p>时长: 约 {selectedFare.estimatedDuration} 分钟</p>
                    </div>
                  </div>
                </div>
              )}

              <Button className="w-full gap-2" size="lg">
                <Lightning size={20} weight="duotone" />
                立即叫车
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ride history */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>行程记录</CardTitle>
              <CardDescription>查看您的历史行程</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {rides.map((ride) => (
                <div 
                  key={ride.id} 
                  className="p-4 border rounded-lg hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getTaxiStatusColor(ride.status)}>
                          {getTaxiStatusName(ride.status)}
                        </Badge>
                        <Badge variant="outline">{getVehicleTypeName(ride.vehicleType)}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatTimeAgo(ride.createdAt)}
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} weight="duotone" className="text-green-600" />
                          <span>{ride.pickup.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <NavigationArrow size={14} weight="duotone" className="text-red-600" />
                          <span>{ride.dropoff.name}</span>
                        </div>
                      </div>

                      {ride.driver && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <User size={14} weight="duotone" />
                          <span>{ride.driver.name}</span>
                          <Star size={14} weight="fill" className="text-yellow-500" />
                          <span>{ride.driver.rating}</span>
                        </div>
                      )}

                      {ride.userRating && (
                        <div className="flex items-center gap-1 mt-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={16} 
                              weight={i < ride.userRating! ? 'fill' : 'regular'}
                              className={i < ride.userRating! ? 'text-yellow-500' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-lg">
                        {formatCurrency(ride.actualFare || ride.estimatedFare)}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground justify-end">
                        {getPaymentIcon(ride.paymentMethod)}
                        <span>{getPaymentMethodName(ride.paymentMethod)}</span>
                      </div>
                      {ride.distance && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {ride.distance} 公里
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Saved locations */}
        <TabsContent value="saved" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin size={20} weight="duotone" className="text-green-600" />
                  常用上车点
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {config.savedPickups.map((loc) => (
                  <div key={loc.name} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <p className="font-medium">{loc.name}</p>
                    <p className="text-sm text-muted-foreground">{loc.address}</p>
                  </div>
                ))}
                <Button variant="outline" className="w-full gap-2">
                  <MapPin size={16} weight="duotone" />
                  添加新地址
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <NavigationArrow size={20} weight="duotone" className="text-red-600" />
                  常用目的地
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {config.savedDropoffs.map((loc) => (
                  <div key={loc.name} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <p className="font-medium">{loc.name}</p>
                    <p className="text-sm text-muted-foreground">{loc.address}</p>
                  </div>
                ))}
                <Button variant="outline" className="w-full gap-2">
                  <NavigationArrow size={16} weight="duotone" />
                  添加新地址
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
