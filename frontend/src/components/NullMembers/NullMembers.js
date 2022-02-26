import React from "react";
import "./NullMembers.scss";

const NullMembers = () => {
  return (
    <div className="null-members-container">
      <span>У вас пока нет друзей</span>
      <span>Попробуйте найти их, используя поисковую строку</span>
      <img src="images/sad-emoji.svg" alt="sad" />
    </div>
  );
};

export default NullMembers;
