import React, { useState, useRef, useEffect, useContext } from "react";
import { useHttp } from "../../../hooks/http.hook";
import "./NextStep.scss";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { initializeApp } from "firebase/app";
import { AuthContext } from "../../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NextStep = ({ email, password, setRegClick }) => {
  const [name, setName] = useState();
  const [surname, setSurname] = useState();
  const [loadImg, setLoadImg] = useState(false);
  const [storageRef, setStorageRef] = useState();
  const file = useRef();
  const [image, setImage] = useState();

  const { loading, error, request, clearError } = useHttp();
  const auth = useContext(AuthContext);

  const submitHandler = (event) => {
    event.preventDefault();
  };

  let textLength = 1;

  if (name && !surname) {
    const text = name.length + 7;
    textLength = text;
  }
  if (surname && !name) {
    const text = surname.length + 4;
    textLength = text;
  }
  if (surname && name) {
    const text = surname.length + name.length;
    textLength = text;
  }

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

    if (error === "Пользователь с таким email уже существует") {
      deleteObject(storageRef)
        .then(() => {
          console.log("Delete");
        })
        .catch((error) => {
          console.log("Error: ", error);
        });
    }

    clearError();
  }, [error, clearError, storageRef]);

  const registerHandler = async () => {
    if (name && surname && file.current) {
      try {
        const firebaseConfig = {
          apiKey: "AIzaSyAtowZUkSuiNp9x1obYETrHTIHAOfVeFm0",
          authDomain: "messenger-1f1d0.firebaseapp.com",
          databaseURL:
            "https://messenger-1f1d0-default-rtdb.europe-west1.firebasedatabase.app",
          projectId: "messenger-1f1d0",
          storageBucket: "messenger-1f1d0.appspot.com",
          messagingSenderId: "122419837822",
          appId: "1:122419837822:web:1bfa9659372c69ed55912f",
          measurementId: "G-75NYQMMLNE",
        };

        initializeApp(firebaseConfig);

        const storage = getStorage();
        const storageRef = ref(storage, file.current.name);
        setStorageRef(storageRef);

        const uploadTask = uploadBytesResumable(storageRef, file.current);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          },
          (error) => {},
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                const imgURL = JSON.stringify(downloadURL);
                const data = await request("/api/auth/register", "POST", {
                  email,
                  password,
                  name,
                  surname,
                  imgURL,
                });
                auth.login(data.token, data.userId);
                toast.success("Пользователь создан!", {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              }
            );
          }
        );
      } catch (e) {}
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

  const previewImg = (file) => {
    const fileReader = new FileReader();
    fileReader.onload = function () {
      setImage(fileReader.result);
    };
    fileReader.readAsDataURL(file);
    setLoadImg(true);
  };

  return (
    <>
      <div className="limiter">
        <div className="next-step-background">
          <div className="next-step-shape"></div>
          <div className="next-step-shape"></div>
        </div>
        <div className="container-login100">
          <div className="next-step-wrap-login100">
            <div className="back-arrow">
              <button
                onClick={() => {
                  setRegClick(false);
                }}
              >
                <img
                  src="images/left-arrow2.svg"
                  alt="back"
                  width="35"
                  height="35"
                />
              </button>
            </div>
            <div className="block-flex-between">
              <form
                className="login100-form validate-form"
                onSubmit={submitHandler}
              >
                <span className="login100-form-title">Персональные данные</span>

                <div
                  className="wrap-input100 validate-input"
                  data-validate="Valid email is required: ex@abc.xyz"
                >
                  <input
                    className="input100"
                    type="text"
                    name="name"
                    autoComplete="none"
                    placeholder="Ваше имя"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                  <span className="focus-input100"></span>
                  <span className="symbol-input100">
                    <i className="fa fa-user" aria-hidden="true"></i>
                  </span>
                </div>

                <div
                  className="wrap-input100 validate-input"
                  data-validate="Valid email is required: ex@abc.xyz"
                >
                  <input
                    className="input100"
                    type="text"
                    name="surname"
                    autoComplete="none"
                    placeholder="Ваша фамилия"
                    onChange={(e) => {
                      setSurname(e.target.value);
                    }}
                  />
                  <span className="focus-input100"></span>
                  <span className="symbol-input100">
                    <i className="fa fa-user" aria-hidden="true"></i>
                  </span>
                </div>

                <div className="container-login100-form-btn">
                  <button
                    className="login100-form-btn"
                    onClick={registerHandler}
                    id="insert"
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
                      "Зарегистрироваться"
                    )}
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
              <div className="add-img">
                <span className="login100-form-title">
                  {loadImg ? "Предпросмотр" : "Добавьте фотографию"}
                </span>

                {loadImg ? (
                  <div className="previewImg">
                    <img src={image} width="50" height="50" alt="Загрузка..." />
                    <div className="user">
                      <div className="user-data" id="block-fix">
                        <span
                          id="span-fix"
                          style={{
                            fontSize: `${Math.min(
                              17,
                              (16 / textLength) * 17
                            )}px`,
                          }}
                        >
                          {name ? name : "Name"}&nbsp;
                          {surname ? surname : "Surname"}
                        </span>
                      </div>
                      <div className="user-info">
                        <img src="images/online.png" alt="online" height="10" />
                        &nbsp;
                        <span>Online</span>
                      </div>
                    </div>
                    <div className="closeBtn">
                      <button
                        onClick={() => {
                          setLoadImg(false);
                        }}
                      >
                        <img src="images/close2.svg" alt="close" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="input__wrapper">
                    <input
                      name="file"
                      type="file"
                      disabled={loading}
                      id="input__file"
                      className="input input__file"
                      onChange={(event) => {
                        file.current = event.target.files[0];
                        previewImg(event.target.files[0]);
                      }}
                      multiple
                    />
                    <label htmlFor="input__file" className="input__file-button">
                      <span className="input__file-icon-wrapper">
                        <img
                          className="input__file-icon"
                          src="images/add.svg"
                          alt="Выбрать файл"
                          width="25"
                        />
                      </span>
                      <span className="input__file-button-text">
                        Выберите файл
                      </span>
                    </label>
                  </div>
                )}
              </div>
            </div>
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

export default NextStep;
