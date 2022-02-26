import React, { useState, useEffect, useContext } from "react";
import "./SignIn.scss";
import { useHttp } from "../../hooks/http.hook";
import { AuthContext } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, error, request, clearError } = useHttp();
  const auth = useContext(AuthContext);

  const loginHandler = async () => {
    try {
      const data = await request("/api/auth/login", "POST", {
        email,
        password,
      });
      auth.login(data.token, data.userId);
    } catch (e) {}
  };

  useEffect(() => {
    toast.error(error, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    clearError();
  }, [error, clearError]);

  const submitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <div className="limiter">
        <div className="background">
          <div className="shape"></div>
          <div className="shape"></div>
        </div>
        <div className="container-login100">
          <div className="wrap-login100 first-padding">
            <div className="login100-pic js-tilt">
              <img src="images/login.svg" alt="IMG" height="270" />
            </div>

            <form
              className="login100-form validate-form"
              onSubmit={submitHandler}
            >
              <span className="login100-form-title">Авторизация</span>

              <div
                className="wrap-input100 validate-input"
                data-validate="Valid email is required: ex@abc.xyz"
              >
                <input
                  className="input100"
                  type="text"
                  name="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="fa fa-envelope" aria-hidden="true"></i>
                </span>
              </div>

              <div
                className="wrap-input100 validate-input"
                data-validate="Password is required"
              >
                <input
                  className="input100"
                  type="password"
                  name="pass"
                  placeholder="Пароль"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="fa fa-lock" aria-hidden="true"></i>
                </span>
              </div>

              <div className="container-login100-form-btn">
                <button
                  className="login100-form-btn"
                  onClick={loginHandler}
                  disabled={loading}
                >
                  {loading ? (
                    <img
                      src="images/25.svg"
                      width="45"
                      height="45"
                      alt="Загрузка..."
                    />
                  ) : (
                    "Вход"
                  )}
                </button>
              </div>

              <div className="text-center p-t-136 reg-link">
                <a className="txt2" href="/register">
                  Создайте свой Аккаунт
                  <i
                    className="fa-long-arrow-right m-l-5"
                    aria-hidden="true"
                  ></i>
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default SignIn;
