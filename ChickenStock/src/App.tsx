import { useState, useEffect } from 'react';
import Header from './pages/header';
import MainBoard from './pages/mainboard';
import AuthModal from './pages/authmodal';
import MyPageModal from './pages/mypage';

export default function App() {
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isMyPageOpen, setIsMyPageOpen] = useState<boolean>(false);
  
  // 메인 화면에 띄울 주식 정보를 관리하는 상태
  const [currentStock] = useState({
    name: "삼성전자",
    rate: "-5.29%"
  });

  // 유저의 로그인 상태를 관리하는 State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // 앱이 처음 켜질 때, 브라우저에 저장된 '출입증(Token)'이 있는지 확인
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true); // 토큰이 있으면 로그인된 상태로 간주
    }
  }, []);

  // 로그아웃 처리 함수
  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // 브라우저에서 토큰 삭제
    setIsLoggedIn(false); // 로그인 상태를 false로 변경
    setIsMyPageOpen(false); // 마이페이지가 열려있다면 함께 닫아줍니다.
    alert('로그아웃 되었습니다.');
  };

  return (
    <div className="app-container">
      <div className="white-background">
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
      
      {isAuthOpen && (
        <AuthModal 
          onClose={() => setIsAuthOpen(false)} 
          onLoginSuccess={() => setIsLoggedIn(true)} 
        />
      )}
      
      {isMyPageOpen && (
        <MyPageModal 
          onClose={() => setIsMyPageOpen(false)} 
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}