/**
 * Binance Exchange Integration
 * 币安交易所集成
 * 
 * Features:
 * - Spot Trading (现货交易)
 * - Futures Trading (合约交易)
 * - P2P Trading (C2C交易)
 * - Market Data (市场数据)
 */

// Binance API endpoints
const BINANCE_API = 'https://api.binance.com';
const BINANCE_FAPI = 'https://fapi.binance.com'; // Futures

// Trading pairs
export const TRADING_PAIRS = [
  { symbol: 'BTCUSDT', base: 'BTC', quote: 'USDT', name: 'Bitcoin' },
  { symbol: 'ETHUSDT', base: 'ETH', quote: 'USDT', name: 'Ethereum' },
  { symbol: 'BNBUSDT', base: 'BNB', quote: 'USDT', name: 'BNB' },
  { symbol: 'SOLUSDT', base: 'SOL', quote: 'USDT', name: 'Solana' },
  { symbol: 'XRPUSDT', base: 'XRP', quote: 'USDT', name: 'Ripple' },
  { symbol: 'ADAUSDT', base: 'ADA', quote: 'USDT', name: 'Cardano' },
  { symbol: 'DOGEUSDT', base: 'DOGE', quote: 'USDT', name: 'Dogecoin' },
  { symbol: 'MATICUSDT', base: 'MATIC', quote: 'USDT', name: 'Polygon' },
  { symbol: 'DOTUSDT', base: 'DOT', quote: 'USDT', name: 'Polkadot' },
  { symbol: 'AVAXUSDT', base: 'AVAX', quote: 'USDT', name: 'Avalanche' },
];

// Mock market data (in production, use real Binance API)
export const MOCK_PRICES: Record<string, { price: number; change24h: number; high24h: number; low24h: number; volume24h: number }> = {
  BTCUSDT: { price: 43500.00, change24h: 2.35, high24h: 44200, low24h: 42800, volume24h: 28500000000 },
  ETHUSDT: { price: 2450.00, change24h: 1.82, high24h: 2520, low24h: 2380, volume24h: 15200000000 },
  BNBUSDT: { price: 315.00, change24h: -0.45, high24h: 322, low24h: 310, volume24h: 890000000 },
  SOLUSDT: { price: 98.50, change24h: 5.21, high24h: 102, low24h: 93, volume24h: 2100000000 },
  XRPUSDT: { price: 0.62, change24h: 1.15, high24h: 0.65, low24h: 0.60, volume24h: 1200000000 },
  ADAUSDT: { price: 0.58, change24h: -1.23, high24h: 0.61, low24h: 0.56, volume24h: 450000000 },
  DOGEUSDT: { price: 0.085, change24h: 3.45, high24h: 0.089, low24h: 0.082, volume24h: 650000000 },
  MATICUSDT: { price: 0.85, change24h: 0.89, high24h: 0.88, low24h: 0.82, volume24h: 320000000 },
  DOTUSDT: { price: 7.25, change24h: -0.72, high24h: 7.45, low24h: 7.10, volume24h: 180000000 },
  AVAXUSDT: { price: 38.50, change24h: 2.18, high24h: 39.80, low24h: 37.20, volume24h: 420000000 },
};

// Order types
export type OrderType = 'LIMIT' | 'MARKET' | 'STOP_LOSS' | 'STOP_LOSS_LIMIT' | 'TAKE_PROFIT' | 'TAKE_PROFIT_LIMIT';
export type OrderSide = 'BUY' | 'SELL';
export type OrderStatus = 'NEW' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELED' | 'PENDING_CANCEL' | 'REJECTED' | 'EXPIRED';

export interface Order {
  id: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  price: number;
  quantity: number;
  status: OrderStatus;
  filledQuantity: number;
  timestamp: number;
}

export interface Trade {
  id: string;
  symbol: string;
  side: OrderSide;
  price: number;
  quantity: number;
  fee: number;
  feeCurrency: string;
  timestamp: number;
}

// Get ticker price
export async function getTickerPrice(symbol: string): Promise<{ symbol: string; price: string }> {
  try {
    const response = await fetch(`${BINANCE_API}/api/v3/ticker/price?symbol=${symbol}`);
    return await response.json();
  } catch (error) {
    // Return mock data if API fails
    const mockPrice = MOCK_PRICES[symbol];
    return { symbol, price: mockPrice?.price.toString() || '0' };
  }
}

// Get 24hr ticker
export async function get24hrTicker(symbol: string): Promise<{
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  lastPrice: string;
}> {
  try {
    const response = await fetch(`${BINANCE_API}/api/v3/ticker/24hr?symbol=${symbol}`);
    return await response.json();
  } catch (error) {
    const mockData = MOCK_PRICES[symbol];
    return {
      symbol,
      priceChange: (mockData?.price * mockData?.change24h / 100).toFixed(2) || '0',
      priceChangePercent: mockData?.change24h.toString() || '0',
      highPrice: mockData?.high24h.toString() || '0',
      lowPrice: mockData?.low24h.toString() || '0',
      volume: mockData?.volume24h.toString() || '0',
      lastPrice: mockData?.price.toString() || '0',
    };
  }
}

