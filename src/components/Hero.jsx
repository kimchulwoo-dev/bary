import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="py-3 hero">
      <div className="container">
        <div className="hero-content">
          <img src="/img/bary.png" alt="회사 로고" />
          <h1 className="hero-title">바리바리퀵</h1>
        </div>
        {/* <p className="lead">회원 또는 비회원으로 간편주문</p> */}
        <p className="lead highlight">회원가입시 마일리지제공</p>
      </div>
    </section>
  );
};
export default Hero;
