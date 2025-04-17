import React from 'react';
import './ServiceCards.css';

const ServiceCards = () => {
  return (
    <section id="order" className="py-5">
      <div className="container">
        <h2 className="section-title text-center">서비스 안내</h2>
        <div className="row row-cols-1 row-cols-md-3 g-4">
          <div className="col">
            <div className="card styled-card h-100">
              <div className="card-body">
                <h5 className="card-title fw-semibold">문서배송</h5>
                <p className="card-text">
                  계약서, 세금계산서, 소형 택배 등 서류 중심의 빠른 배송에 적합합니다.
                </p>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card styled-card h-100">
              <div className="card-body">
                <h5 className="card-title fw-semibold">화물배송</h5>
                <p className="card-text">
                  무거운 톤 단위의 대형 화물도 전문 시스템으로 신속하고 안전하게 배송해드립니다.
                </p>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card styled-card h-100">
              <div className="card-body">
                <h5 className="card-title fw-semibold">맞춤배송</h5>
                <p className="card-text">
                  예약 시간 지정, 복수 주소 등 고객 맞춤 스케줄로 운영되는 프리미엄 서비스입니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceCards;
