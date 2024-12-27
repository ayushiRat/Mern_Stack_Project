// eslint-disable-next-line no-unused-vars
import React from "react";

// eslint-disable-next-line react/prop-types
const ResumeModal = ({ imageUrl, onClose }) => {
  return (
    <div className="resume-modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <img src={imageUrl} alt="resume" />
      </div>
    </div>
  );
};

export default ResumeModal;

// // eslint-disable-next-line no-unused-vars
// import React from 'react'

// const ResumeModal = () => {
//   return (
//     <div>ResumeModal</div>
//   )
// }

// export default ResumeModal