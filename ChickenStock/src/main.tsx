import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css'; // 전역 CSS(토스 스타일) 불러오기

// id가 'root'인 HTML 요소에 React 앱을 렌더링합니다.
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);