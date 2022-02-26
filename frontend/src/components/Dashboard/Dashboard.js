import React, { useState, useContext, useCallback, useEffect } from "react";
import Members from "../Members/Members";
import { AuthContext } from "../../context/AuthContext";
import Conversation from "../Conversation/Conversation";
import Sidebar from "../Sidebar/Sidebar";
import { useHttp } from "../../hooks/http.hook";
import "./Dashboard.scss";
import NullPage from "../NullPage/NullPage";
import ConversationLoader from "../ConversationLoader/ConversationLoader";
import { useSocket } from "../../context/SocketProvider";

const Dashboard = () => {
  const auth = useContext(AuthContext);
  const { request } = useHttp();
  const [openMembers, setOpenMembers] = useState(false);
  const [openConversation, setOpenConversation] = useState(false);
  const [conversation, setConversation] = useState();
  const [username, setUsername] = useState();
  const [message, setMessage] = useState();
  const [loadConversation, setLoadConversation] = useState(false);
  const socket = useSocket();

  useEffect(() => {
    socket.emit("online");
  }, [socket]);

  const fetchMessages = useCallback(
    async (id) => {
      setOpenMembers(false);
      setOpenConversation(true);
      try {
        const data = await request(
          "/api/message/conversation",
          "POST",
          {
            id,
          },
          {
            Authorization: `Bearer ${auth.token}`,
          }
        );
        setConversation(data);
        fetchMessageMenu();
        setLoadConversation(false);
      } catch (e) {}
    },
    [setConversation]
  );

  const fetchMessageMenu = async () => {
    try {
      const data = await request("/api/message", "GET", null, {
        Authorization: `Bearer ${auth.token}`,
      });

      setMessage(data);
    } catch (e) {}
  };

  return (
    <>
      <div className="dashboard-container">
        <Sidebar
          setOpenMembers={setOpenMembers}
          setOpenConversation={setOpenConversation}
          setLoadConversation={setLoadConversation}
          conversation={openConversation}
          username={username}
          setUsername={setUsername}
          openConversation={fetchMessages}
          fetchMessageMenu={fetchMessageMenu}
          message={message}
        />
        {!openMembers && !openConversation ? (
          <NullPage />
        ) : openMembers ? (
          <Members
            fetchMessages={fetchMessages}
            setLoadConversation={setLoadConversation}
          />
        ) : openConversation ? (
          !loadConversation ? (
            <Conversation
              conversation={conversation}
              openConversation={fetchMessages}
              setOpenConversation={setOpenConversation}
              fetchMessageMenu={fetchMessageMenu}
            />
          ) : (
            <ConversationLoader />
          )
        ) : null}
      </div>
    </>
  );
};

export default Dashboard;
