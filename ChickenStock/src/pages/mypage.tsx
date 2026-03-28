import React from 'react';

interface MyPageModalProps {
  onClose: () => void;
}

export default function MyPageModal({ onClose }: MyPageModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <div className="form-header">
          <h2>My Page</h2>
          <button className="btn-small" onClick={onClose}>닫기</button>
        </div>
        
        {/* 사용자 정보 영역 */}
        <div className="user-profile-info">
          <p><strong>이메일:</strong> example@mail.com</p>
          <p><strong>비밀번호:</strong> ********</p>
          <p><strong>알림 설정:</strong> 켜짐</p>
        </div>
        
        {/* 로그아웃 등 액션 버튼 */}
        <button className="btn-submit" onClick={onClose}>로그아웃</button>
        
      </div>
    </div>
  );
}