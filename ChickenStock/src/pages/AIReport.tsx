import React from 'react';
import type { AnalysisResponse } from './mainboard'; // mainboard에서 타입 가져오기

interface AIReportProps {
  data: AnalysisResponse;
}

const CircularProgress = ({ score }: { score: number }) => {
  const isPositive = score > 50; // 보통 기술적 지표는 0~100 스케일인 경우가 많아 임의 기준 적용 (필요시 수정)
  const isZero = score === 50;
  
  // Toss Colors
  const mainColor = isPositive ? '#f04452' : isZero ? '#8b95a1' : '#3182f6';
  const bgColor = isPositive ? '#fee9eb' : isZero ? '#f2f4f6' : '#e8f3ff';
  
  // 백분율 계산 (0 ~ 1) - 스케일이 -10~10 이라면 이 부분을 수정해야 합니다. 
  // 여기서는 0~100 스케일로 가정하고 진행합니다.
  const percentage = Math.min(Math.max(score, 0) / 100, 1);
  
  const size = 90;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - percentage * circumference;

  return (
    <div style={{ position: 'relative', width: `${size}px`, height: `${size}px`, marginBottom: '16px' }}>
      <svg width={`${size}px`} height={`${size}px`} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
        <circle 
          cx={size/2} cy={size/2} r={radius} 
          fill="transparent" 
          stroke={bgColor} 
          strokeWidth={strokeWidth} 
        />
        <circle 
          cx={size/2} cy={size/2} r={radius} 
          fill="transparent" 
          stroke={mainColor} 
          strokeWidth={strokeWidth} 
          strokeDasharray={circumference} 
          strokeDashoffset={strokeDashoffset} 
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div style={{ 
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <span style={{ fontSize: '1.4rem', fontWeight: 900, color: mainColor }}>
          {score}
        </span>
      </div>
    </div>
  );
};

export default function AIReport({ data }: AIReportProps) {
  // 종합 의견 배지 색상
  const getRecStyles = () => {
    if (data.label?.includes('매수')) {
      return { 
        gradient: 'linear-gradient(135deg, #fff3f4 0%, #ffe1e4 100%)', 
        color: '#f04452',
        shadow: '0 12px 24px rgba(240, 68, 82, 0.2)'
      };
    } else if (data.label?.includes('매도')) {
      return { 
        gradient: 'linear-gradient(135deg, #f0f7ff 0%, #d8ebff 100%)', 
        color: '#3182f6',
        shadow: '0 12px 24px rgba(49, 130, 246, 0.2)'
      };
    }
    return {
      gradient: 'linear-gradient(135deg, #f9fafb 0%, #f2f4f6 100%)', 
      color: '#4e5968',
      shadow: '0 12px 24px rgba(78, 89, 104, 0.1)'
    };
  };

  const recStyle = getRecStyles();

  // 백엔드의 axis_scores (Map)를 배열 형태로 변환
  const factorKeys = data.axis_scores ? Object.keys(data.axis_scores) : [];

  return (
    <div style={{ width: '100%', height: '100%', padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* 메인 추천 배지 */}
      <div style={{ 
        background: recStyle.gradient,
        borderRadius: '24px', 
        padding: '24px 60px',
        marginBottom: '40px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        boxShadow: recStyle.shadow,
        border: '1px solid rgba(255,255,255,0.5)'
      }}>
        <div style={{ fontSize: '1rem', fontWeight: 700, color: recStyle.color, opacity: 0.8, marginBottom: '4px', letterSpacing: '-0.3px' }}>
          AI 종합 분석 의견
        </div>
        <h2 style={{ fontSize: '3rem', fontWeight: 900, color: recStyle.color, margin: 0, letterSpacing: '-1px' }}>
          {data.label || '분석중'}
        </h2>
      </div>

      {/* 하단 분석 지표 카드 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', 
        gap: '16px', 
        width: '100%' 
      }}>
        {factorKeys.map((key) => {
          const score = data.axis_scores[key];
          
          return (
            <div key={key} style={{ 
              background: '#ffffff',
              borderRadius: '20px',
              padding: '20px 16px',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.04)',
              border: '1px solid rgba(0,0,0,0.02)',
            }}>
              {/* 지표 이름 (예: RSI 지표, MACD 흐름) */}
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#8b95a1', marginBottom: '16px', textAlign: 'center', wordBreak: 'keep-all' }}>
                {key}
              </div>

              {/* 점수 기반 원형 그래프 */}
              <CircularProgress score={score} />
            </div>
          );
        })}
      </div>
    </div>
  );
}