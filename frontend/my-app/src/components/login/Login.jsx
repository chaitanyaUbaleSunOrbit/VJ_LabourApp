import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { IconButton, InputAdornment } from "@mui/material";
import "./login.css";

const Login = () => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [eye, setEye] = useState(false);

  const [valid, setValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);

  // Validity check for email
  const validateEmail = (email) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    return isValid;
  };

  // Validity check for password
  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    const isLengthValid = password.length >= 8;

    return (
      isLengthValid &&
      hasUpperCase &&
      hasNumber &&
      hasSpecialChar
    );
  };

  const handleEmailChange = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    setEmailValid(validateEmail(newEmail));
  };

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    setValid(validatePassword(newPassword));
  };
  
  const getPasswordHelperText = () => {
    if (!password) {
      return 'Password is required';
    } else if (password.length < 8) {
      return 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    } else if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    } else if (!/[!@#$%^&*]/.test(password)) {
      return 'Password must contain at least one special character (!@#$%^&*)';
    }
    return ''; // Return empty string when password is valid
  };

  const handleEye = () => {
    setEye(!eye);
  };

  return (
    <div className="container">
      <div className="loginbox">
        <div className="login-content">
          <div className="logo">
            <img src="vjlogo.png" alt="logo" />
          </div>
          <div className="title">
            <h2>Labour App</h2>
          </div>
          <div className="email-input">
            <TextField
              id="outlined-basic"
              value={email}
              onChange={handleEmailChange}
              type="email"
              label="Email"
              variant="outlined"
              error={!emailValid && email !== ''}
              helperText={!emailValid && email ? 'Please enter a valid email' : ''}
              fullWidth
            />
          </div>
          <div className="password-input">
            <TextField
              id="outlined-basic"
              value={password}
              onChange={handlePasswordChange}
              type={eye ? "text" : "password"}
              label="Password"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleEye}>
                      {eye ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={!valid && password !== ''}
              helperText={!valid && password ? getPasswordHelperText() : ''}
              fullWidth
            />
          </div>
          <div className="login-btn">
            <Button variant="contained" fullWidth sx={{ height: "50px", borderRadius: "10px", border: "none" }}>
              Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
