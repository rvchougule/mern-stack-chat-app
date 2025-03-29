import { useEffect, useRef } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../redux/userSlice";
import { useNavigate } from "react-router";

function useRefreshToken() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const refreshToken = JSON.parse(localStorage.getItem("refreshToken"));

  const flag = useRef(true);

  const refreshAccessToken = async () => {
    console.log("refreshToken called");
    if (!refreshToken) return null;
    axios
      .post("/auth/refresh-token", { refreshToken })
      .then((res) => {
        const accessToken = res?.data?.data?.accessToken;
        const refreshToken = res?.data?.data?.refreshToken;
        localStorage.setItem("accessToken", JSON.stringify(accessToken));
        localStorage.setItem("refreshToken", JSON.stringify(refreshToken));
        dispatch(setToken(accessToken));
        axios
          .get("auth/current-user")
          .then((res) => {
            const data = res?.data?.data;
            dispatch(setUser(data));
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
        console.log("refreshtoken failed");
        navigate("/login");
      });
  };

  useEffect(() => {
    let timerId = null;
    if (refreshToken) {
      if (flag.current) {
        refreshAccessToken();
        flag.current = false;
      } else {
        timerId = setTimeout(() => {
          refreshAccessToken();
        }, 3600000);
      }
    }

    return () => clearTimeout(timerId);
  }, [refreshToken]); // Add dependencies

  return { refreshAccessToken }; // Return the function
}

export default useRefreshToken;
