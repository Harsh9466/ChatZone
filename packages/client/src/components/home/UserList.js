import React, { useEffect, useRef, useState } from "react";
import defaultAvatar from "../../assets/img/default-user.png";
import { useDispatch, useSelector } from "react-redux";
import { setAllUsers, setUser } from "../../redux/slices/userSlice";
import Lottie from "lottie-react";
import sad from "../../assets/lottie/sad.json";
import { AiOutlineMore } from "react-icons/ai";
import Loader from "../common/Loader";
import useRequest from "../../hooks/useRequest";
import PropTypes from "prop-types";
import { hasKeys } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import { Button, Dropdown } from "react-bootstrap";
import Modals from "../Modal";
import CustomDropdownToggle from "../common/CustomDropdownToggle";
import CustomDropdownItem from "../common/CustomDropdownItem";

const UsersList = ({ reciever, setReciever }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [currentModel, setCurrentModel] = useState({
    name: null,
    props: null
  });

  const userReducer = useSelector(state => state.userReducer);
  const {
    data,
    loading,
    sendRequest: getAllFriends
  } = useRequest({
    requestType: "GET",
    url: `/api/v1/friends`
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

  const handleShowModel = (model = null, modelProps = null) => {
    setCurrentModel({
      name: Modals[model] ? model : null,
      props: modelProps
    });
  };

  const onAddFriends = () => {
    handleShowModel("AddFriendModal", {
      handleClose: () => setCurrentModel({})
    });
  };

  const onLogOut = () => {
    setAllUsers([]);
    localStorage.clear();
    dispatch(setAllUsers([]));
    dispatch(setUser({}));
    navigate("/auth/login");
  };

  const Modal = Modals[currentModel.name];

  return (
    <div className="user-list">
      <div className="top-bar">
        <div className="user-details">
          <img
            className="avatar"
            src={userReducer?.user?.photo || defaultAvatar}
            alt=""
          ></img>
          <div className="name">{userReducer?.user?.name}</div>
        </div>
        <Dropdown>
          <Dropdown.Toggle as={CustomDropdownToggle}>
            <div className="more-icon-box">
              <AiOutlineMore className="more-icon" />
            </div>
          </Dropdown.Toggle>

          <Dropdown.Menu variant="dark">
            <Dropdown.Item as={CustomDropdownItem} onClick={onAddFriends}>
              Add New Friends
            </Dropdown.Item>
            <Dropdown.Item as={CustomDropdownItem} onClick={onLogOut}>
              Log Out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
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
              <Button className="w-50" onClick={onAddFriends}>
                Add Friends
              </Button>
            </div>
          )}
        </>
      ) : (
        <Loader />
      )}
      {currentModel.name && <Modal {...currentModel.props} />}
    </div>
  );
};

const User = ({ user, setReciever, reciever }) => {
  const [active, setActive] = useState(false);
  const userRef = useRef(null);

  useEffect(() => {
    if (hasKeys(reciever) && hasKeys(user)) {
      setActive(user && user._id === reciever._id);
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

UsersList.propTypes = {
  reciever: PropTypes.object,
  setReciever: PropTypes.func
};

User.propTypes = {
  user: PropTypes.object,
  reciever: PropTypes.object,
  setReciever: PropTypes.func
};

export default UsersList;
