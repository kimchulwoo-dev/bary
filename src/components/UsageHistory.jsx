// src/components/UsageHistory.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './UsageHistory.css';

const UsageHistory = () => {
  // 오늘 날짜 (YYYY-MM-DD) 구하기
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  // 쿠키에서 특정 값을 읽어오는 함수
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return '';
  };

  const F_SEQ = getCookie('F_SEQ');

  // 사용 내역 조회 함수 (useCallback 사용)
  const handleQuery = useCallback(async () => {
    // "YYYY-MM-DD" 포맷을 "YYYYMMDD"로 변환
    const formattedStart = startDate.replace(/-/g, "");
    const formattedEnd = endDate.replace(/-/g, "");
    
    try {
      const response = await fetch('http://183.111.230.18:6300/api/usageHistory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate: formattedStart, endDate: formattedEnd, F_SEQ: F_SEQ })
      });
      const data = await response.json();
      if (response.ok) {
        setResults(data);
      } else {
        // alert("조회 실패: " + data.error);
        toast.error("조회 실패: " + data.error);
      }
    } catch (error) {
      console.error("사용 내역 조회 중 오류:", error);
      // alert("내역 조회 중 오류가 발생했습니다: " + error.message);
      toast.error("내역 조회 중 오류가 발생했습니다: " + error.error);
    }
  }, [startDate, endDate, F_SEQ]);

  // 자동 조회 when the component mounts or when the dates change
  useEffect(() => {
    handleQuery();
  }, [handleQuery]);

  // When a row is double-clicked, navigate to the detail page
  const handleRowDoubleClick = (item) => {
    // Navigate to the detailed usage history page, passing the unique ID (F_SEQ)
    navigate(`/usageDetail/${item.F_SEQ}`);
  };

  return (
    <div className="usage-history-container">
      <h2 className="usage-history-title">사용 내역 조회</h2>
      <form className="usage-history-form" onSubmit={(e) => { e.preventDefault(); handleQuery(); }}>
        <div className="mb-3">
          <label htmlFor="startDate" className="form-label">시작일자</label>
          <input
            type="date"
            className="form-control"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="endDate" className="form-label">종료일자</label>
          <input
            type="date"
            className="form-control"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">조회</button>
      </form>

      <div className="usage-history-results mt-4">
        {results.length > 0 ? (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>일자</th>
                <th>상태</th>
                <th>출발지</th>
                <th>도착지</th>
                <th>요금</th>
              </tr>
            </thead>
            <tbody>
              {results.map((item, index) => (
                <tr key={index} onDoubleClick={() => handleRowDoubleClick(item)} style={{ cursor: 'pointer' }}>
                  <td>{item.F_ORDER_DTE}</td>
                  <td>{item.f_status}</td>
                  <td>{item.F_CUST_ADDR1}</td>
                  <td>{item.F_CUST_ADDR2}</td>
                  <td>{item.F_ORDER_TOTFE}</td>
                  {/* Hidden columns for additional details */}
                  <td style={{ display: "none" }}>{item.F_ETCNM1}</td>
                  <td style={{ display: "none" }}>{item.F_ETCNM2}</td>
                  <td style={{ display: "none" }}>{item.F_ETCNM3}</td>
                  <td style={{ display: "none" }}>{item.F_ETCNM4}</td>
                  <td style={{ display: "none" }}>{item.F_ORDER_BIGO}</td>
                  <td style={{ display: "none" }}>{item.F_CUST_ADDR1_DETAIL}</td>
                  <td style={{ display: "none" }}>{item.F_CUST_ADDR2_DETAIL}</td>
                  <td style={{ display: "none" }}>{item.F_CUST_COMPNM1}</td>
                  <td style={{ display: "none" }}>{item.F_CUST_COMPNM2}</td>
                  <td style={{ display: "none" }}>{item.F_CUST_TELNO1}</td>
                  <td style={{ display: "none" }}>{item.F_CUST_TELNO2}</td>
                  <td style={{ display: "none" }}>{item.F_SEQ}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>조회된 내역이 없습니다.</p>
        )}
      </div>

    </div>
  );
};

export default UsageHistory;
