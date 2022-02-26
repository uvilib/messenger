import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useHttp } from "../../hooks/http.hook";
import Loader from "../Loader/Loader";
import "./AddMessage.scss";

const AddMessage = ({
  setOpenAddMessage,
  setLoadConversation,
  fetchMessages,
}) => {
  const { request } = useHttp();
  const auth = useContext(AuthContext);
  const [members, setMembers] = useState();
  const [selectRadio, setSelectRadio] = useState();
  const [selectedId, setSelectedId] = useState();

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

  const handleSubmit = (event) => {
    event.preventDefault();

    if (selectedId) {
      setLoadConversation(true);
      fetchMessages(selectedId);

      setOpenAddMessage(false);
    }
  };

  return (
    <>
      <div
        className="modal"
        onClick={() => {
          setOpenAddMessage(false);
        }}
      >
        <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3 className="modal-title">Создать чат</h3>
            <span
              className="modal-close"
              onClick={() => {
                setOpenAddMessage(false);
              }}
            >
              &times;
            </span>
          </div>
          <div className="modal-body">
            <div className="modal-content">
              <div className="modal-content-div-conversation app-scroll">
                <div className="modal-content_form">
                  {members ? (
                    members.map((item, index) => {
                      return (
                        <div
                          className="form_radio_btn"
                          key={index}
                          onClick={() => {
                            setSelectedId(item.id);
                          }}
                        >
                          <input
                            id={`radio-${index + 1}`}
                            type="radio"
                            name={`radio-${index + 1}`}
                            value={index + 1}
                            checked={selectRadio === index + 1}
                            onChange={() => {
                              setSelectRadio(index + 1);
                            }}
                          />
                          <label htmlFor={`radio-${index + 1}`}>
                            <img
                              src={JSON.parse(item.icon)}
                              alt=""
                              className=""
                            />
                            {item.username}
                          </label>
                        </div>
                      );
                    })
                  ) : (
                    <Loader />
                  )}
                  {members ? (
                    members.length === 0 ? (
                      <div>
                        <span>Друзья не найдены &#128577;</span>
                        <br />
                        <br />
                        <span>Попробуйте их поискать</span>
                      </div>
                    ) : null
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="submit"
              onClick={handleSubmit}
              className="modal-footer_btn"
            >
              Создать чат
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddMessage;
