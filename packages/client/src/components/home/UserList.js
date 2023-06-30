import React, { useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import defaultAvatar from "../../assets/img/default-user.png";
import { useDispatch, useSelector } from "react-redux";
import { setAllUsers } from "../../redux/slices/userSlice";
import Lottie from "lottie-react";
import sad from "../../assets/lottie/sad.json";
import { AiOutlineMore } from "react-icons/ai";
import Loader from "../common/Loader";
import useRequest from "../../hooks/useRequest";
import { hasKeys } from "../../utils/utils";

const UsersList = ({ reciever, setReciever }) => {
  const [users, setUsers] = useState([]);
  const userReducer = useSelector((state) => state.userReducer);
  const {
    data,
    loading,
    sendRequest: getAllFriends,
  } = useRequest({
    requestType: "GET",
    url: `/api/v1/friends`,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (userReducer?.user?._id) getAllFriends();
  }, [userReducer?.user?._id]);

  useEffect(() => {
    if (data?.data?.friends) {
      setUsers(data.data.friends);
      dispatch(setAllUsers(data.data.friends));
    }
  }, [data]);

  useEffect(() => {
    dispatch(setAllUsers(users));
  }, []);

  return (
    <div className="user-list">
      <div className="top-bar">
        <div className='user-details'>
          <img
            className="avatar"
            src={userReducer?.user?.photo || defaultAvatar}
            alt=""
          ></img>
          <div className="name">{userReducer?.user?.name}</div>
        </div>
        <div className="more-icon-box">
          <AiOutlineMore className="more-icon" />
        </div>
      </div>

      {!loading ? (
        <>
          {users && users?.length ? (
            users?.map((user, i) => (
              <User
                key={i}
                user={user}
                reciever={reciever}
                setReciever={setReciever}
              ></User>
            ))
          ) : (
            <div className="no-friends">
              <Lottie animationData={sad} loop></Lottie>
              <p className="text">No Friends Yet!</p>
              <button className="add-friends-btn">Add Friends</button>
            </div>
          )}
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

const User = ({ user, setReciever, reciever }) => {
  const [active, setActive] = useState(false);
  const userRef = useRef(null);

  useEffect(() => {
    if (hasKeys(reciever) && hasKeys(user)) {
      setActive(user && user?._id === reciever?._id);
    }
  }, [user, reciever]);

  return (
    <div
      className={`user ${active ? "active" : ""}`}
      ref={userRef}
      onClick={() => setReciever(user)}
    >
      <img className="avatar" src={user?.photo || defaultAvatar} alt="" />
      <div className="details">
        <div className="name-box">
          <div className="name">{user?.name}</div>
          <div className="last-message-time">{user?.lastMessageTime}</div>
        </div>
        <div className="last-message-box">
          <div className="last-message">{user?.lastMessage?.message}</div>
        </div>
      </div>
    </div>
  );
};

export default UsersList;