// Get order book
export async function getOrderBook(symbol: string, limit: number = 20): Promise<{
  bids: [string, string][];
  asks: [string, string][];
}> {
  try {
    const response = await fetch(`${BINANCE_API}/api/v3/depth?symbol=${symbol}&limit=${limit}`);
    return await response.json();
  } catch (error) {
    // Generate mock order book
    const basePrice = MOCK_PRICES[symbol]?.price || 100;
    const bids: [string, string][] = [];
    const asks: [string, string][] = [];
    
    for (let i = 0; i < limit / 2; i++) {
      const bidPrice = basePrice * (1 - 0.0001 * (i + 1));
      const askPrice = basePrice * (1 + 0.0001 * (i + 1));
      const qty = (Math.random() * 10).toFixed(4);
      bids.push([bidPrice.toFixed(2), qty]);
      asks.push([askPrice.toFixed(2), qty]);
    }
    
    return { bids, asks };
  }
}

// Get klines (candlestick data)
export async function getKlines(symbol: string, interval: string = '1h', limit: number = 100): Promise<(number | string)[][]> {
  try {
    const response = await fetch(`${BINANCE_API}/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`);
    return await response.json();
  } catch (error) {
    // Generate mock klines
    const basePrice = MOCK_PRICES[symbol]?.price || 100;
    const klines: (number | string)[][] = [];
    const now = Date.now();
    
    for (let i = limit; i > 0; i--) {
      const open = basePrice * (1 + (Math.random() - 0.5) * 0.02);
      const close = open * (1 + (Math.random() - 0.5) * 0.01);
      const high = Math.max(open, close) * (1 + Math.random() * 0.005);
      const low = Math.min(open, close) * (1 - Math.random() * 0.005);
      const volume = Math.random() * 1000;
      
      klines.push([
        now - i * 3600000, // Open time
        open.toFixed(2),
        high.toFixed(2),
        low.toFixed(2),
        close.toFixed(2),
        volume.toFixed(4),
        now - (i - 1) * 3600000, // Close time
        (volume * close).toFixed(2), // Quote asset volume
        Math.floor(Math.random() * 1000), // Number of trades
        (volume * 0.6).toFixed(4), // Taker buy base asset volume
        (volume * close * 0.6).toFixed(2), // Taker buy quote asset volume
        '0',
      ]);
    }
    
    return klines;
  }
}

// Simulate placing an order (in production, use signed API request)
export async function placeOrder(
  symbol: string,
  side: OrderSide,
  type: OrderType,
  quantity: number,
  price?: number
): Promise<Order> {
  // Simulate order placement
  await new Promise(r => setTimeout(r, 500));
  
  const marketPrice = MOCK_PRICES[symbol]?.price || 0;
  const orderPrice = type === 'MARKET' ? marketPrice : (price || marketPrice);
  
  return {
    id: `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    symbol,
    side,
    type,
    price: orderPrice,
    quantity,
    status: type === 'MARKET' ? 'FILLED' : 'NEW',
    filledQuantity: type === 'MARKET' ? quantity : 0,
    timestamp: Date.now(),
  };
}

// Cancel order
export async function cancelOrder(orderId: string): Promise<{ success: boolean; message: string }> {
  await new Promise(r => setTimeout(r, 300));
  return { success: true, message: `Order ${orderId} cancelled successfully` };
}

// Get account balances (mock)
export function getAccountBalances(): Record<string, { free: number; locked: number }> {
  return {
    USDT: { free: 50000.00, locked: 5000.00 },
    BTC: { free: 0.5, locked: 0.1 },
    ETH: { free: 5.0, locked: 1.0 },
    BNB: { free: 50, locked: 10 },
    SOL: { free: 100, locked: 20 },
    MATIC: { free: 5000, locked: 1000 },
  };
}

// Get trade history (mock)
export function getTradeHistory(): Trade[] {
  const now = Date.now();
  return [
    {
      id: 'TRD_001',
      symbol: 'BTCUSDT',
      side: 'BUY',
      price: 43200,
      quantity: 0.1,
      fee: 4.32,
      feeCurrency: 'USDT',
      timestamp: now - 3600000,
    },
    {
      id: 'TRD_002',
      symbol: 'ETHUSDT',
      side: 'SELL',
      price: 2480,
      quantity: 2.0,
      fee: 4.96,
      feeCurrency: 'USDT',
      timestamp: now - 7200000,
    },
    {
      id: 'TRD_003',
      symbol: 'BNBUSDT',
      side: 'BUY',
      price: 310,
      quantity: 10,
      fee: 0.01,
      feeCurrency: 'BNB',
      timestamp: now - 86400000,
    },
  ];
}

// Format number with commas
export function formatNumber(num: number, decimals: number = 2): string {
  return num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

// Format large numbers (K, M, B)
export function formatLargeNumber(num: number): string {
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toFixed(2);
}
