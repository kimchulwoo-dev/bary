import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
      <Link className="navbar-brand d-flex align-items-center gap-2 btn btn-link" to="/">
      <i className="bi bi-truck fs-4 text-primary"></i>
      <span className="fw-bold fs-5">BaryBary</span>
    </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-lg-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="/">
                <i className="bi bi-house-check me-1"></i> 홈
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/order">
                <i className="bi bi-cart-check me-1"></i> 주문하기
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/usehistory">
                <i className="bi bi-clock-history me-1"></i> 사용내역
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/userinfo">
                <i className="bi bi-person-circle me-1"></i> 내정보
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
