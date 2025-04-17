// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LoginSection from './components/LoginSection';
import ServiceCards from './components/ServiceCards';
import Footer from './components/Footer';
import OrderForm from './components/OrderForm';
import SignupForm from './components/SignupForm';
import UsageHistory from './components/UsageHistory';
import UsageDetail from './components/UsageDetail';
import UserInfo from './components/UserInfo';

// Import react-toastify styles and container
import { ToastContainer } from 'react-toastify';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <LoginSection />
              <ServiceCards />
              <Footer />
            </>
          }
        />
        <Route path="/order" element={<OrderForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/usehistory" element={<UsageHistory />} />
        <Route path="/usageDetail/:f_seq" element={<UsageDetail />} />
        <Route path="/userinfo" element={<UserInfo />} />
      </Routes>
      {/* Include the ToastContainer once in your app */}
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} />
    </Router>
  );
}

export default App;
