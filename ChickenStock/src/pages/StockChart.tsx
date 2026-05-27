import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';
import { Client } from '@stomp/stompjs';

const CHART_CONFIG = {
  height: 400,
  layout: {
    background: { type: ColorType.Solid, color: '#ffffff' },
    textColor: '#333',
  },
  grid: {
    vertLines: { color: '#f0f3fa' },
    horzLines: { color: '#f0f3fa' },
  },
} as const;

const SERIES_CONFIG = {
  upColor: '#ef5350',
  downColor: '#26a69a',
  borderVisible: false,
  wickUpColor: '#ef5350',
  wickDownColor: '#26a69a',
} as const;

interface StockChartProps{
  targetStock: string;
}

const StockChart: React.FC<StockChartProps> = ({targetStock}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const container = chartContainerRef.current;

    const chart = createChart(container, {
      ...CHART_CONFIG,
      width: container.clientWidth || 600,
    });
    const candlestickSeries = chart.addSeries(CandlestickSeries, SERIES_CONFIG);
    candlestickSeries.setData([]);

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) {
        chart.applyOptions({ width: entry.contentRect.width });
      }
    });
    resizeObserver.observe(container);

   // 웹소켓 클라이언트 변수를 상단에 선언하여 클린업 함수에서 접근할 수 있도록 함
    let client: Client | null = null;

    // 1. 초기 데이터 로드 (REST API)
    const fetchInitialData = async () => {
      try {
        // targetStock 동적 바인딩 및 환경변수 URL 사용
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stock/${targetStock}`);
        if (response.ok) {
          const data = await response.json();
          
          const initialCandle = {
            time: data.time,
            open: data.open,
            high: data.high,
            low: data.low,
            close: data.close,
          };
          
          candlestickSeries.setData([initialCandle] as any);
        }
      } catch (error) {
        console.error('초기 데이터 로딩 실패:', error);
      } finally {
        connectWebSocket();
      }
    };

    // 3. 웹소켓 연결 로직 (함수로 분리)
    const connectWebSocket = () => {
      client = new Client({
        brokerURL: import.meta.env.VITE_WS_BASE_URL,
        onConnect: () => {
          console.log('STOMP 연결 성공');
          // targetStock 동적 바인딩
          client?.subscribe(`/topic/stock/${targetStock}`, (message) => {
            const data = JSON.parse(message.body);
            const candle = {
              time: data.time,
              open: data.open,
              high: data.high,
              low: data.low,
              close: data.close,
            };
            candlestickSeries.update(candle as any);
          });
        },
        onDisconnect: () => console.log('STOMP 연결 종료'),
        onStompError: (frame) => console.error('STOMP 에러:', frame),
      });
      client.activate();
    };

    // 로직 실행 (fetch -> 완료 시 connectWebSocket 실행)
    fetchInitialData();

    return () => {
      resizeObserver.disconnect();
      if (client)client.deactivate();
      chart.remove();
    };
  }, [targetStock]);

  return <div ref={chartContainerRef} style={{ width: '100%', minHeight: '400px' }} />;
};

export default StockChart;