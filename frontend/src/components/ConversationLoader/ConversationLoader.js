import React from "react";
import "./ConversationLoader.scss";

const ConversationLoader = () => {
  return (
    <div className="conversationLoader-container">
      <div className="conversationLoader-messages">
        <div className="conversationLoader-header">
          <div className="conversationLoader-header_item">
            <div className="conversationLoader-icon"></div>
            <span className="conversationLoader-username"></span>
            <div className="conversationLoader-header-menu"></div>
          </div>
        </div>
        <div className="conversationLoader-item">
          <div className="conversationLoader-item-message conversationLoader-fromMe">
            <div className="conversationLoader-img-container conversationLoader-img-end">
              <div className="conversationLoader-icon"></div>
            </div>
            <div className="conversationLoader-message-container conversationLoader-end">
              <div className="conversationLoader-message"></div>
              <div className="conversationLoader-item-message_text"></div>
            </div>
          </div>
          <div className="conversationLoader-item-message fromSender">
            <div className="conversationLoader-img-container">
              <div className="conversationLoader-icon"></div>
            </div>
            <div className="conversationLoader-message-container conversationLoader-start">
              <div className="conversationLoader-message"></div>
              <div className="conversationLoader-item-message_text conversationLoader-sender"></div>
            </div>
          </div>
          <div className="conversationLoader-item-message conversationLoader-fromSender">
            <div className="conversationLoader-img-container">
              <div className="conversationLoader-icon"></div>
            </div>
            <div className="conversationLoader-message-container conversationLoader-start">
              <div className="conversationLoader-message"></div>
              <div className="conversationLoader-item-message_text"></div>
            </div>
          </div>
          <div className="conversationLoader-item-message conversationLoader-fromMe">
            <div className="conversationLoader-img-container conversationLoader-img-end">
              <div className="conversationLoader-icon"></div>
            </div>
            <div className="conversationLoader-message-container conversationLoader-end">
              <div className="conversationLoader-message"></div>
              <div className="conversationLoader-item-message_text"></div>
            </div>
          </div>
        </div>
        <div className="conversationLoader-form">
          <form>
            <input type="text" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConversationLoader;
