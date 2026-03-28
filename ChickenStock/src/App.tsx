import React, { useState } from 'react';
import Header from './pages/header';
import MainBoard from './pages/mainboard';
import AuthModal from './pages/authmodal';
import MyPageModal from './pages/mypage';

export default function App() {

  const[isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const[isMyPageOpen, setIsMyPageOpen] = useState<boolean>(false);
  // 메인 화면에 띄울 주식 정보를 관리하는 상태입니다.
  const [currentStock, setCurrentStock] = useState({
    name: "삼성전자",
    rate: "-5.29%"
  });

  return (
    <div className="app-container">
      <div className="white-background">
        {/* 로그인 로직을 제외했으므로, 임시로 alert 창을 띄우는 함수를 전달합니다.
          이렇게 하면 HeaderProps의 타입 규칙을 어기지 않아 에러가 나지 않습니다. 
        */}
        <Header 
          onOpenLogin={() => setIsAuthOpen(true)}
          onOpenMyPage={() => setIsMyPageOpen(true)} />
        
        {/* MainBoard 컴포넌트에 현재 주식 정보를 Props로 건네줍니다. */}
        <MainBoard 
          stockName={currentStock.name} 
          changeRate={currentStock.rate} 
        />
      </div>
      {/* 각각의 상태가 true일 때 해당 모달을 띄웁니다. */}
      {isAuthOpen && <AuthModal onClose={() => setIsAuthOpen(false)} />}
      {isMyPageOpen && <MyPageModal onClose={() => setIsMyPageOpen(false)} />}
    </div>
  );
}