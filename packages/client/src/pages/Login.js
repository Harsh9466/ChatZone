import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import useRequest from "../hooks/useRequest";
import { hasKeys } from "../utils/utils";

const Login = () => {
  const userReducer = useSelector(state => state.userReducer);
  const {
    data,
    loading,
    sendRequest: login
  } = useRequest({
    requestType: "POST",
    url: "/api/v1/users/login",
    auth: false
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({
    username: "",
    password: ""
  });

  const onInputChange = e => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (data?.data?.user && data?.token) {
      dispatch(setUser(data.data.user));
      localStorage.setItem("token", data?.token);
    }
  }, [data, dispatch]);

  useEffect(() => {
    const user = userReducer?.user;
    const localStorageUser = JSON.parse(localStorage.getItem("user"));
    if (hasKeys(localStorageUser)) {
      navigate("/");
    }
    if (hasKeys(user)) {
      localStorage.setItem("user", JSON.stringify(userReducer?.user));
      navigate("/");
    }
  }, [navigate, userReducer?.user]);

  return (
    <>
      <input
        type="text"
        name="username"
        value={userData.email}
        onChange={onInputChange}
      />
      <input
        type="password"
        name="password"
        value={userData.password}
        onChange={onInputChange}
      />
      <Button variant="outline-dark" onClick={() => login(userData)}>
        Login
      </Button>
      {loading && <>Loading...</>}
    </>
  );
};

export default Login;
