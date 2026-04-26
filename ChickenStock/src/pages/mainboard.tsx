import React, { useState } from 'react';
import StockChart from './StockChart';
import AIReport from './AIReport';

// MainBoard 컴포넌트가 부모로부터 받을 데이터(Props)의 타입을 정의
interface MainBoardProps {
  stockName: string;   // 종목명 (예: "삼성전자", "Apple Inc.")
  changeRate: string;  // 등락률 (예: "-5.29%", "+1.2%")
}

// 부모가 전달해준 props를 괄호 안에서 구조 분해 할당으로 꺼내옵니다.
export default function MainBoard({ stockName, changeRate }: MainBoardProps) {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const targetStock = "005930"; // 임시 타겟 주식 코드

  const handleGenerateReport = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch(`http://13.209.15.204:8080/api/analysis/${targetStock}`);

      if(!response.ok){
        throw new Error('서버에서 데이터를 가져오지 못했습니다.');
      }

      const data = await response.json();
      
      setAnalysisData(data);
    } catch (error) {
      console.error("AI 리포트 생성 실패:", error);
      alert("AI 분석 리포트를 불러오는데 실패했습니다.");
    } finally {
      setIsAnalyzing(false);
    }
  };
  return (
    <div className="main-board">
      {/* 좌측: 주식 차트 영역 */}
      <section className="board-section">
        <div className="section-header">
          {/*stockName 변수를 출력*/}
          <div className="title-pill">{stockName}</div>
          
          {/*등락율 출력*/}
          <div className="title-pill percent">{changeRate}</div>
        </div>
        
        <div className="content-area" style={{ padding: 0, overflow: 'hidden' }}>
          <StockChart targetStock={targetStock} />
        </div>
      </section>

      {/* 우측: AI 리포트 영역 */}
      <section className="board-section">
        <div className="section-header">
          <div className="title-pill">AI Report</div>
        </div>
        
        <div className="content-area" style={{ flexDirection: 'column', padding: '20px' }}>
          {analysisData ? (
            <AIReport data={analysisData} />
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#8b95a1', marginBottom: '16px', fontSize: '1rem' }}>
                전문적인 AI 분석 리포트가 필요하신가요?
              </p>
              <button 
                onClick={handleGenerateReport}
                disabled={isAnalyzing}
                style={{
                  padding: '12px 24px',
                  backgroundColor: isAnalyzing ? '#a8b0ba' : '#3182f6',
                  color: 'white',
                  borderRadius: '12px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  transition: 'background-color 0.2s',
                }}
              >
                {isAnalyzing ? "AI 분석 중..." : "AI 분석 리포트 생성하기"}
              </button>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}