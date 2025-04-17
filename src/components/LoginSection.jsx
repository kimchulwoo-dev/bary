// src/components/LoginSection.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './LoginSection.css';

const LoginSection = () => {
  const [loginId, setLoginId] = useState('');
  const [loginPw, setLoginPw] = useState('');
  const navigate = useNavigate();

  // 쿠키에서 해당 값들을 읽어오는 함수
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return '';
  };

  useEffect(() => {
    const savedLoginId = getCookie('loginId');
    const savedLoginPw = getCookie('loginPw');
    if (savedLoginId) setLoginId(savedLoginId);
    if (savedLoginPw) setLoginPw(savedLoginPw);
  }, []);

  const handleLogin = async () => {
    if (!loginId || !loginPw) {
      toast.error("아이디와 패스워드를 입력해 주세요.");
      return;
    }

    try {
      const response = await fetch('http://183.111.230.18:6300/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ loginId, loginPw })
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error("로그인 실패: " + errorData.error);
        return;
      }

      const data = await response.json();
      console.log("로그인 성공 데이터:", data);

      // 쿠키에 F_CUST_COMPNM와 F_CUST_TELNO 저장 (보안상 중요한 정보는 평문 저장 피하기)
      document.cookie = `F_CUST_COMPNM=${data.F_CUST_COMPNM}; path=/;`;
      document.cookie = `F_CUST_TELNO=${data.F_CUST_TELNO}; path=/;`;
      document.cookie = `F_CUST_DEPT=${data.F_CUST_DEPT}; path=/;`;
      document.cookie = `F_CUST_PRS=${data.F_CUST_PRS}; path=/;`;
      document.cookie = `F_CUST_EMAIL=${data.F_CUST_EMAIL}; path=/;`;
      document.cookie = `F_SEQ=${data.F_SEQ}; path=/;`;
      document.cookie = `F_CUST_HPNO=${data.F_CUST_HPNO}; path=/;`;
      document.cookie = `F_CUST_ADDRDONGNM=${data.F_CUST_ADDRDONGNM}; path=/;`;
      document.cookie = `F_CUST_ADDR=${data.F_CUST_ADDR}; path=/;`;
      document.cookie = `F_CUST_ADDR_DETAIL=${data.F_CUST_ADDR_DETAIL}; path=/;`;
      // 또한 로그인 정보도 쿠키에 저장 (여기서는 간단히 처리하지만, 실제 서비스에서는 토큰 등의 방식 사용)
      document.cookie = `loginId=${loginId}; path=/;`;
      document.cookie = `loginPw=${loginPw}; path=/;`;

      toast.success("로그인에 성공하였습니다.");
      navigate('/order');  // 로그인 성공 후 OrderForm 페이지로 이동
    } catch (err) {
      console.error("로그인 중 에러 발생:", err);
      alert(err.message || "로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="text-center mt-5">
      <form id="loginForm" className="mb-4" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
        <div className="mb-3">
          <input 
            type="text" 
            className="form-control" 
            id="loginId" 
            placeholder="아이디" 
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input 
            type="password" 
            className="form-control" 
            id="loginPw" 
            placeholder="패스워드" 
            value={loginPw}
            onChange={(e) => setLoginPw(e.target.value)}
          />
        </div>
      </form>
      <div className="btn-group-responsive d-flex flex-column flex-md-row justify-content-center gap-3">
        <button id="loginBtn" className="btn btn-outline-primary px-4 py-2" onClick={handleLogin}>
          로그인
        </button>
        <a href="/signup" className="btn btn-outline-primary px-4 py-2">회원가입</a>
        {/* <a href="/order" className="btn btn-outline-primary px-4 py-2">비회원 주문</a> */}
      </div>
    </div>
  );
};

export default LoginSection;
