import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useHttp } from "../../hooks/http.hook";
import Loader from "../Loader/Loader";
import NullMembers from "../NullMembers/NullMembers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Members.scss";

const Members = ({ fetchMessages, setLoadConversation }) => {
  const auth = useContext(AuthContext);
  const [query, setQuery] = useState();
  const [searchMembers, setSearchMembers] = useState();
  const [members, setMembers] = useState();
  const { loading, request } = useHttp();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await request("/api/members/", "GET", null, {
        Authorization: `Bearer ${auth.token}`,
      });
      setMembers(data);
    } catch (e) {
      console.log(e.message);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  const queryHandler = (e) => {
    if (!e) {
      setSearchMembers(null);
      fetchData();
    }
  };

  const searchUsers = async () => {
    try {
      const data = await request(
        "/api/members/search",
        "POST",
        {
          substring: query,
        },
        { Authorization: `Bearer ${auth.token}` }
      );
      setSearchMembers(data);
    } catch (e) {
      console.log(e.message);
    }
  };

  const addMember = async (member) => {
    try {
      const data = await request(
        "/api/members/add",
        "POST",
        {
          memberArray: [
            {
              id: member._id,
              username: member.name + " " + member.surname,
              icon: member.imgURL,
            },
          ],
        },
        { Authorization: `Bearer ${auth.token}` }
      );

      if (data.message === "Друг создан") {
        searchUsers();
        toast.success(
          `${member.name + " " + member.surname} добавлен в друзья`,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      }
    } catch (e) {
      toast.error(e.message, {
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

  const deleteMember = async (id) => {
    console.log(id);
    const data = await request(
      "/api/members/delete",
      "POST",
      {
        id,
      },
      { Authorization: `Bearer ${auth.token}` }
    );

    if (data.message === "Удалено") {
      toast.success(`Удаление успешно завершено`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    fetchData();
  };

  return (
    <>
      <div className="members-container">
        <div className="members-block">
          <h2 className="members-h2">Друзья</h2>
          <div className="members-search">
            <form onSubmit={submitHandler}>
              <input
                type="text"
                placeholder="Найти друзей"
                onChange={(e) => {
                  setQuery(e.target.value);
                  queryHandler(e.target.value);
                }}
              />
              <button type="submit" onClick={searchUsers}>
                <i className="fa fa-search"></i>
              </button>
            </form>
          </div>
          <div className="members-label">
            <h3>
              {searchMembers && query ? "Результат поиска" : "Ваши друзья"}
            </h3>
          </div>
          {!loading ? (
            searchMembers && query ? (
              searchMembers.length !== 0 ? (
                searchMembers.map((item, index) => {
                  return item._id !== auth.userId && item._id ? (
                    <div className="result" key={index}>
                      <img src={JSON.parse(item.imgURL)} alt="icon" />
                      <h2>{item.name + " " + item.surname}</h2>
                      <button
                        onClick={() => {
                          addMember(searchMembers[index]);
                        }}
                      >
                        <i className="fas fa-user-plus"></i>
                      </button>
                    </div>
                  ) : null;
                })
              ) : (
                <div className="not-find">
                  <span>Ничего не найдено</span>
                </div>
              )
            ) : members && members.length !== 0 ? (
              members.map((item, index) => {
                return (
                  <div className="result" key={index}>
                    <img src={JSON.parse(item.icon)} alt="icon" />
                    <h2>{item.username}</h2>
                    <button
                      onClick={() => {
                        setLoadConversation(true);
                        fetchMessages(item.id);
                      }}
                    >
                      <i className="fa fa-envelope"></i>
                    </button>
                    <button
                      className="times-red"
                      onClick={() => {
                        deleteMember(item.id);
                      }}
                    >
                      <i className="fa-times"></i>
                    </button>
                  </div>
                );
              })
            ) : (
              <NullMembers />
            )
          ) : (
            <div className="center">
              <Loader />
            </div>
          )}
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

export default Members;
