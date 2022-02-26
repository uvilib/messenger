import React from "react";
import "./NullPage.scss";

const NullPage = () => {
  return (
    <div className="null-page">
      <div>
        <div className="starsec"></div>
        <div className="starthird"></div>
        <div className="starfourth"></div>
        <div className="starfifth"></div>
      </div>

      <div className="lamp__wrap">
        <div className="lamp">
          <div className="cable"></div>
          <div className="cover"></div>
          <div className="in-cover">
            <div className="bulb"></div>
          </div>
          <div className="light"></div>
        </div>
      </div>

      <section className="error">
        <div className="error__content">
          <div className="error__message message">
            <h1 className="message__title">Вы в начальном меню</h1>
            <p className="message__text">
              Здесь показывается только эта лампочка. <br /> Чтобы увидеть своих
              друзей или посмотреть сообщения кликайте по соответствующим
              разделам
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NullPage;
