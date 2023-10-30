import React from "react";

const Modal = ({ children, show }) => {
  if (!show) return <div></div>;
  return (
    <div className="z-20 bg-gray-400 bg-opacity-70 fixed top-0 left-0 p-3 backdrop-blur-sm w-full h-screen flex flex-col justify-center items-center">
      <div className="bg-white rounded-lg w-full max-w-2xl relative">
        {children}
      </div>
    </div>
  );
};

export default Modal;
