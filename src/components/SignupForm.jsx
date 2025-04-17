// src/components/SignupForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupForm.css';

const SignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    hpno: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 핸드폰번호(ID)와 전화번호가 숫자만 있는지 확인 (정규표현식 사용)
    if (!/^\d+$/.test(formData.hpno)) {
      alert("핸드폰번호(ID)는 숫자만 입력되어야 합니다.");
      return;
    }
    if (!/^\d+$/.test(formData.phone)) {
      alert("전화번호는 숫자만 입력되어야 합니다.");
      return;
    }

    // 비밀번호 길이 체크 (5자리 이상)
    if (formData.password.length < 5) {
      alert("비밀번호는 최소 5자리 이상이어야 합니다.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

        // 주소 정보 (주소, 동명, 상세주소)도 함께 읽어옵니다.
        const address = document.getElementById('Address').value.trim();
        const addressDong = document.getElementById('AddressDong').value.trim();
        const addressDetail = document.getElementById('Addressdetail').value.trim();

        // API 페이로드에 주소 정보도 추가
        const payload = {
          ...formData,
          address,
          addressDong,
          addressDetail
        };
    
    try {
      
      const response = await fetch('http://183.111.230.18:6300/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("회원가입 실패: " + errorData.error);
        return;
      }

      const data = await response.json();
      console.log("회원가입 성공 데이터:", data);

      // 회원가입 성공 시 쿠키에 아이디와 비밀번호 저장 (보안상 실제 서비스에서는 피해야 함)
      document.cookie = `loginId=${formData.hpno}; path=/;`;
      document.cookie = `loginPw=${formData.password}; path=/;`;

      alert("회원가입이 완료되었습니다.");
      // 회원가입 폼을 닫고 로그인 섹션(또는 로그인 페이지)으로 이동
      navigate('/');
    } catch (err) {
      console.error("회원가입 중 에러 발생:", err);
      alert(err.message || "회원가입 중 오류가 발생했습니다.");
    }
  };

  // 주소 검색 함수 (Daum 우편번호 API 사용)
  const searchAddress = (type) => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        const fullAddress = data.roadAddress || data.address;
        // 동명(읍/면 등)은 별도 input에 세팅
        document.getElementById('AddressDong').value = data.bname;
        // 메인 주소 input 세팅
        document.getElementById('Address').value = fullAddress;
      },
    }).open();
  };

  return (
    <div className="signup-container my-5">
      <h2 className="signup-title text-center mb-4">회원가입</h2>
      <form onSubmit={handleSubmit}>
        {/* 핸드폰번호(ID) */}
        <div className="form-group mb-3">
          <label htmlFor="hpno" className="form-label">핸드폰번호(ID)</label>
          <input 
            type="tel" 
            className="form-control" 
            id="hpno"
            name="hpno"
            placeholder="핸드폰번호를 입력(숫자)" 
            value={formData.hpno}
            onChange={handleChange}
            required
            pattern="[0-9]*"
            inputMode="numeric"
          />
        </div>

        {/* 이름 */}
        <div className="form-group mb-3">
          <label htmlFor="name" className="form-label">이름</label>
          <input 
            type="text" 
            className="form-control" 
            id="name"
            name="name"
            placeholder="이름을 입력하세요" 
            value={formData.name}
            onChange={handleChange}
            required 
          />
        </div>

        {/* 이메일 */}
        <div className="form-group mb-3">
          <label htmlFor="email" className="form-label">이메일</label>
          <input 
            type="email" 
            className="form-control" 
            id="email"
            name="email"
            placeholder="이메일을 입력하세요" 
            value={formData.email}
            onChange={handleChange}
            required 
          />
        </div>

        {/* 전화번호 */}
        <div className="form-group mb-3">
          <label htmlFor="phone" className="form-label">전화번호</label>
          <input 
            type="tel" 
            className="form-control" 
            id="phone"
            name="phone"
            placeholder="전화번호를 입력하세요" 
            value={formData.phone}
            onChange={handleChange}
            required 
            pattern="[0-9]*"
            inputMode="numeric"
          />
        </div>

        {/* 비밀번호 */}
        <div className="form-group mb-3">
          <label htmlFor="password" className="form-label">비밀번호</label>
          <input 
            type="password" 
            className="form-control" 
            id="password"
            name="password"
            placeholder="비밀번호를 입력하세요" 
            value={formData.password}
            onChange={handleChange}
            required 
          />
        </div>

        {/* 비밀번호 확인 */}
        <div className="form-group mb-4">
          <label htmlFor="confirmPassword" className="form-label">비밀번호 확인</label>
          <input 
            type="password" 
            className="form-control" 
            id="confirmPassword"
            name="confirmPassword"
            placeholder="비밀번호를 다시 입력하세요" 
            value={formData.confirmPassword}
            onChange={handleChange}
            required 
          />
        </div>

        {/* 주소정보 그룹 */}
        <div className="mb-3">
          <label htmlFor="Address" className="form-label">주소정보</label>
          <div className="row g-2">
            <div className="col-md-9">
              <input
                type="text"
                className="form-control"
                id="Address"
                placeholder="주소"
                readOnly
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                id="AddressDong"
                placeholder="동명"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* 상세주소 및 주소검색 그룹 */}
        <div className="mb-3">
          <label htmlFor="Addressdetail" className="form-label">상세주소</label>
          <div className="row g-2">
            <div className="col-md-8">
              <input
                type="text"
                className="form-control"
                id="Addressdetail"
                placeholder="상세주소"
              />
            </div>
            <div className="col-md-4">
              <button type="button" className="btn btn-secondary w-100" onClick={() => searchAddress('start')}>
                주소 검색
              </button>
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100 signup-btn">회원가입</button>
      </form>
    </div>
  );
};

export default SignupForm;
