import React, { useState, useRef } from "react";
import Input from "./FormInput.jsx";
import logo_user from "../../assets/images/logo_user.png";
import welcomeImg from "../../assets/images/welcomeImg.b7499ecccb4de3e517812e34c60bf8cf.svg";
import SubmitButton from "../common/buttons/SubmitButton.jsx";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { ApiHook } from "../../redux/hooks/apiHook.js";
// import { useSelector } from "react-redux";

const LoginForm = ({ params, selectedPage, setSelectedPage }) => {
  const [credentials, setCredentials] = useState({
    email: params.email ?? "",
    password: params.password ? "12345678" : "",
  });
  const [errorMessage, setErrorMessage] = useState({
    email: null,
    password: null,
    userCredentials: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  // const [selectedPage, setSelectedPage] = useState("login");
  // const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const isSubmittingRef = useRef(false);
  const loginMutation = ApiHook.CallLoginUser();
  // const verifyOtp = ApiHook.Call2faVerifyOtp();
  const forgotPasswordMutation = ApiHook.CallForgotPassword();
  // const [otp, setotp] = useState("");
  // const { isEnabled, twoFadata } = useSelector(
  //   (state) => state?.user?.twoFaAuth
  // );

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
    setErrorMessage((prev) => ({
      ...prev,
      [name]: null,
    }));

    setErrorMessage((prev) => ({
      ...prev,
      userCredentials: null,
    }));

    if (value === null || value === "") {
      setErrorMessage((prev) => ({
        ...prev,
        [name]: "*Required",
      }));
    }
  };

  const isFormValid = () => {
    return (
      credentials?.password.trim() !== "" && credentials?.email.trim() !== ""
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isSubmittingRef.current) {
      isSubmittingRef.current = true;
      await loginMutation.mutateAsync(credentials, {
        onSuccess: (res) => {
          if (res?.code === 1003) {
            setErrorMessage({
              userCredentials: res?.data,
            });
          } else if (res?.code === 1037) {
            setErrorMessage({
              userCredentials: res?.data,
            });
          } else {
            setErrorMessage({
              adminUsername: res?.data,
            });
          }
        },
      });
      isSubmittingRef.current = false;
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    if (!isSubmittingRef.current) {
      isSubmittingRef.current = true;
      await forgotPasswordMutation.mutateAsync(credentials.username, {
        onSuccess: (res) => {},
      });
    }
  };

  return (
    <>
      <div className="col-md-6 logincredDetail">
        <div className="loginFormSec login_left_section">
          <div className="loginLogo">
            <img src={logo_user} alt="" />
          </div>
          <p>Welcome Back to company Name</p>
          {selectedPage === "login" ? (
            <>
              {
                <form onSubmit={handleSubmit}>
                  {errorMessage?.userCredentials && (
                    <div style={{ color: "red", textAlign: "center" }}>
                      {errorMessage?.userCredentials}
                    </div>
                  )}
                  <Input
                    type="text"
                    id="email"
                    name="email"
                    placeholder="Email"
                    value={credentials.email}
                    onChange={handleChange}
                  />
                  {errorMessage?.email && (
                    <div style={{ color: "red" }}>{errorMessage?.email}</div>
                  )}
                  <div className="LoginPasswordField">
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder="Password"
                      value={credentials.password}
                      onChange={handleChange}
                    />
                    <InputAdornment
                      position="end"
                      style={{ position: "absolute", right: 0, top: 32 }}
                    >
                      <IconButton
                        onClick={handleShowPassword}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  </div>
                  {errorMessage?.password && (
                    <div style={{ color: "red" }}>{errorMessage?.password}</div>
                  )}
                  {/* <a
                      className="forgetPassword"
                      onClick={() => setSelectedPage("resetPassword")}
                    >
                      Forgot Password?
                    </a> */}
                  <div className="loginBtn">
                    <SubmitButton
                      isSubmitting={!isFormValid()}
                      click={handleSubmit}
                      text={loginMutation.isLoading ? "Submitting..." : "Login"}
                      className={"btn"}
                    />
                  </div>
                  <p>
                    Don't have an account?{" "}
                    <a
                      href="/register"
                      style={{
                        fontSize: "16px",
                        textDecoration: "underline",
                        color: "rgb(61 66 195)",
                      }}
                    >
                      Signup now
                    </a>
                  </p>
                </form>
              }
            </>
          ) : (
            <form onSubmit={resetPassword}>
              <Input
                type="text"
                id="fname"
                name="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {errorMessage?.username && (
                <div style={{ color: "red" }}>{errorMessage?.username}</div>
              )}
              <div className="loginBtn">
                <SubmitButton
                  // isSubmitting={!isFormValid()}
                  click={resetPassword}
                  text={
                    loginMutation.isLoading
                      ? "Sending mail..."
                      : "Change Password"
                  }
                  className={"btn"}
                />
              </div>
              <p>
                Don't have an account?{" "}
                <a
                  href="https://infinitemlmsoftware.com/register.php"
                  target="_blank"
                  style={{
                    fontSize: "16px",
                    textDecoration: "underline",
                    color: "rgb(61 66 195)",
                  }}
                >
                  Signup now
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
      <div className="col-md-6">
        <div className="welcomeImgSec">
          <div className="welcomHeadSec">
            <p>Hello,</p>
            <h2>Welcome</h2>
            <p>Enter your credentials and login</p>
          </div>
          <div className="welcomeImg">
            <img src={welcomeImg} alt="" />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
