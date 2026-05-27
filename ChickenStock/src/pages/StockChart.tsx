import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries, type Time } from 'lightweight-charts';
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

interface StockChartProps {
  targetStock: string;
}

const StockChart: React.FC<StockChartProps> = ({ targetStock }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const container = chartContainerRef.current;

    const chart = createChart(container, {
      ...CHART_CONFIG,
      width: container.clientWidth || 600,
    });
    const candlestickSeries = chart.addSeries(CandlestickSeries, SERIES_CONFIG);

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) {
        chart.applyOptions({ width: entry.contentRect.width });
      }
    });
    resizeObserver.observe(container);

    let client: Client | null = null;

    // 타임스탬프를 1분 단위(혹은 원하는 단위)로 정규화하는 헬퍼 함수
    const getRoundedTime = (rawTime: number) => {
      // 1. 백엔드 time이 밀리초(ms)라면 초(s) 단위로 변경 (lightweight-charts는 초 단위를 사용합니다)
      // 만약 백엔드가 이미 초 단위로 보낸다면 / 1000 은 빼주세요.
      const timeInSeconds = Math.floor(rawTime / 1000); 
      
      // 2. 1분(60초) 단위로 내림하여 동일한 분 내에서는 같은 time 값을 가지게 함
      return (timeInSeconds - (timeInSeconds % 60)) as Time;
    };

    const fetchInitialData = async () => {
      try {
        // 하드코딩된 005930 대신 props로 받은 targetStock 사용
        const response = await fetch(`http://13.209.15.204:8080/api/stock/${targetStock}`);
        if (response.ok) {
          const data = await response.json();
          
          const initialCandle = {
            time: getRoundedTime(data.time),
            open: data.open,
            high: data.high,
            low: data.low,
            close: data.close,
          };
          
          candlestickSeries.setData([initialCandle]);
        }
      } catch (error) {
        console.error('초기 데이터 로딩 실패:', error);
      } finally {
        connectWebSocket();
      }
    };

    const connectWebSocket = () => {
      client = new Client({
        brokerURL: 'ws://13.209.15.204:8080/ws-stock',
        onConnect: () => {
          console.log('STOMP 연결 성공');
          // 여기도 props로 받은 targetStock 사용
          client?.subscribe(`/topic/stock/${targetStock}`, (message) => {
            const data = JSON.parse(message.body);
            
            const candle = {
              time: getRoundedTime(data.time), // 1분 단위로 고정된 시간값
              open: data.open,
              high: data.high,
              low: data.low,
              close: data.close,
            };
            
            // 동일한 time 값이 들어오면 기존 캔들의 종가/고가/저가가 실시간으로 갱신됩니다.
            candlestickSeries.update(candle);
          });
        },
        onDisconnect: () => console.log('STOMP 연결 종료'),
        onStompError: (frame) => console.error('STOMP 에러:', frame),
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