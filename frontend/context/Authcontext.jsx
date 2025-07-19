import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
export const AuthContext = createContext();

const backendUrl = import.meta.env.VITE_BACKEND_URL;
// console.log(backendUrl);

axios.defaults.baseURL = backendUrl;
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthuser] = useState(null);
  const [onlineUser, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);


  //  check if user is authenticated and if so, set the user data and connecgt the socket

  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthuser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
      
    }
  };

  // login function to handle user authentication and socket connection

 const login = async (state, values) => {
  try {
    const { data } = await axios.post(`/api/auth/${state}`, values);

    if (data.success) {
      setAuthuser(data.userData);
      localStorage.setItem("authUser",JSON.stringify(data.userData))
      connectSocket(data.userData);
      axios.defaults.headers.common["token"] = data.token;
      setToken(data.token);
      localStorage.setItem("token", data.token);
      toast.success(data.message);
   
    }
   
  } catch (error) {
    toast.error(error.message);
   console.log(error.message);
   
  }
};


  // logout function to handle user logout and socket disconnection

  const logout = async () => {
    localStorage.removeItem("token");
    setAuthuser(null);
    setToken(null);
    setOnlineUsers([]);
    axios.defaults.headers.common["token"] = null;
    toast.success("Logged out successfully");
    socket.disconnect();
  };

  // update profile function to handle user profile updates

  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);
      if (data.success) {
        setAuthuser(data.user);
         console.log("profile updated",data.user);
         
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // connect to socket.io server get online users and updates
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;
    const newSocket = io(backendUrl, {
      query: {
        userId: userData._id,
      },
    });
    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (usersId) => {
      setOnlineUsers(usersId);
    });
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
    }
    checkAuth();
  }, []);

  const values = {
    axios,
    token,
    authUser,
    onlineUser,
    socket,
    login,
    logout,updateProfile,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
