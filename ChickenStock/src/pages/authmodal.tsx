import React, { useState } from 'react';
import axios from 'axios';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: () => void; 
}

export default function AuthModal({ onClose, onLoginSuccess }: AuthModalProps) {
  const [isLoginView, setIsLoginView] = useState<boolean>(true);
  
  // 💡 백엔드 DTO에 맞춰 State 이름과 종류를 변경했습니다.
  const [id, setId] = useState<string>(''); // email -> id (학번)
  const [name, setName] = useState<string>(''); // 이름 추가
  const [password, setPassword] = useState<string>('');
  const [checkPassword, setCheckPassword] = useState<string>(''); // 변수명 일치

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoginView && password !== checkPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      // 💡 백엔드 주소 (상황에 맞게 수정: localhost 또는 EC2 IP)
      const baseURL = 'http://13.209.15.204:8080'; 

      if (isLoginView) {
        // [로그인 요청] (로그인 API도 아이디와 비밀번호를 받을 것으로 예상)
        const response = await axios.post(`${baseURL}/api/login`, {
          id: id, 
          password: password,
        });
        
        const token = response.data.token; 
        localStorage.setItem('accessToken', token);
        
        alert('로그인 성공!');
        onLoginSuccess(); 
        onClose(); 

      } else {
        // [회원가입 요청] 💡 SignUpDto에 명시된 4가지 변수명을 정확히 보냅니다.
        await axios.post(`${baseURL}/api/join`, {
          id: id,
          name: name,
          password: password,
          checkPassword: checkPassword
        });

        alert('회원가입이 완료되었습니다. 로그인해주세요!');
        setIsLoginView(true); 
        setPassword('');
        setCheckPassword('');
      }
    } catch (error: any) {
      console.error(error);
      alert(isLoginView ? '로그인에 실패했습니다.' : '회원가입에 실패했습니다.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {isLoginView ? (
          // --- 로그인 화면 ---
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-submit">login</button>
          </form>
        ) : (
          // --- 회원가입 화면 ---
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
            {/* 💡 이름 입력 필드 추가 */}
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