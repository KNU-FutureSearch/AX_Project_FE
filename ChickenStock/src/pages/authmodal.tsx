import React, { useState } from 'react';

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const [isLoginView, setIsLoginView] = useState<boolean>(true);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {isLoginView ? (
          <div className="form-container">
            <div className="form-header">
              <h2>Login</h2>
              <button className="btn-small" onClick={() => setIsLoginView(false)}>
                sign-up
              </button>
            </div>
            <div className="input-group">
              <label>ID(E-mail)</label>
              <input type="email" placeholder="example@mail.com" />
            </div>
            <div className="input-group">
              <label>password</label>
              <input type="password" />
            </div>
            <button className="btn-submit">login</button>
          </div>
        ) : (
          <div className="form-container">
            <div className="form-header">
              <h2>Sign-up</h2>
              <button className="btn-small" onClick={() => setIsLoginView(true)}>
                back to login
              </button>
            </div>
            <div className="input-group">
              <label>ID(E-mail)</label>
              <input type="email" placeholder="example@mail.com" />
            </div>
            <div className="input-group">
              <label>password</label>
              <input type="password" />
              <span className="pwd-hint">
                최소 6자 이상, 영문 대소문자 및 숫자를 포함해야 합니다.
              </span>
            </div>
            <div className="input-group">
              <label>password confirm</label>
              <input type="password" />
            </div>
            <button className="btn-submit">register</button>
          </div>
        )}
      </div>
    </div>
  );
}