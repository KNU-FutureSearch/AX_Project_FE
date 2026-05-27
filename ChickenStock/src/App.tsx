import React, { useState, useEffect } from 'react';
import Header from './pages/header';
import MainBoard from './pages/mainboard';
import AuthModal from './pages/authmodal';
import MyPageModal from './pages/mypage';

export default function App() {
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isMyPageOpen, setIsMyPageOpen] = useState<boolean>(false);
  
  // 메인 화면에 띄울 주식 정보를 관리하는 상태
  const [currentStock, setCurrentStock] = useState({
    name: "삼성전자",
    rate: "-5.29%"
  });

  // ⭐️ 1. 유저의 로그인 상태를 관리하는 State 추가
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // ⭐️ 2. 앱이 처음 켜질 때, 브라우저에 저장된 '출입증(Token)'이 있는지 확인
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true); // 토큰이 있으면 로그인된 상태로 간주 (자동 로그인 효과)
    }
  }, []); // [] 빈 배열을 넣으면 컴포넌트가 처음 마운트될 때 딱 한 번만 실행됩니다.

  // ⭐️ 3. 로그아웃 처리 함수
  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // 브라우저에서 토큰 삭제
    setIsLoggedIn(false); // 로그인 상태를 false로 변경
    alert('로그아웃 되었습니다.');
  };

  return (
    <div className="app-container">
      <div className="white-background">
        {/* Header 컴포넌트가 로그인 상태에 따라 UI를 다르게 보여줄 수 있도록
          isLoggedIn과 handleLogout을 Props로 넘겨줍니다. 
        */}
        <Header 
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          onOpenLogin={() => setIsAuthOpen(true)}
          onOpenMyPage={() => setIsMyPageOpen(true)} 
        />
        
        <MainBoard 
          stockName={currentStock.name} 
          changeRate={currentStock.rate} 
        />
      </div>
      
      {/* AuthModal에 onLoginSuccess Props를 추가하여,
        로그인이 성공하면 App.tsx의 isLoggedIn 상태가 true로 바뀌도록 연결합니다.
      */}
      {isAuthOpen && (
        <AuthModal 
          onClose={() => setIsAuthOpen(false)} 
          onLoginSuccess={() => setIsLoggedIn(true)} 
        />
      )}
      
      {isMyPageOpen && <MyPageModal onClose={() => setIsMyPageOpen(false)} />}
    </div>
  );
}