"use client";

import { useEffect } from "react";

const CustomAlert = ({ message, status, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="all-alert-back-div">
      {status ? (
        <div className="success-alert-div animated fadeInDown">
          <div className="icon">
            <i className="bi-check-all"></i>
          </div>
          <div className="text">
            <p>{message}</p>
          </div>
        </div>
      ) : (
        <div className="failed-alert-div animated fadeInDown">
          <div className="icon">
            <i className="bi-exclamation-octagon-fill"></i>
          </div>
          <div className="text">
            <p>{message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomAlert;
