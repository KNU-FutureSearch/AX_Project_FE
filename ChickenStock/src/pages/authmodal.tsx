import React, { useState } from 'react';
import axios from 'axios';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: () => void; 
}

export default function AuthModal({ onClose, onLoginSuccess }: AuthModalProps) {
  const [isLoginView, setIsLoginView] = useState<boolean>(true);
  
  const [id, setId] = useState<string>(''); 
  const [name, setName] = useState<string>(''); 
  const [password, setPassword] = useState<string>('');
  const [checkPassword, setCheckPassword] = useState<string>(''); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoginView && password !== checkPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://13.209.15.204:8080'; 

      if (isLoginView) {
        const params = new URLSearchParams();
        params.append('id', id);
        params.append('password', password);

        const response = await axios.post(`${baseURL}/api/login`, params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
        
        const responseData = response.data;
        const token = responseData?.accessToken || responseData?.data?.accessToken || responseData?.token; 
        
        if (!token) {
          alert('ID 혹은 비밀번호가 틀렸거나 인증 토큰을 받지 못했습니다.');
          return;
        }

        localStorage.setItem('accessToken', token);
        
        alert('로그인 성공!');
        onLoginSuccess(); 
        onClose(); 

      } else {
        const params = new URLSearchParams();
        params.append('id', id);
        params.append('name', name);
        params.append('password', password);
        params.append('checkPassword', checkPassword);

        await axios.post(`${baseURL}/api/join`, params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });

        alert('회원가입이 완료되었습니다. 로그인해주세요!');
        setIsLoginView(true); 
        setId('');
        setName('');
        setPassword('');
        setCheckPassword('');
      }
    } catch (error: any) {
      console.error("인증 에러 상세:", error);
      if (error.response) {
        const serverMessage = error.response.data?.message || error.response.data;
        alert(`서버 에러 (${error.response.status}): ${typeof serverMessage === 'string' ? serverMessage : '인증에 실패했습니다.'}`);
      } else if (error.request) {
        alert('서버로부터 응답을 받을 수 없습니다. 백엔드 서버 혹은 CORS 설정을 확인해 주세요.');
      } else {
        alert('요청 설정 중 에러가 발생했습니다.');
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {isLoginView ? (
          <form className="form-container" onSubmit={handleSubmit}>
            <div className="form-header">
              <h2>Login</h2>
              <button type="button" className="btn-small" onClick={() => setIsLoginView(false)}>
                sign-up
              </button>
            </div>
            <div className="input-group">
              <label>학번 (ID)</label>
              <input 
                type="text" 
                placeholder="학번을 입력하세요" 
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>비밀번호</label>
              <input 
                type="password" 
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-submit">login</button>
          </form>
        ) : (
          <form className="form-container" onSubmit={handleSubmit}>
            <div className="form-header">
              <h2>Sign-up</h2>
              <button type="button" className="btn-small" onClick={() => setIsLoginView(true)}>
                back to login
              </button>
            </div>
            <div className="input-group">
              <label>학번 (ID)</label>
              <input 
                type="text" 
                placeholder="학번을 입력하세요"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>이름</label>
              <input 
                type="text" 
                placeholder="이름을 입력하세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>비밀번호</label>
              <input 
                type="password"
                placeholder="비밀번호를 설정하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="pwd-hint">
                최소 6자 이상, 영문 대소문자 및 숫자를 포함해야 합니다.
              </span>
            </div>
            <div className="input-group">
              <label>비밀번호 확인</label>
              <input 
                type="password"
                placeholder="비밀번호를 다시 한 번 입력하세요"
                value={checkPassword}
                onChange={(e) => setCheckPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-submit">register</button>
          </form>
        )}
      </div>
    </div>
  );
}