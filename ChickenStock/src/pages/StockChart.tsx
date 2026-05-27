import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries, type Time } from 'lightweight-charts';
import { Client } from '@stomp/stompjs';

const CHART_CONFIG = {
  height: 400,
  layout: { background: { type: ColorType.Solid, color: '#ffffff' }, textColor: '#333' },
  grid: { vertLines: { color: '#f0f3fa' }, horzLines: { color: '#f0f3fa' } },
} as const;

const SERIES_CONFIG = {
  upColor: '#ef5350', downColor: '#26a69a', borderVisible: false,
  wickUpColor: '#ef5350', wickDownColor: '#26a69a',
} as const;

interface StockChartProps { targetStock: string; }

const StockChart: React.FC<StockChartProps> = ({ targetStock }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const container = chartContainerRef.current;
    const chart = createChart(container, { ...CHART_CONFIG, width: container.clientWidth || 600 });
    const candlestickSeries = chart.addSeries(CandlestickSeries, SERIES_CONFIG);

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) chart.applyOptions({ width: entry.contentRect.width });
    });
    resizeObserver.observe(container);

    let client: Client | null = null;

    // 💡 1. 밀리초(/1000) 나누기 제거 (백엔드가 이미 초 단위로 전송함)
    const getRoundedTime = (rawTime: number) => {
      return (rawTime - (rawTime % 60)) as Time;
    };

    const fetchInitialData = async () => {
      try {
        // 💡 2. URL 환경변수 사용
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stock/${targetStock}`);
        if (response.ok) {
          const data = await response.json();
          candlestickSeries.setData([{
            time: getRoundedTime(data.time),
            open: data.open, high: data.high, low: data.low, close: data.close,
          }]);
        }
      } catch (error) {
        console.error('초기 데이터 로딩 실패:', error);
      } finally {
        connectWebSocket();
      }
    };

    const connectWebSocket = () => {
      client = new Client({
        // 💡 3. WebSocket URL 환경변수 사용
        brokerURL: import.meta.env.VITE_WS_BASE_URL,
        onConnect: () => {
          client?.subscribe(`/topic/stock/${targetStock}`, (message) => {
            const data = JSON.parse(message.body);
            candlestickSeries.update({
              time: getRoundedTime(data.time),
              open: data.open, high: data.high, low: data.low, close: data.close,
            });
          });
        }
      });
      client.activate();
    };

    fetchInitialData();

    return () => {
      resizeObserver.disconnect();
      if (client) client.deactivate();
      chart.remove();
    };
  }, [targetStock]);

  return <div ref={chartContainerRef} style={{ width: '100%', minHeight: '400px' }} />;
};

export default StockChart;