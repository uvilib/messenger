import React from "react";
import "./FirstStep.scss";

const FirstStep = ({
  submitHandler,
  changeLoginHandler,
  changePasswordHandler,
  changeRepPasswordHandler,
  nextRegisterHandler,
  login,
  password,
  repPassword,
}) => {
  return (
    <>
      <div className="limiter">
        <div className="first-step-background">
          <div className="first-step-shape"></div>
          <div className="first-step-shape"></div>
        </div>
        <div className="container-login100">
          <div className="wrap-login100 first-padding">
            <div className="login100-pic js-tilt">
              <img src="images/reg.png" alt="IMG" />
            </div>

            <form
              className="login100-form validate-form"
              onSubmit={submitHandler}
            >
              <span className="login100-form-title">Регистрация</span>

              <div
                className="wrap-input100 validate-input"
                data-validate="Valid email is required: ex@abc.xyz"
              >
                <input
                  className="input100"
                  type="text"
                  name="email"
                  value={login !== undefined ? login : ""}
                  placeholder="Введите Email"
                  onChange={(event) => changeLoginHandler(event)}
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
                  autoComplete="new-password"
                  placeholder="Введите пароль"
                  value={password !== undefined ? password : ""}
                  onChange={(event) => changePasswordHandler(event)}
                />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="fa fa-lock" aria-hidden="true"></i>
                </span>
              </div>

              <div
                className="wrap-input100 validate-input"
                data-validate="Password is required"
              >
                <input
                  className="input100"
                  type="password"
                  name="reppass"
                  autoComplete="new-password"
                  placeholder="Повторно введите пароль"
                  value={repPassword !== undefined ? repPassword : ""}
                  onChange={(event) => changeRepPasswordHandler(event)}
                />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="fa fa-lock" aria-hidden="true"></i>
                </span>
              </div>

              <div className="container-login100-form-btn">
                <button
                  className="login100-form-btn"
                  onClick={nextRegisterHandler}
                >
                  Зарегистрироваться
                </button>
              </div>

              <div className="text-center p-t-136 reg-link">
                <p>Уже есть аккаунт?</p>
                <a className="txt2" href="/">
                  Войти
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
    </>
  );
};

export default FirstStep;
