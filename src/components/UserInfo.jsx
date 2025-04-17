// src/components/UserInfo.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './UserInfo.css';

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState({
    username: '',
    name: '',
    email: '',
    phone: '',
    Address: '',
    AddressDong: '',
    AddressDetail: ''
  });

  // 쿠키 값 읽기 유틸리티 함수
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return '';
  };

  useEffect(() => {
    // 쿠키에 저장된 값으로 사용자 정보를 초기화합니다.
    const username = getCookie('loginId');           // 로그인 시 저장한 아이디
    const name = getCookie('F_CUST_COMPNM');           // 회사명 또는 이름
    const email = getCookie('F_CUST_EMAIL');           // 이메일
    const phone = getCookie('F_CUST_TELNO');           // 전화번호
    const Address = getCookie('F_CUST_ADDR') || '';
    const AddressDong = getCookie('F_CUST_ADDRDONGNM') || '';
    const AddressDetail = getCookie('F_CUST_ADDR_DETAIL') || '';
    setUserInfo({ username, name, email, phone, Address, AddressDong, AddressDetail });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };

// 사용자 정보 업데이트 함수: API를 호출하여 업데이트 처리
const handleSubmit = async (e) => {
  e.preventDefault();
  // 예시로 PUT 요청을 보내 사용자 정보를 업데이트합니다.
  try {
    const response = await fetch(`http://183.111.230.18:6300/api/user/${userInfo.username}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userInfo)
    });
    const data = await response.json();
    if (response.ok) {
      // alert("사용자 정보가 업데이트되었습니다.");
      toast.error("사용자 정보가 업데이트되었습니다.");
       // 서버의 응답값 대신 사용자가 보낸 값(userInfo)으로 쿠키 설정
       document.cookie = `F_CUST_COMPNM=${userInfo.name}; path=/;`;
       document.cookie = `F_CUST_TELNO=${userInfo.phone}; path=/;`;
       document.cookie = `F_CUST_EMAIL=${userInfo.email}; path=/;`;
       document.cookie = `F_CUST_ADDRDONGNM=${userInfo.AddressDong}; path=/;`;
       document.cookie = `F_CUST_ADDR=${userInfo.Address}; path=/;`;
       document.cookie = `F_CUST_ADDR_DETAIL=${userInfo.AddressDetail}; path=/;`;
      // 업데이트 후 원하는 다른 페이지로 이동이 필요하면 navigate() 함수를 사용합니다.
      // navigate('/somepage');
    } else {
      // alert("정보 업데이트 실패: " + data.error);
      toast.error("정보 업데이트 실패: " + data.error);
    }
  } catch (error) {
    console.error("정보 업데이트 중 에러 발생:", error);
    //alert("정보 업데이트 중 오류가 발생했습니다: " + error.message);
    toast.error("정보 업데이트 중 오류가 발생했습니다: " + error.message);
  }
};


  // 주소 검색 함수 (Daum 우편번호 API 사용)
  const searchAddress = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        const fullAddress = data.roadAddress || data.address;
        const dong = data.bname || "";
        // DOM 요소에 직접 값 설정
        document.getElementById('Address').value = fullAddress;
        document.getElementById('AddressDong').value = dong;
        // 상태에도 반영 (선택 사항)
        setUserInfo(prev => ({
          ...prev,
          Address: fullAddress,
          AddressDong: dong
        }));
      },
    }).open();
  };

  return (
    <div className="user-info-container">
      <h2 className="user-info-title">내 정보</h2>
      <form className="user-info-form" onSubmit={handleSubmit}>
        {/* 아이디 (핸드폰번호) */}
        <div className="form-group">
          <label htmlFor="username" className="form-label">아이디 (핸드폰번호)</label>
          <input 
            type="tel"
            className="form-control"
            id="username"
            name="username"
            value={userInfo.username}
            readOnly
          />
        </div>
        {/* 이름 */}
        <div className="form-group">
          <label htmlFor="name" className="form-label">이름</label>
          <input 
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={userInfo.name}
            onChange={handleChange}
            required
          />
        </div>
        {/* 이메일 */}
        <div className="form-group">
          <label htmlFor="email" className="form-label">이메일</label>
          <input 
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={userInfo.email}
            onChange={handleChange}
            required
          />
        </div>
        {/* 전화번호 */}
        <div className="form-group">
          <label htmlFor="phone" className="form-label">전화번호</label>
          <input 
            type="tel"
            className="form-control"
            id="phone"
            name="phone"
            value={userInfo.phone}
            onChange={handleChange}
            required
          />
        </div>
        {/* 주소정보 */}
        <div className="address-group mt-3">
          <label className="form-label">주소정보</label>
          <div className="row mb-2">
            <div className="col-md-9">
              <input
                type="text"
                className="form-control"
                id="Address"
                name="Address"
                placeholder="주소"
                readOnly
                value={userInfo.Address}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                id="AddressDong"
                name="AddressDong"
                placeholder="동명"
                readOnly
                value={userInfo.AddressDong}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-md-8">
              <input
                type="text"
                className="form-control"
                id="AddressDetail"
                name="AddressDetail"
                placeholder="상세주소"
                value={userInfo.AddressDetail}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4">
              <button
                type="button"
                className="btn btn-secondary w-100"
                onClick={searchAddress}
              >
                주소 검색
              </button>
            </div>
          </div>
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-primary mt-3">
            정보 업데이트
          </button>
        </div>

      </form>
    </div>
  );
};

export default UserInfo;
