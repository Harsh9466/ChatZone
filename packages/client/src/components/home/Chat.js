import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { IoMdSend } from "react-icons/io";
import { hasKeys } from "../../utils/utils";
import Welcome from "./Welcome";
import defaultAvatar from "../../assets/img/default-user.png";
import useRequest from "../../hooks/useRequest";
import PropTypes from "prop-types";
import Loader from "../common/Loader";

const Chat = ({ reciever, socket }) => {
  const messageRef = useRef(null);
  const allMessagesRef = useRef(null);
  const userReducer = useSelector(state => state.userReducer);
  const {
    data,
    loading,
    sendRequest: getAllMessages
  } = useRequest({
    requestType: "GET",
    url: `/api/v1/messages/${reciever?._id}`
  });
  const { sendRequest: sendMessageInDB } = useRequest({
    requestType: "POST",
    url: `/api/v1/messages/sendMessage/${reciever?._id}`
  });
  const [allMessages, setAllMessages] = useState([]);
  const [message, setMessage] = useState("");

  const onMessage = (type, message) => {
    setAllMessages(p => [
      ...p,
      <div key={p.length + 1} className="message">
        <div className={type}>{message}</div>
      </div>
    ]);
  };

  const scrollToBottom = () => {
    allMessagesRef.current.scrollTo({
      top: allMessagesRef.current.scrollHeight,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    if (allMessagesRef?.current?.scrollHeight) {
      scrollToBottom();
    }
  }, [allMessagesRef?.current?.scrollHeight]);

  const sendMessage = () => {
    if (message.trim() !== "") {
      sendMessageInDB({ type: "text", message: message.trim() });
      socket.emit("send-msg", {
        from: userReducer?.user?._id,
        to: reciever?._id,
        message: message.trim()
      });
      setMessage("");
      scrollToBottom();
      // messageRef?.current?.blur();
      onMessage("sent", message);
    }
  };

  useEffect(() => {
    socket.on("msg-recieved", message => {
      scrollToBottom();
      onMessage("recieved", message);
    });
  }, [socket]);

  useEffect(() => {
    if (reciever?._id) {
      getAllMessages();
      setAllMessages([]);
    }
  }, [reciever?._id]);

  useEffect(() => {
    const chats = data?.data;
    if (chats?.length) {
      chats
        ?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .forEach(el => {
          if (el && el.sender === userReducer?.user?._id) {
            onMessage("sent", el.message.content);
          } else {
            onMessage("recieved", el.message.content);
          }
        });
    }
    // eslint-disable-next-line
  }, [data]);

  return (
    <>
      <div className="chat">
        {!loading ? (
          <>
            {hasKeys(reciever) ? (
              <>
                <div className="top-bar">
                  <div className="user-details">
                    <img
                      className="avatar"
                      src={reciever?.photo || defaultAvatar}
                      alt=""
                    />
                    <div className="name">{reciever?.name}</div>
                  </div>
                </div>
                <div className="messages" ref={allMessagesRef}>
                  {allMessages}
                </div>
                <div className="message-send-box">
                  <input
                    ref={messageRef}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Message"
                    onKeyUp={e => {
                      if (e.key === "Enter") sendMessage();
                    }}
                  />
                  <br />
                  <div onClick={() => sendMessage()}>
                    <IoMdSend className="send-icon" />
                  </div>
                </div>
              </>
            ) : (
              <Welcome />
            )}
          </>
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
};

Chat.propTypes = {
  reciever: PropTypes.object,
  socket: PropTypes.object
};

export default Chat;
