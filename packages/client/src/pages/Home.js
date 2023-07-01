import React, { useEffect, useState } from "react";
import UsersList from "../components/home/UserList";
import Chat from "../components/home/Chat";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { hasKeys } from "../utils/utils";
import PropTypes from "prop-types";

const Home = ({ socket }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [reciever, setReciever] = useState({});
  const userReducer = useSelector(state => state.userReducer);

  useEffect(() => {
    const navigationTo = async () => {
      const user = JSON.parse(localStorage.getItem("user")) || {};
      if (!hasKeys(user)) {
        navigate("/auth/login");
      } else {
        dispatch(setUser(user));
      }
    };
    navigationTo();
  }, [dispatch, navigate]);

  useEffect(() => {
    const currentUserId = userReducer?.user?._id;
    if (currentUserId) {
      socket.emit("add-new-user", currentUserId);
    }
  }, [socket, userReducer?.user?._id]);

  return (
    <div className="home">
      <UsersList reciever={reciever} setReciever={setReciever} />
      <Chat reciever={reciever} setReciever={setReciever} socket={socket} />
    </div>
  );
};

Home.propTypes = {
  socket: PropTypes.object
};

export default Home;
