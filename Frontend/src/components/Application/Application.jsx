import axios from "axios";
// eslint-disable-next-line no-unused-vars
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
// eslint-disable-next-line no-unused-vars
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../main";
const Application = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [resume, setResume] = useState(null);

  const { isAuthorized, user } = useContext(Context);

  const navigateTo = useNavigate();

 // Function to handle file input changes
  const handleFileChange = (e) => {
    const resume = e.target.files[0];
    setResume(resume);
  };

  const { id } = useParams();
  // const handleApplication = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   formData.append("name", name);
  //   formData.append("email", email);
  //   formData.append("phone", phone);
  //   formData.append("address", address);
  //   formData.append("coverLetter", coverLetter);
  //   formData.append("resume", resume);
  //   formData.append("jobId", id);

  //   try {
  //     const { data } = await axios.post(
  //       "http://localhost:5174/api/v1/application/post",
  //       formData,
  //       {
  //         withCredentials: true,
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  //     setName("");
  //     setEmail("");
  //     setCoverLetter("");
  //     setPhone("");
  //     setAddress("");
  //     setResume("");
  //     toast.success(data.message);
  //     navigateTo("/job/getall");
  //   } catch (error) {
  //     toast.error(error.response.data.message);
  //   }
  // };

  const handleApplication = async (e) => {
    e.preventDefault();
    
    if (!resume) {
      toast.error("Please upload your resume!");
      return;
    }
  
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("coverLetter", coverLetter);
    formData.append("resume", resume);
    // eslint-disable-next-line no-undef
    formData.append("jobId", id);
  
    try {
      const { data } = await axios.post(
        "http://localhost:5174/api/v1/application/post",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      // Reset form fields
      setName("");
      setEmail("");
      setCoverLetter("");
      setPhone("");
      setAddress("");
      setResume(null);
      toast.success(data.message);
      navigateTo("/job/getall");
    } catch (error) {
      console.error("Error:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };
  

  if (!isAuthorized || (user && user.role === "Employer")) {
    navigateTo("");
  }

  return (
    <section className="application">
      <div className="container">
        <h3>Application Form</h3>
        <form onSubmit={handleApplication}>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="number"
            placeholder="Your Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="text"
            placeholder="Your Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <textarea
            placeholder="CoverLetter..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
          <div>
            <label
              style={{ textAlign: "start", display: "block", fontSize: "20px" }}
            >
              Select Resume
            </label>
            <input
              type="file"
              accept=".jpg, .png, .webp"
              // eslint-disable-next-line no-undef
              onChange={handleFileChange}
              style={{ width: "100%" }}
            />
          </div>
          <button type="submit">Send Application</button>
        </form>
      </div>
    </section>
  );
};

// export default Application;

// // eslint-disable-next-line no-unused-vars
// import React from 'react'

// const Application = () => {
//   return (
//     <div>Application</div>
//   )
// }

 export default Application;