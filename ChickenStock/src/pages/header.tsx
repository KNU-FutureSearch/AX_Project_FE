import React from 'react';

// Header 컴포넌트가 부모로부터 받을 Props의 타입을 정의합니다.
// onOpenLogin은 매개변수와 반환값이 없는 함수 형태임을 명시합니다.
interface HeaderProps {
  onOpenLogin: () => void;
  onOpenMyPage: () => void;
}

export default function Header({ onOpenLogin, onOpenMyPage }: HeaderProps) {
  return (
    <header className="header">
      {/* 서비스 로고 */}
      <div className="logo-box">Chickenstock</div>
      
      {/* 우측 상단 버튼 그룹 */}
      <div className="header-buttons">
        <button className="btn-pill" onClick={onOpenMyPage}>MyPage</button>
        {/* Login 버튼을 누르면 부모(App.tsx)가 전달해준 onOpenLogin 함수가 실행되어 모달이 열립니다. */}
        <button className="btn-pill" onClick={onOpenLogin}>Login</button>
      </div>
    </header>
  );
}