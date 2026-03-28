import React from 'react';
import StockChart from './StockChart';

// MainBoard 컴포넌트가 부모로부터 받을 데이터(Props)의 타입을 정의
interface MainBoardProps {
  stockName: string;   // 종목명 (예: "삼성전자", "Apple Inc.")
  changeRate: string;  // 등락률 (예: "-5.29%", "+1.2%")
}

// 부모가 전달해준 props를 괄호 안에서 구조 분해 할당으로 꺼내옵니다.
export default function MainBoard({ stockName, changeRate }: MainBoardProps) {
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
          <StockChart />
        </div>
      </section>

      {/* 우측: AI 리포트 영역 */}
      <section className="board-section">
        <div className="section-header">
          <div className="title-pill">AI Report</div>
        </div>
        
        <div className="content-area">
          <p>report area</p>
        </div>
      </section>

    </div>
  );
}