import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useHttp } from "../../hooks/http.hook";
import AddMessage from "../AddMessage/AddMessage";
import Loader from "../Loader/Loader";
import "./Sidebar.scss";

const Sidebar = ({
  setOpenMembers,
  setOpenConversation,
  conversation,
  setLoadConversation,
  setUsername,
  username,
  openConversation,
  fetchMessageMenu,
  message,
}) => {
  const auth = useContext(AuthContext);
  const { loading, request } = useHttp();
  const [showMessage, setShowMessage] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [image, setImage] = useState();
  const [userLoad, setUserLoad] = useState();
  const [messageLoad, setMessageLoad] = useState();
  const [openAddMessage, setOpenAddMessage] = useState(false);

  useEffect(() => {
    if (auth.userId) {
      renderData();
    }
  }, [auth.userId]);

  const toogleMessage = async (e) => {
    e.preventDefault();
    if (showMessage) {
      setShowMessage(false);
    } else {
      setMessageLoad(loading);
      setShowMessage(true);

      fetchMessageMenu();
      setMessageLoad(loading);
    }
  };

  const dropMenu = (e) => {
    e.preventDefault();
    if (showMenu) {
      setShowMenu(false);
    } else {
      setShowMenu(true);
    }
  };

  const styleMessage = {
    transform: showMessage ? "rotate(180deg)" : "",
    transition: "transform 150ms ease",
  };

  const styleMenu = {
    opacity: showMenu ? "1" : "",
    transition: "0.3s",
    overflow: "hidden",
  };

  const renderData = async () => {
    setUserLoad(loading);
    try {
      const data = await request("/api/auth/render", "POST", {
        _id: auth.userId,
      });
      setUsername(data.name + " " + data.surname);
      setImage(JSON.parse(data.image));
      setUserLoad(loading);
    } catch (e) {}
  };

  return (
    <>
      <div className="sidebar-container">
        <div className="sidebar-search">
          <form>
            <input type="text" placeholder="Поиск" />
            <button type="submit">
              <i className="fa fa-search"></i>
            </button>
          </form>
        </div>
        {!userLoad && username ? (
          <div className="sidebar-card">
            <img src={image} alt="icon" />
            <div className="sidebar-card-status">
              <h2>{username}</h2>
              <div className="status-flex">
                {conversation ? (
                  <i className="fa fa-circle i-parent">
                    <i className="fa fa-ellipsis-h i-child"></i>
                  </i>
                ) : (
                  <i className="fa fa-rss on fa-circle"></i>
                )}
                <span>{conversation ? "В чате" : "Online"}</span>
              </div>
            </div>
            <div className="sidebar-card-menu">
              <div className="dropdown">
                <button onClick={dropMenu}>
                  <img src="images/ellipsis.png" alt="menu" />
                </button>
                <div
                  className="dropdown-content"
                  style={styleMenu}
                  onMouseLeave={() => {
                    setShowMenu(false);
                  }}
                >
                  <button
                    className="exit-account"
                    onClick={() => {
                      auth.logout();
                    }}
                  >
                    Выйти из аккаунта
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Loader />
        )}

        <div className="sidebar-options">
          <div
            className="members"
            onClick={() => {
              setOpenMembers(true);
              setOpenConversation(false);
            }}
          >
            <i className="fa fa-user fa-fw" aria-hidden="true"></i>
            <span>Друзья</span>
          </div>
          <div className="settings">
            <i className="fa fa-cog fa-fw" aria-hidden="true"></i>
            <span>Настройки</span>
          </div>
        </div>
        <div className="sidebar-messages">
          <div className="placeholder" onClick={toogleMessage}>
            <i className="fa fa-chevron-down fa-fw" style={styleMessage}></i>
            <span>СООБЩЕНИЯ</span>
          </div>
          {showMessage && !messageLoad ? (
            message ? (
              <div className="drop">
                {message.map((item, index) => {
                  return (
                    <div
                      className="drop-list"
                      onClick={() => {
                        setLoadConversation(true);
                        openConversation(message[index].recepient);
                      }}
                      key={index}
                    >
                      <div className="drop-list_block">
                        <div className="drop-list-icon">
                          <img src={JSON.parse(item.icon)} alt="iconMember" />
                          {item.status === "online" ? (
                            <i className="fa fa-circle" aria-hidden="true"></i>
                          ) : null}
                        </div>
                        <span>{item.username}</span>
                      </div>
                    </div>
                  );
                })}
                <div
                  className="drop-list"
                  onClick={() => {
                    setOpenAddMessage(true);
                  }}
                >
                  <div className="drop-list_block">
                    <div className="plus-block">
                      <i className="fa fa-plus" aria-hidden="true"></i>
                    </div>
                    <span>Добавить диалог</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="center">
                <Loader />
              </div>
            )
          ) : null}
        </div>
        {openAddMessage ? (
          <AddMessage
            setOpenAddMessage={setOpenAddMessage}
            openAddMessage={openAddMessage}
            fetchMessages={openConversation}
            setLoadConversation={setLoadConversation}
          />
        ) : null}
      </div>
    </>
  );
};

export default Sidebar;
