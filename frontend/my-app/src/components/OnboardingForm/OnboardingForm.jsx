
import React, { useState,useRef,useEffect } from "react";
import { InputLabel } from '@mui/material';
import "./onBoardingForm.css";
import axios from 'axios';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
const OnboardingForm = ({ formType, onFormSubmit }) => {
  const [formData, setFormData] = useState({});
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
    uploadAadhaarImageToOCRSpace(file);
  };

  const uploadAadhaarImageToOCRSpace = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('apikey', 'YOUR_OCR_API_KEY');
    formData.append('language', 'eng');

    try {
      const response = await axios.post('https://api.ocr.space/parse/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const { ParsedResults } = response.data;
      if (ParsedResults && ParsedResults.length > 0) {
        const parsedData = ParsedResults[0];
        // Extract relevant fields from parsed data and update form state
        setFormData({
          aadhaarNumber: parsedData.ParsedText.match(/\d{4}\s\d{4}\s\d{4}/)[0],
          name: parsedData.ParsedText.match(/(Name)(.*?)(Father|Mother|Spouse)/)[2].trim(),
          dateOfBirth: parsedData.ParsedText.match(/\d{2}\/\d{2}\/\d{4}/)[0],
          // You may need to extract contact number and other fields similarly
        });
      }
    } catch (error) {
      console.error('Error uploading Aadhaar image to OCR.space:', error);
    }
  };

  const renderRequiredAsterisk = (isRequired) => {
    return isRequired ? <span style={{ color: "red" }}> *</span> : null;
  };


const handleAddressChange = async (e) => {
  const address = e.target.value;
  setFormData({ ...formData, address }); // Update formData with address

  try {
    const response = await axios.get(`https://us1.locationiq.com/v1/search.php?key=pk.3db117d75e7099fdfe3a158dbec88adb&q=${address}&format=json`);
    setSuggestions(response.data);
  } catch (error) {
    console.error('Error fetching address suggestions:', error);
    setSuggestions([]);
  }
}; 

// const handleAddressSelect = (selectedAddress) => {

//   setFormData((prevFormData) => ({
//     ...prevFormData,
//     address: selectedAddress.display_name,
//     village: selectedAddress.address?.city || selectedAddress.address?.town || selectedAddress.address?.village || '',
//     taluka: selectedAddress.address?.suburb || '',
//     district: selectedAddress.address?.county || '',
//     state: selectedAddress.address?.state || '',
//     pincode: selectedAddress.address?.postcode || '',
//   }));
//   setSuggestions([]);
// };
const handleAddressSelect = (selectedAddress) => {
  // Extract city, taluka, district, and state from display_name
  const addressComponents = selectedAddress.display_name.split(', ');
  const city = addressComponents[1];
  const taluka = addressComponents[1];
  const district = addressComponents[2];
  const state = addressComponents[3];
  const pincode = addressComponents[7];

  // Update formData with selected address details
  setFormData((prevFormData) => ({
    ...prevFormData,
    address: selectedAddress.display_name,
    village: city, // Assuming city as village, you may adjust this if needed
    taluka: taluka || '',
    district: district || '',
    state: state || '',
    pincode: pincode || '', // Reset pincode, as it's not provided by the API response
  }));

  // Clear suggestions
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

              <div className="adharNumber">
                <InputLabel
                  id="demo-simple-select-label"
                  sx={{ color: "black" }}
                >
                  Aadhaar Number {renderRequiredAsterisk(true)}
                </InputLabel>

                <div id="adhaar-input">
                <input value={formData.aadhaarNumber} required />
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
                  <input value={formData.name} required />
                </div>

                <div className="contact">
                  <InputLabel
                    id="demo-simple-select-label"
                    sx={{ color: "black" }}
                  >
                    Contact number{renderRequiredAsterisk(true)}
                  </InputLabel>

                  <input value={formData.contactNumber} required />
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
                <InputLabel id="salary-label" sx={{ color: "black" }}>
                  Upload Aadhaar{renderRequiredAsterisk(true)}
                </InputLabel>
                <input type="file" onChange={handleFileChange} required />
                <DocumentScannerIcon />
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
              
              <div className="gender">
                <InputLabel
                  id="demo-simple-select-label"
                  sx={{ color: "black" }}
                >
                  Gender{renderRequiredAsterisk(true)}
                </InputLabel>
                <div className="gender-input">
                  <select id="gender" name="gender" required>
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
                    onChange={handleAddressChange}
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
                    value={formData.pincode || ''}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
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
