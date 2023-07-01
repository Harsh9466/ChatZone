import { useState } from "react";
import { Api } from "../Api";
import toast from "react-hot-toast";

const useRequest = args => {
  const defaultParams = {
    requestType: "POST",
    url: "",
    auth: true,
    alert: true
  };
  const { requestType, url, auth, alert } = Object.assign(defaultParams, args);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = async (body = {}) => {
    setLoading(true);

    Api.send(requestType, url, body, auth)
      .then(response => {
        if (response?.data) {
          setData(response.data);
        }
      })
      .catch(err => {
        if (alert) {
          toast.error(err?.response?.data?.message);
        }
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { sendRequest, data, loading, error };
};

export default useRequest;
