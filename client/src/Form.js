import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


import "./Form.css";

function Form() {
  const [formData, setFormData] = useState({
    certificateNo: "",
    registerNo: "",
    dateOfIssue: "",
    staringPeriod: "",
    endingPeriod: "",
    department:"",
    studentName: "",
    cgpa: "",
  });



  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };


  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
      navigate('/certificate', { state: { formData } });
  };

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <label>
          Certificate Number:
          <input
            type="text"
            name="certificateNo"
            value={formData.certificateNo}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Register Number:
          <input
            type="text"
            name="registerNo"
            value={formData.registerNo}
            onChange={handleChange}
          />
        </label>
        <br />

        <label>
          Student Name:
          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
          />
        </label>

        <br />

    <div className="flex">
        <label>
          Student Joining Date:
          <input
            type="date"
            name="staringPeriod"
            value={formData.staringPeriod}
            onChange={handleChange}
          />
        </label>
        <br />

        <label>
          Student Ending Date:
          <input
            type="date"
            name="endingPeriod"
            value={formData.endingPeriod}
            onChange={handleChange}
          />
        </label>
     </div>

    <div className="mt-5">
            <label>
              Department:
              <br />
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="">* Select Department *</option>
                <option value="Diploma In Computer Science and Technology">Diploma In Computer Science and Technology</option>
                <option value="Diploma In Mechanical Engineering">Diploma In Mechanical Engineering</option>
                <option value="Diploma In Civil Engineering">Diploma In Civil Engineering</option>
                <option value="Diploma In Electronics and Communication Engineering">Diploma In Electronics and Communication Engineering</option>
                <option value="Diploma In Electronics Engineering">Diploma In Electronics Engineering</option>
              </select>
            </label>
    </div>

  <div className="flex">
        <label>
          CGPA:
          <br />
          <input type="text" name="cgpa" value={formData.cgpa} onChange={handleChange} />
        </label>
        <br />
        <label>
          Date of Issue:
            <br />
          <input
            type="date"
            name="dateOfIssue"
            value={formData.dateOfIssue}
            onChange={handleChange}
          />
        </label>
   </div>
        <br />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Form;
