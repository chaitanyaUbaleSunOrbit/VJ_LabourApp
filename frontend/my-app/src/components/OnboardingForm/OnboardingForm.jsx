
import React, { useState,useRef,useEffect } from "react";
import { InputLabel } from '@mui/material';
import "./onBoardingForm.css";
import axios from 'axios';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
const OnboardingForm = ({ formType, onFormSubmit }) => {
  // const [formData, setFormData] = useState({});
  const [formData, setFormData] = useState({
    aadhaarNumber: '',
    name: '',
    contactNumber: '',
    dateOfBirth: '',
    village: '',
    taluka: '',
    district: '',
    state: '',
    pincode: ''
  });
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [aadhaarImage, setAadhaarImage] = useState(null);
  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    let age = today.getFullYear() - selectedDate.getFullYear();
    const birthdayThisYear = new Date(today.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    if (today < birthdayThisYear) {
      age--;
    }
    if (age < 18) {
      setErrorMessage('Age must be 18 or older.');
    } else {
      setErrorMessage('');
    }
    setDateOfBirth(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Submitting ${formType} form`, formData);
    onFormSubmit(formType);
  };

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   console.log("Selected file:", file);
  // };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log("Selected file:", file);
    setAadhaarImage(file);
    uploadAadhaarImageToSurepass(file);
  };

  // const uploadAadhaarImageToSurepass = async (file) => {
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   // formData.append('apikey', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY0NzEwNDcxNCwianRpIjoiOWNhMDViZTAtZTMwYS00NTc5LTk5MzEtYWY3MmVmYzg1ZGFhIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LmphdmRla2Fyc0BhYWRoYWFyYXBpLmlvIiwibmJmIjoxNjQ3MTA0NzE0LCJleHAiOjE5NjI0NjQ3MTQsInVzZXJfY2xhaW1zIjp7InNjb3BlcyI6WyJyZWFkIl19fQ.cGYIaxfNm0BDCol5_7I1DaJFZE-jXSel2E63EHl2A4A');

  //   try {
  //     const response = await axios.post('https://kyc-api.aadhaarkyc.io/api/v1/ocr/aadhaar', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //         'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY0NzEwNDcxNCwianRpIjoiOWNhMDViZTAtZTMwYS00NTc5LTk5MzEtYWY3MmVmYzg1ZGFhIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LmphdmRla2Fyc0BhYWRoYWFyYXBpLmlvIiwibmJmIjoxNjQ3MTA0NzE0LCJleHAiOjE5NjI0NjQ3MTQsInVzZXJfY2xhaW1zIjp7InNjb3BlcyI6WyJyZWFkIl19fQ.cGYIaxfNm0BDCol5_7I1DaJFZE-jXSel2E63EHl2A4A'
  //       }
  //     });

  //     const { data } = response;
  //     console.log(data)
  //     if (data && data.result) {
  //       setFormData({
  //         aadhaarNumber: data.result.ocr_fields,
  //         name: data.result.name,
  //         contactNumber: data.result.contactNumber, // if available in response
  //         dateOfBirth: data.result.dateOfBirth
  //       });
  //       setDateOfBirth(data.result.dateOfBirth);
  //     }
  //   } catch (error) {
  //     console.error('Error uploading Aadhaar image to Surepass:', error);
  //   }
  // };
  const uploadAadhaarImageToSurepass = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axios.post('https://kyc-api.aadhaarkyc.io/api/v1/ocr/aadhaar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY0NzEwNDcxNCwianRpIjoiOWNhMDViZTAtZTMwYS00NTc5LTk5MzEtYWY3MmVmYzg1ZGFhIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LmphdmRla2Fyc0BhYWRoYWFyYXBpLmlvIiwibmJmIjoxNjQ3MTA0NzE0LCJleHAiOjE5NjI0NjQ3MTQsInVzZXJfY2xhaW1zIjp7InNjb3BlcyI6WyJyZWFkIl19fQ.cGYIaxfNm0BDCol5_7I1DaJFZE-jXSel2E63EHl2A4A'
        }
      });
  
      const { data } = response;
      console.log(data)
    if (data && data.success && data.data && data.data.ocr_fields && data.data.ocr_fields.length > 0) {
      const ocrFields = data.data.ocr_fields[0]; // Assuming only one OCR field object is returned

      setFormData({
        aadhaarNumber: ocrFields.aadhaar_number.value,
        name: ocrFields.full_name.value,
        dateOfBirth: ocrFields.dob.value,
        gender: ocrFields.gender.value,
        village: formData.village,
          taluka: formData.taluka,
          district: formData.district,
          state: formData.state,
          pincode: formData.pincode
      });
      setDateOfBirth(ocrFields.dob.value);
    } else {
      console.error('Error uploading Aadhaar image to Surepass: OCR fields not found in response');
    }
  } catch (error) {
    console.error('Error uploading Aadhaar image to Surepass:', error);
  }
};
  
  const renderRequiredAsterisk = (isRequired) => {
    return isRequired ? <span style={{ color: "red" }}> *</span> : null;
  };


// const handleAddressChange = async (e) => {
//   const address = e.target.value;
//   setFormData({ ...formData, address }); 

//   try {
//     // const response = await axios.get(`https://us1.locationiq.com/v1/search.php?key=pk.3db117d75e7099fdfe3a158dbec88adb&q=${address}&format=json`);
//     const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
    
//     setSuggestions(response.data);
//   } catch (error) {
//     console.error('Error fetching address suggestions:', error);
//     setSuggestions([]);
//   }
// }; 
const handlePincodeChange = async (e) => {
  const pincode = e.target.value;
  setFormData({ ...formData, pincode });

  if (pincode.length === 6) {
    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);

      if (response.data && response.data[0] && response.data[0].Status === "Success") {
        const postOffice = response.data[0].PostOffice[0];
        setFormData((prevFormData) => ({
          ...prevFormData,
          village: postOffice.Name,
          taluka: postOffice.Block,
          district: postOffice.District,
          state: postOffice.State
        }));
      } else {
        console.error('Location data not found');
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
  }
};

const handleAddressSelect = (selectedAddress) => {
  const addressComponents = selectedAddress.display_name.split(', ');
  const city = addressComponents[1];
  const taluka = addressComponents[1];
  const district = addressComponents[2];
  const state = addressComponents[3];
  const pincode = addressComponents[7] || addressComponents[5] || addressComponents[6];

  setFormData((prevFormData) => ({
    ...prevFormData,
    address: selectedAddress.display_name,
    village: city, 
    taluka: taluka || '',
    district: district || '',
    state: state || '',
    pincode: pincode || '', 
  }));

  setSuggestions([]);
};


 
  return (
    <div className="onboarding-form-container">
      <div className="title">
        <h2>
          {formType === "kyc" ? "KYC Form" : "Labour Onboarding Form"}
        </h2>
      </div>
      <div className="form-body">
        <form className="onboarding-form" onSubmit={handleSubmit}>
          {formType === "kyc" && (
            <>
              {/* KYC Form Fields */}
              <div className="labour-adhaar">
               <div className="labour-ownership">
                <InputLabel
                  id="demo-simple-select-label"
                  sx={{ color: "black" }}
                >
                  Labour ownership {renderRequiredAsterisk(true)}
                </InputLabel>
                <div id="select-container">
                  <select
                    id="labourOwnership"
                    className="select-box"
                    name="labourOwnership"
                    required
                    value={formData.aadhaarNumber}
                  >
                    <option value="VJ">VJ</option>
                    <option value="Contractor">Contractor</option>
                  </select>
                </div>
              </div>

              {/* <div className="adharNumber">
                <InputLabel
                  id="demo-simple-select-label"
                  sx={{ color: "black" }}
                >
                  Aadhaar Number {renderRequiredAsterisk(true)}
                </InputLabel>

                <div id="adhaar-input">
                <input 
                value={formData.aadhaarNumber}
                onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value })}
                 required 
                />
                </div>
              </div> */}
                           <div className="project-field">
  <InputLabel id="aadhaar-label" sx={{ color: "black" }}>
    Upload Aadhaar{renderRequiredAsterisk(true)}
  </InputLabel>
  <div className="input-with-icon">
    <input type="file" onChange={handleFileChange} required />
    <DocumentScannerIcon className="input-icon" />
  </div>
</div>
              </div>
              <div className="name-contact">
                <div className="name">
                  <InputLabel
                    id="demo-simple-select-label"
                    sx={{ color: "black" }}
                  >
                    Name{renderRequiredAsterisk(true)}
                  </InputLabel>
                  <input value={formData.name || ""} required
                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="contact">
                  <InputLabel
                    id="demo-simple-select-label"
                    sx={{ color: "black" }}
                  >
                    Contact number{renderRequiredAsterisk(true)}
                  </InputLabel>

                  <input
                   value={formData.contactNumber || ""} 
                   onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  required />
                </div>
              </div>
              <div className="birth-aadhaar">
              <div className="date">
                <div className="birth-date">
                  <InputLabel
                    id="demo-simple-select-label"
                    sx={{ color: "black" }}
                  >
                    Date of Birth{renderRequiredAsterisk(true)}
                  </InputLabel>
                  <input 
        className="date-input" 
        type="date" 
        value={dateOfBirth} 
        onChange={handleDateChange}
        max="2006-01-01" // Setting the max date to January 1st, 2006
        required 
      />
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
                </div>
              </div>
            
              {/* <div className="project-field">
  <InputLabel id="aadhaar-label" sx={{ color: "black" }}>
    Upload Aadhaar{renderRequiredAsterisk(true)}
  </InputLabel>
  <div className="input-with-icon">
    <input type="file" onChange={handleFileChange} required />
    <DocumentScannerIcon className="input-icon" />
  </div>
</div> */}
<div className="adharNumber">
                <InputLabel
                  id="demo-simple-select-label"
                  sx={{ color: "black" }}
                >
                  Aadhaar Number {renderRequiredAsterisk(true)}
                </InputLabel>

                <div id="adhaar-input">
                <input 
                value={formData.aadhaarNumber}
                onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value })}
                 required 
                />
                </div>
              </div>

              </div>
              
              <div className="gender">
                <InputLabel
                  id="demo-simple-select-label"
                  sx={{ color: "black" }}
                >
                  Gender{renderRequiredAsterisk(true)}
                </InputLabel>
                <div className="gender-input">
                  <select 
                  id="gender"
                   name="gender" 
                   required
                   onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                   >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
              
              <div className="save-btn">
                <button type="submit" id="save">
                  Save details
                </button>
              </div>
            </>
          )}
          {formType === "bankDetails" && (
            <>
              {/* Bank Details Form Fields */}
              <div className="bankDetails-field">
                <InputLabel id="hsc-label" sx={{ color: "black" }}>
                  Bank Name{renderRequiredAsterisk(true)}
                </InputLabel>
                <input type="text" id="hsc" name="hsc" required />
              </div>

              <div className="bankDetails-field">
                <InputLabel id="ssc-label" sx={{ color: "black" }}>
                  Branch{renderRequiredAsterisk(true)}
                </InputLabel>
                <input type="text" id="ssc" name="ssc" required />
              </div>

              <div className="bankDetails-field">
                <InputLabel
                  id="higher-bankDetails-label"
                  sx={{ color: "black" }}
                >
                  Account Number{renderRequiredAsterisk(true)}
                </InputLabel>
                <input type="text" />
              </div>

              <div className="bankDetails-field">
                <InputLabel id="marks-label" sx={{ color: "black" }}>
                  IFSC code{renderRequiredAsterisk(true)}
                </InputLabel>
                <input type="text" id="marks" name="marks" required />
              </div>
              <div className="bankDetails-field">
                <InputLabel id="salary-label" sx={{ color: "black" }}>
                  Id Card{renderRequiredAsterisk(true)}
                </InputLabel>
                {/* <input type="text" id="salary" name="salary" required /> */}
                <input type="file" onChange={handleFileChange} required />
              </div>
              <div className="save-btn">
                <button type="submit" id="save">
                  Save details
                </button>
              </div>
            </>
          )}
          {formType === "project" && (
            <>
              {/* Project Form Fields */}
              <div className="project-field">
                <InputLabel id="company-name-label" sx={{ color: "black" }}>
                  Project Name{renderRequiredAsterisk(true)}
                </InputLabel>
                <div className="gender-input">
                  <select id="gender" name="gender" required>
                    <option value="YashOne Infinitee">YashOne Infinitee</option>
                    <option value="New Test Project">New Test Project</option>
                  </select>
                </div>
              </div>

              <div className="project-field">
                <InputLabel id="position-label" sx={{ color: "black" }}>
                  Labour Category{renderRequiredAsterisk(true)}
                </InputLabel>
                <div className="gender-input">
                  <select id="gender" name="gender" required>
                    <option value="Skilled">Skilled</option>
                    <option value="Semi-Skilled">Semi-Skilled</option>
                    <option value="Unskilled">Unskilled</option>
                  </select>
                </div>
              </div>

              <div className="project-field">
                <InputLabel id="project-location-label" sx={{ color: "black" }}>
                  Department{renderRequiredAsterisk(true)}
                </InputLabel>
               
                <div className="gender-input">
                  <select id="gender" name="gender" required>
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="CCA">CCA</option>
                    <option value="EHCS">EHCS</option>
                    <option value="Firefighting">Firefighting</option>
                    <option value="MQC">MQC</option>
                    <option value="FEP">FEP</option>
                    <option value="E&C">E&C</option>
                  </select>
                </div>
              </div>

              <div className="project-field">
                <InputLabel id="salary-label" sx={{ color: "black" }}>
                  Working Hours{renderRequiredAsterisk(true)}
                </InputLabel>
                {/* <input type="text" id="salary" name="salary" required /> */}
                <div className="gender-input">
                  <select id="gender" name="gender" required>
                    <option value="8 hours">8 hours</option>
                    <option value="9 hours">9 hours</option>
                  </select>
                </div>
              </div>

             
              <div className="save-btn">
                <button type="submit" id="save">
                  Save details
                </button>
              </div>
            </>
          )}
          {formType === "personal" && (
            <>
              {/* Personal Form Fields */}
              <div className="joining-date">
                <InputLabel
                  id="demo-simple-select-label"
                  sx={{ color: "black" }}
                >
                  Date of joining{renderRequiredAsterisk(true)}
                </InputLabel>
                <input
                  className="date-input"
                  type="date"
                  id="dateOfJoining"
                  name="dateOfJoining"
                  required
                />
              </div>
              <div className="locations">
                <div className="location-address-label">
                  <InputLabel
                    id="demo-simple-select-label"
                    sx={{ color: "black" }}
                  >
                    Address{renderRequiredAsterisk(true)}
                  </InputLabel>
                  <input
                    className="address"
                    type="text"
                    id="address"
                    name="address"
                    required
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    value={formData.address || ''}
                  />
                  {suggestions.length > 0 && (
                    <div className="address-suggestions">
                      {suggestions.map((address, index) => (
                        <div
                          key={index}
                          className="address-suggestion"
                          onClick={() => handleAddressSelect(address)}
                        >
                          {address.display_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="location-Village-label">
                  <InputLabel
                    id="demo-simple-select-label"
                    sx={{ color: "black" }}
                  >
                    Village/City{renderRequiredAsterisk(true)}
                  </InputLabel>
                  <input
                    className="village"
                    type="text"
                    id="village"p
                    name="village"
                    required
                    value={formData.village || ''}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  />
                </div>
                </div>
              <div className="locations">
                <div className="location-taluka-label">
                  <InputLabel
                    id="demo-simple-select-label"
                    sx={{ color: "black" }}
                  >
                    Taluka{renderRequiredAsterisk(true)}
                  </InputLabel>
                  <input
                    className="taluka"
                    type="text"
                    id="taluka"
                    name="taluka"
                    required
                    // value={formData.taluka || ''}
                    // onChange={(e) => setFormData({ ...formData, taluka: e.target.value })}
                    value={formData.taluka || ''}
                    onChange={(e) => setFormData({ ...formData, taluka: e.target.value })}
                  />
                </div>

                <div className="location-district-label">
                  <InputLabel
                    id="demo-simple-select-label"
                    sx={{ color: "black" }}
                  >
                    District{renderRequiredAsterisk(true)}
                  </InputLabel>
                  <input
                    className="district"
                    type="text"
                    id="district"
                    name="district"
                    required
                    // value={formData.district || ''}
                    // onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    value={formData.district || ''}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  />
                </div>
                
              </div>

              <div className="state-block">
                <div className="personal-pincode-field">
                  <InputLabel
                    id="personal-pincode-label"
                    sx={{ color: "black" }}
                  >
                    Pincode{renderRequiredAsterisk(true)}
                  </InputLabel>

                  <input
                    type="text"
                    id="personal-pincode"
                    name="personal-pincode"
                    required
                    // value={formData.pincode || ''}
                    // onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    value={formData.pincode || ''}
                    onChange={handlePincodeChange}
                  />
                </div>

                <div className="location-state-label">
                  <InputLabel
                    id="demo-simple-select-label"
                    sx={{ color: "black" }}
                  >
                    State{renderRequiredAsterisk(true)}
                  </InputLabel>
                  <input
                    className="state"
                    type="text"
                    id="state"
                    name="state"
                    required
                    // value={formData.state || ''}
                    // onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    value={formData.state || ''}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>
              </div>

              <div className="em-contact-block">
                <div className="personal-emcontact-field">
                  <InputLabel
                    id="personal-emcontact-label"
                    sx={{ color: "black" }}
                  >
                    Emergency Contact{renderRequiredAsterisk(true)}
                  </InputLabel>

                  <input
                    type="text"
                    id="personal-emcontact"
                    name="personal-emcontact"
                    required
                  />
                </div>

                <div className="location-photo-label">
                  <InputLabel
                    id="demo-simple-select-label"
                    sx={{ color: "black" }}
                  >
                    Capture Photo{renderRequiredAsterisk(true)}
                  </InputLabel>
                  <input
                    className="photo"
                    type="text"
                    id="photo"
                    name="photo"
                    required
                  />
                </div>
              </div>
              <div className="save-btn">
                <button type="submit" id="save">
                  Save details
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default OnboardingForm;
