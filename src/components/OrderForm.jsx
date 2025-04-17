// src/components/OrderForm.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './OrderForm.css';

const OrderForm = () => {
  const navigate = useNavigate();

  // 로그인 시 쿠키에 저장된 값 (출발지 정보 기본값)
  const [startName, setStartName] = useState('');
  const [startPhone, setStartPhone] = useState('');
  const [startAddr, setStartAddr] = useState('');
  const [startAddrDong, setStartAddrDong] = useState('');
  const [startAddrdetail, setStartAddrdetail] = useState('');
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);

  // 주문 상세정보 관련 상태
  const [orderSubMethod, setOrderSubMethod] = useState('1'); // 기본값: 보내기
  const [fBack, setFBack] = useState(false);

  // 거리 및 요금 상태
  const [km, setKm] = useState("0");
  const [fare, setFare] = useState("0");

  // 쿠키 값을 읽어오는 함수
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return '';
  };

  const F_SEQ = getCookie('F_SEQ');

  useEffect(() => {
    const compName = getCookie('compName');
    const custPhone = getCookie('custPhone');
    const F_CUST_ADDR = getCookie('F_CUST_ADDR');
    const F_CUST_ADDRDONGNM = getCookie('F_CUST_ADDRDONGNM');
    const F_CUST_ADDR_DETAIL = getCookie('F_CUST_ADDR_DETAIL');
    console.log("쿠키에서 읽은 값:", compName, custPhone);
    if (compName) setStartName(compName);
    if (custPhone) setStartPhone(custPhone);
    if (F_CUST_ADDR) setStartAddr(F_CUST_ADDR);
    if (F_CUST_ADDR_DETAIL) setStartAddrdetail(F_CUST_ADDR_DETAIL);
    if (F_CUST_ADDRDONGNM) setStartAddrDong(F_CUST_ADDRDONGNM);
  }, []);

  // Kakao API를 이용하여 주소를 좌표로 변환하는 함수 (Promise 기반)
  const getCoordinates = (address) => {
    return new Promise((resolve, reject) => {
      if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
        reject("Kakao Maps SDK가 아직 로드되지 않았습니다.");
        return;
      }
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(address, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = { lat: result[0].y, lng: result[0].x };
          resolve(coords);
        } else {
          reject("주소 변환 실패: " + address);
        }
      });
    });
  };

  // 두 좌표 간 거리를 계산하는 함수 (Haversine 공식, km 단위)
  const calculateDistance = (startCoords, endCoords) => {
    const R = 6371; // 지구 반지름 (km)
    const dLat = (endCoords.lat - startCoords.lat) * (Math.PI / 180);
    const dLng = (endCoords.lng - startCoords.lng) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(startCoords.lat * (Math.PI / 180)) *
              Math.cos(endCoords.lat * (Math.PI / 180)) *
              Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  // 요금 계산 함수: 서버의 /api/calculateFare 엔드포인트 호출 및 추가 요금 로직 적용
  const handleCalculateFare = async (distanceKm) => {
    const f_bran_cd = "69794"; // 상수 (실제 환경에 맞게 수정)
    const f_km = distanceKm.toFixed(2);
    const F_ETC1 = document.getElementById('F_ETC1')?.value;
    const F_ETC4 = document.getElementById('F_ETC4')?.value;

    try {
      const response = await fetch('http://183.111.230.18:6300/api/calculateFare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ f_bran_cd, f_km, F_ETC1, F_ETC4 })
      });
      const data = await response.json();
      if (response.ok) {
        if (data.length > 0) {
          let baseAmt = Number(data[0].f_amt); // 기본 요금
          // 추가 금액
          baseAmt += Number(data[0].F_KGAMT) || 0;
          baseAmt += Number(data[0].F_SNOW) || 0;
          baseAmt += Number(data[0].F_NIGHT) || 0;
          baseAmt += Number(data[0].F_DAYOFF) || 0;
          baseAmt += Number(data[0].F_EARLY) || 0;
          // 급송 옵션
          const rapidChecked = document.getElementById('f_rapid')?.checked || false;
          if (rapidChecked) {
            baseAmt += Number(data[0].F_RAPID) || 0;
          }
          // 오더 방법 세부(F_ETC2)가 '4'(왕복)인 경우 배율 적용
          const F_ETC2_val = document.getElementById('F_ETC2')?.value;
          if (F_ETC2_val === "4") {
            const gobackVal = Number(data[0].F_GOBACK) || 0;
            const factor = 1 + (gobackVal / 100);
            baseAmt = baseAmt * factor;
          }
          setFare(baseAmt.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }));
        }
      } else {
        // alert("요금 계산 실패: " + data.error);
        toast.error("요금 계산 실패: " + data.error);
      }
    } catch (err) {
      // alert("요금 계산 중 오류 발생: " + err.message);
      toast.error("요금 계산 오류 발생: " + err.message);
    }
  };

  // 거리와 요금을 계산하는 함수
  const handleCalculate = async () => {
    const startAddress = document.getElementById('startAddress')?.value;
    const endAddress = document.getElementById('endAddress')?.value;
    if (!startAddress || !endAddress) return;
    try {
      const startCoords = await getCoordinates(startAddress);
      const endCoords = await getCoordinates(endAddress);
      const distance = calculateDistance(startCoords, endCoords);
      setKm(distance.toFixed(2));
      await handleCalculateFare(distance);
    } catch (error) {
      alert(error);
    }
  };

  // 주소 검색 함수
  const searchAddress = (type) => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        const fullAddress = data.roadAddress || data.address;
        if (type === 'start') {
          document.getElementById('startAddress').value = fullAddress;
          document.getElementById('startAddrDong').value = data.bname || "";
        } else {
          document.getElementById('endAddress').value = fullAddress;
          document.getElementById('endAddrDong').value = data.bname || "";
        }
        handleCalculate(); // 주소 검색 후 거리 및 요금 계산
      },
    }).open();
  };

  // 주문 제출 함수 - 입력값 체크 후 /api/order 호출
  const submitOrder = async () => {
    // 출발지 체크
    const startAddress = document.getElementById('startAddress')?.value.trim() || "";
    const startAddressDetail = document.getElementById('startAddressdetail')?.value.trim() || "";
    const startAddrDong = document.getElementById('startAddrDong')?.value.trim() || "";
    const startNameInput = document.getElementById('startName')?.value.trim() || "";
    const startPhoneInput = document.getElementById('startPhone')?.value.trim() || "";
    // 도착지 체크
    const endAddress = document.getElementById('endAddress')?.value.trim() || "";
    const endAddressDetail = document.getElementById('endAddressdetail')?.value.trim() || "";
    const endAddrDongInput = document.getElementById('endAddrDong')?.value.trim() || "";
    const endNameInput = document.getElementById('endName')?.value.trim() || "";
    const endPhoneInput = document.getElementById('endPhone')?.value.trim() || "";
    // 요금 체크 (콤마 제거 후 숫자로 변환)
    const fareStr = document.getElementById('F_CUST_FARE')?.value.replace(/,/g, '').trim() || "0";
    const fareNum = Number(fareStr);

    if (!startAddress || !startAddressDetail || !startNameInput || !startPhoneInput ||
        !endAddress || !endAddressDetail || !endNameInput || !endPhoneInput) {
      // alert("모든 주소, 상세주소, 이름, 전화번호를 입력해 주세요.");
      toast.error("모든 주소, 상세주소, 이름, 전화번호를 입력해 주세요.");
      return;
    }

    if (isNaN(fareNum) || fareNum <= 0) {
      // alert("요금은 0원 이상이어야 합니다.");
      toast.error("요금은 0원 이상이어야 합니다.");
      return;
    }

    // 주문 데이터 구성
    const orderData = {
      start: {
        address: startAddress,
        addressDetail: startAddressDetail,
        dong: startAddrDong,
        name: startNameInput,
        phone: startPhoneInput,
      },
      end: {
        address: endAddress,
        addressDetail: endAddressDetail,
        dong: endAddrDongInput,
        name: endNameInput,
        phone: endPhoneInput,
      },
      F_SEQ: F_SEQ,
      fare: document.getElementById('F_CUST_FARE')?.value || "",
      km: document.getElementById('F_KM')?.value || "",
      F_ETC1: document.getElementById('F_ETC1')?.value || "",
      F_ETC2: document.getElementById('F_ETC2')?.value || "",
      rapid: document.getElementById('f_rapid')?.checked || false,
      back: document.getElementById('f_back')?.checked || false,
      F_ETC3: document.getElementById('F_ETC3')?.value || "",
      F_ETC4: document.getElementById('F_ETC4')?.value || "",
      reservation: {
        rsvChk: document.getElementById('f_rsvchk')?.checked || false,
        rsvDate: document.getElementById('f_rsvdte')?.value.replace(/-/g, '') || "",
        rsvTime: document.getElementById('f_rsvhh')?.value || ""
      },
      remark: document.getElementById('f_bigo')?.value || ""
    };

    console.log("주문 데이터:", orderData);

    try {
      const response = await fetch('http://183.111.230.18:6300/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      const data = await response.json();
      if (response.ok) {
        //alert("주문이 접수되었습니다! 주문번호: " + data.orderId);
        toast.error("주문이 접수되었습니다! 주문번호: " + data.orderId);
        // 주문 성공 후 사용 내역(UsageHistory) 페이지로 이동
        navigate('/usehistory');
      } else {
        // alert("주문 제출 실패: " + data.error);
        toast.error("주문 제출 실패: " + data.error);
      }
    } catch (err) {
      console.error("주문 제출 중 에러 발생:", err);
      // alert("주문 제출 중 오류 발생: " + err.message);
      toast.error("주문 제출 중 오류 발생: " + err.message);
    }
  };

  return (
    <div className="order-form-container">
      <h2 className="order-title">퀵 주문하기</h2>

      {/* 출발지 정보 */}
      <div className="order-section">
        <h5>📦 출발지 정보</h5>
        <div className="row g-2 mt-2">
          <div className="col-md-9 mt-2">
            <input
              type="text"
              className="form-control"
              id="startAddress"
              placeholder="출발지 주소"
              value={startAddr}
              onChange={(e) => setStartAddr(e.target.value)}
              readOnly
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              id="startAddrDong"
              placeholder="동명"
              value={startAddrDong}
              onChange={(e) => setStartAddrDong(e.target.value)}
              readOnly
            />
          </div>
          <div className="col-md-8 mt-2">
            <input
              type="text"
              className="form-control"
              id="startAddressdetail"
              placeholder="상세주소"
              value={startAddrdetail}
              onChange={(e) => setStartAddrdetail(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <button className="btn btn-secondary w-100" onClick={() => searchAddress('start')}>
              주소 검색
            </button>
          </div>
          <div className="col-md-6 mt-2">
            <input
              type="text"
              className="form-control"
              id="startName"
              placeholder="이름"
              value={startName}
              onChange={(e) => setStartName(e.target.value)}
            />
          </div>
          <div className="col-md-6 mt-2">
            <input
              type="tel"
              className="form-control"
              id="startPhone"
              placeholder="전화번호"
              value={startPhone}
              onChange={(e) => setStartPhone(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 도착지 정보 */}
      <div className="order-section">
        <h5>📍 도착지 정보</h5>
        <div className="row g-2 mt-2">
          <div className="col-md-9 mt-2">
            <input
              type="text"
              className="form-control"
              id="endAddress"
              placeholder="도착지 주소"
              readOnly
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              id="endAddrDong"
              placeholder="동명"
              readOnly
            />
          </div>
          <div className="col-md-8 mt-2">
            <input
              type="text"
              className="form-control"
              id="endAddressdetail"
              placeholder="상세주소"
            />
          </div>
          <div className="col-md-4">
            <button className="btn btn-secondary w-100" onClick={() => searchAddress('end')}>
              주소 검색
            </button>
          </div>
          <div className="col-md-6 mt-2">
            <input
              type="text"
              className="form-control"
              id="endName"
              placeholder="이름"
            />
          </div>
          <div className="col-md-6 mt-2">
            <input
              type="tel"
              className="form-control"
              id="endPhone"
              placeholder="전화번호"
            />
          </div>
        </div>
      </div>

      {/* 주문 상세정보 */}
      <div className="order-section">
        <h5>
          <i className="bi bi-currency-dollar me-2"></i>
          요금 및 주문 정보
        </h5>
        <div className="form-group">
          <label htmlFor="F_CUST_FARE" className="form-label">요금/거리</label>
          <div className="row">
            <div className="col">
              <input
                type="text"
                id="F_CUST_FARE"
                name="F_CUST_FARE"
                className="form-control"
                value={fare}
                readOnly
              />
            </div>
            <div className="col">
              <input
                type="text"
                id="F_KM"
                name="F_KM"
                className="form-control"
                value={km}
                readOnly
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="F_ETC1" className="form-label">배송 방법</label>
          <select
            name="F_ETC1"
            id="F_ETC1"
            className="selectbox"
            defaultValue="03"
            onChange={handleCalculate}
          >
            <option value="01">셔틀</option>
            <option value="02">지하철</option>
            <option value="03">오토바이</option>
            <option value="04">다마스</option>
            <option value="05">라보</option>
            <option value="06">3밴</option>
            <option value="07">6밴</option>
            <option value="08">1톤</option>
            <option value="09">1.4톤</option>
            <option value="10">2.5톤</option>
            <option value="11">3.5톤</option>
            <option value="12">5톤</option>
            <option value="13">8톤</option>
            <option value="14">11톤</option>
          </select>
          <br />
          <label htmlFor="F_ETC2" className="form-label">오더 방법</label>
          <select
            name="F_ETC2"
            id="F_ETC2"
            className="selectbox"
            value={orderSubMethod}
            onChange={(e) => {
              setOrderSubMethod(e.target.value);
              handleCalculate();
            }}
          >
            <option value="1">보내기</option>
            <option value="2">찾아오기</option>
            <option value="3">외부</option>
            <option value="4">왕복</option>
            <option value="5">경유</option>
          </select>
          <br />
          <span>급송 </span>
          <input
            type="checkbox"
            id="f_rapid"
            name="f_rapid"
            value="01"
            className="inline-checkbox"
            onChange={handleCalculate}
          />
          <span> 왕복 </span>
          <input
            type="checkbox"
            id="f_back"
            name="f_back"
            value="4"
            className="inline-checkbox"
            checked={fBack}
            onChange={(e) => {
              setFBack(e.target.checked);
              if (e.target.checked) {
                setOrderSubMethod('4');
              } else {
                setOrderSubMethod('1'); // 기본값
              }
              handleCalculate();
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="F_ETC3" className="form-label">결제 방식</label>
          <select name="F_ETC3" id="F_ETC3" className="selectbox" defaultValue="1">
            <option value="1">선불</option>
            <option value="5">착불</option>
            <option value="4">송금</option>
          </select>
          <br />
          <label htmlFor="F_ETC4" className="form-label">배송 종류</label>
          <select
            name="F_ETC4"
            id="F_ETC4"
            className="selectbox"
            defaultValue="01"
            onChange={handleCalculate}
          >
            <option value="01">서류</option>
            <option value="02">쇼핑백</option>
            <option value="03">2kg미만</option>
            <option value="04">소형(5kg미만)</option>
            <option value="05">중형(10kg미만)</option>
            <option value="06">대형(20kg미만)</option>
            <option value="07">21-50kg</option>
            <option value="08">51-100kg</option>
            <option value="09">101-200kg</option>
            <option value="10">201-300kg</option>
            <option value="11">301-400kg</option>
            <option value="12">401-500kg</option>
            <option value="13">501-1000kg</option>
          </select>
        </div>
        <div className="form-group">
          <div className="row align-items-center">
            <label htmlFor="f_rsvchk" className="form-label red-label">
              예약시체크-시분(1200)형태입력
            </label>
            <div className="col-auto">
              <input type="checkbox" id="f_rsvchk" name="f_rsvchk" className="inline-checkbox" />
            </div>
            <div className="col">
              <input
                type="date"
                className="form-control"
                id="f_rsvdte"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="col">
              <input
                type="text"
                id="f_rsvhh"
                name="f_rsvhh"
                defaultValue="1500"
                className="form-control"
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="f_bigo" className="form-label">전달사항</label>
          <textarea id="f_bigo" name="f_bigo" className="form-control" rows="3"></textarea>
        </div>
      </div>

      {/* 주문 버튼 */}
      <div className="text-center mt-4">
        <button className="btn btn-primary btn-lg" onClick={submitOrder}>
          퀵 주문하기
        </button>
      </div>
    </div>
  );
};

export default OrderForm;
