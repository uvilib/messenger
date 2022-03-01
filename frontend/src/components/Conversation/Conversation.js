import React, { useContext, useState, useCallback, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketProvider";
import { useHttp } from "../../hooks/http.hook";
import "./Conversation.scss";

const Conversation = ({
  conversation,
  openConversation,
  setOpenConversation,
  fetchMessageMenu,
}) => {
  const auth = useContext(AuthContext);
  const { request } = useHttp();
  const [showMenu, setShowMenu] = useState(false);
  const [textMessage, setTextMessage] = useState("");
  const socket = useSocket();

  let counter = ["0"];

  const setRef = useCallback((node) => {
    if (node) {
      node.scrollIntoView({ smooth: true });
    }
  }, []);

  const dropMenu = (e) => {
    e.preventDefault();
    if (showMenu) {
      setShowMenu(false);
    } else {
      setShowMenu(true);
    }
  };

  useEffect(() => {
    socket.on("receive-message", () => {
      openConversation(conversation.idRecipient);
    });
  }, [socket, openConversation, conversation.idRecipient]);

  const addMessage = async (e) => {
    e.preventDefault();

    if (textMessage) {
      try {
        await request(
          "/api/message/add",
          "POST",
          {
            text: textMessage,
            sender: auth.userId,
            recepient: conversation.idRecipient,
          },
          {
            Authorization: `Bearer ${auth.token}`,
          }
        );
        socket.emit("send-message", { recipient: conversation.idRecipient });
      } catch (e) {}
    }

    setTextMessage("");
    openConversation(conversation.idRecipient);
  };

  const styleMenu = {
    opacity: showMenu ? "1" : "",
    transition: "0.3s",
    overflow: "hidden",
  };

  const deleteMessage = async () => {
    try {
      await request(
        "/api/message/delete",
        "POST",
        {
          recepient: conversation.idRecipient,
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      setOpenConversation(false);
      fetchMessageMenu();
    } catch (e) {}
  };

  return (
    <>
      <div className="conversation-container">
        <div className="conversation-messages">
          <div className="conversation-header">
            <div className="conversation-header_item">
              <img src={JSON.parse(conversation.icon)} alt="" />
              <div className="conversation-header-userstatus">
                <span className="conversation-username">
                  {conversation.usernameRecepient}
                </span>
                <span
                  className={`conversation-status ${
                    conversation.status === "online"
                      ? "bg-online"
                      : conversation.status === "offline"
                      ? "bg-offline"
                      : null
                  }`}
                >
                  {conversation.status === "online"
                    ? "В сети"
                    : conversation.status === "offline"
                    ? "Не в сети"
                    : null}
                </span>
              </div>

              <div className="conversation-header-menu">
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
                    <button className="exit-account" onClick={deleteMessage}>
                      Удалить диалог
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="conversation-item app-scroll">
            {conversation.message
              ? conversation.message.map((item, index) => {
                  const lastMessage = conversation.message.length - 1 === index;
                  counter.push(item.sender);
                  return (
                    <div
                      ref={lastMessage ? setRef : null}
                      key={index}
                      className={`conversation-item-message ${
                        item.sender === auth.userId ? "fromMe" : "fromSender"
                      }`}
                    >
                      <div
                        className={`img-container ${
                          item.sender === auth.userId ? "img-end" : ""
                        }`}
                      >
                        {item.sender ===
                        counter[counter.length - 2] ? null : item.sender ===
                          auth.userId ? (
                          <img src={JSON.parse(conversation.myIcon)} alt="" />
                        ) : (
                          <img src={JSON.parse(conversation.icon)} alt="" />
                        )}
                      </div>
                      <div
                        className={`message-container ${
                          item.sender === auth.userId ? "end" : "start"
                        }`}
                      >
                        <span>
                          {item.sender === counter[counter.length - 2]
                            ? null
                            : item.sender === auth.userId
                            ? "Вы"
                            : conversation.usernameRecepient}
                        </span>

                        <div
                          className={`conversation-item-message_text ${
                            item.sender === auth.userId
                              ? "bg-primary"
                              : "bg-sender"
                          }`}
                        >
                          {item.text}
                        </div>
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
          <div className="conversation-form">
            <form action="" onSubmit={addMessage}>
              <input
                type="text"
                placeholder="Напишите сообщение..."
                onChange={(e) => {
                  setTextMessage(e.target.value);
                }}
                value={textMessage}
              />
              <button>
                <img src="images/send.png" alt="" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Conversation;
