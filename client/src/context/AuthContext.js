import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);


const AuthProvider = ({ children }) => {

  const [currentUser, setCurrentUser] = useState(
    () => {
    const initial = JSON.parse(localStorage.getItem("currentUser"));
    return initial || null;
  }
  );



  const [isError, setIsError] = useState(false);



  const login = async (user) => {
    try {
      const res = await axios.post("http://localhost:8000/login", user);
      setCurrentUser(res.data);
    //   console.log(res.data);
    } catch (error) {
      console.log(error);
      setIsError(true);
    }
  };



  const logout = () => {
    localStorage.setItem("currentUser", "null");
    setCurrentUser(null);
  };



  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      console.log(localStorage.getItem("currentUser"))
    }
  }, [currentUser]);





  const value = {
    login,
    logout,
    currentUser,
    isError,
  };
  


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;