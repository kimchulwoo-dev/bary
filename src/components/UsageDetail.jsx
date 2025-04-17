// src/components/UsageDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './UsageDetail.css';

const UsageDetail = () => {
  // Retrieve the usage detail identifier from URL parameters (e.g., f_seq)
  const { f_seq } = useParams();
  const navigate = useNavigate();

  // Local state for detail data, loading, and error handling.
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch detail information when the component mounts or when f_seq changes.
  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        // Using POST to match the API endpoint that expects a JSON body.
        
        const response = await fetch('http://183.111.230.18:6300/api/usageDetail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ f_seq })
        });
        if (!response.ok) {
          throw new Error("상세 정보 조회에 실패했습니다.");
        }
        const data = await response.json();
        // Assume the API returns an array with at least one record.
        if (data.length > 0) {
          setDetail(data[0]);
        } else {
          setError("조회된 상세 내역이 없습니다.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (f_seq) {
      fetchDetail();
    } else {
      setError("올바르지 않은 접근입니다. (f_seq 파라미터 누락)");
      setLoading(false);
    }
  }, [f_seq]);

  // Cancel button handler: call the cancellation API then navigate back.
  const handleCancel = async () => {
    try {

      const response = await fetch('http://183.111.230.18:6300/api/usageDetail/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ f_seq })
      });
      const data = await response.json();
      if (response.ok) {
        // alert("주문이 취소되었습니다.");
        toast.error("주문이 취소되었습니다.");
        navigate('/usehistory');
      } else {
        // alert("취소 실패: " + data.error);
        toast.error("취소 실패: " + data.error);
      }
    } catch (error) {
      console.error("취소 요청 중 오류:", error);
    //   alert("취소 요청 중 오류가 발생했습니다: " + error.message);
      toast.error("취소 요청 중 오류가 발생했습니다:  " + error.message);
    }
  };

  return (
    <div className="usage-detail-container">
      <h2 className="usage-detail-title">사용 내역 상세 정보</h2>
      {loading ? (
        <p>불러오는 중...</p>
      ) : error ? (
        <p className="error">오류: {error}</p>
      ) : detail ? (
        <div className="detail-card">
          <section className="detail-section">
            <h3>주문 정보</h3>
            <p><strong>주문 일자:</strong> {detail.F_ORDER_DTE}</p>
            <p><strong>상태:</strong> {detail.f_status}</p>
          </section>
          <section className="detail-section">
            <h3>출발지 정보</h3>
            <p><strong>주소:</strong> {detail.F_CUST_ADDR1}</p>
            {detail.F_CUST_ADDR1_DETAIL && (
              <p><strong>상세 주소:</strong> {detail.F_CUST_ADDR1_DETAIL}</p>
            )}
            {detail.F_CUST_COMPNM1 && (
              <p><strong>이름:</strong> {detail.F_CUST_COMPNM1}</p>
            )}
            {detail.F_CUST_TELNO1 && (
              <p><strong>전화번호:</strong> {detail.F_CUST_TELNO1}</p>
            )}
          </section>
          <section className="detail-section">
            <h3>도착지 정보</h3>
            <p><strong>주소:</strong> {detail.F_CUST_ADDR2}</p>
            {detail.F_CUST_ADDR2_DETAIL && (
              <p><strong>상세 주소:</strong> {detail.F_CUST_ADDR2_DETAIL}</p>
            )}
            {detail.F_CUST_COMPNM2 && (
              <p><strong>이름:</strong> {detail.F_CUST_COMPNM2}</p>
            )}
            {detail.F_CUST_TELNO2 && (
              <p><strong>전화번호:</strong> {detail.F_CUST_TELNO2}</p>
            )}
          </section>
          <section className="detail-section">
            <h3>요금 정보</h3>
            <p><strong>총 요금:</strong> {detail.F_ORDER_TOTFE}</p>
          </section>
          {detail.F_ORDER_BIGO && (
            <section className="detail-section">
              <h3>전달 사항</h3>
              <p>{detail.F_ORDER_BIGO}</p>
            </section>
          )}
        </div>
      ) : (
        <p>조회된 상세 내역이 없습니다.</p>
      )}
      <div className="button-group">
        <button className="btn btn-secondary" onClick={handleCancel}>주문 취소</button>
        <button className="btn btn-secondary" onClick={() => navigate('/usehistory')}>뒤로가기</button>
      </div>
    </div>
  );
};

export default UsageDetail;
