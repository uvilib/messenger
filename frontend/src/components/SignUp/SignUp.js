import React, { useState } from "react";
import FirstStep from "./components/FirstStep";
import NextStep from "./components/NextStep";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const [login, setLogin] = useState();
  const [password, setPassword] = useState();
  const [repPassword, setRepPassword] = useState();
  const [regClick, setRegClick] = useState(false);

  const submitHandler = (event) => {
    event.preventDefault();
  };

  const changeLoginHandler = (e) => {
    const loginForm = e.target.value;
    setLogin(loginForm);
  };

  const changePasswordHandler = (e) => {
    const passwordForm = e.target.value;

    setPassword(passwordForm);
  };

  const changeRepPasswordHandler = (e) => {
    const repPasswordForm = e.target.value;

    setRepPassword(repPasswordForm);
  };

  const nextRegisterHandler = () => {
    if (login && password && repPassword) {
      if (repPassword === password) {
        setRegClick(true);
      } else {
        toast.error("Неккоректный ввод повтора пароля", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } else {
      toast.error("Введите данные", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <>
      {regClick ? (
        <NextStep email={login} password={password} setRegClick={setRegClick} />
      ) : (
        <FirstStep
          submitHandler={submitHandler}
          changeLoginHandler={changeLoginHandler}
          changePasswordHandler={changePasswordHandler}
          changeRepPasswordHandler={changeRepPasswordHandler}
          nextRegisterHandler={nextRegisterHandler}
          login={login}
          password={password}
          repPassword={repPassword}
        />
      )}
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

export default SignUp;
