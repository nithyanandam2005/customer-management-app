import React, {
  createContext,
  useState,
  useContext
} from 'react';


const AuthContext = createContext(null);



// PROVIDER
export const AuthProvider = ({ children }) => {

  // USER STATE
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user'))
    || null
  );


  // TOKEN STATE
  const [token, setToken] = useState(
    localStorage.getItem('token')
  );


  const [loading, setLoading] =
    useState(false);




  // LOGIN
  const loginUser = (data) => {

    const { token, ...userData } = data;

    localStorage.setItem('token', token);

    localStorage.setItem(
      'user',
      JSON.stringify(userData)
    );
    setToken(token);
    setUser(userData);
  };




  // LOGOUT
  const logoutUser = () => {

    localStorage.removeItem('token');

    localStorage.removeItem('user');

    setToken(null);

    setUser(null);
  };




  // UPDATE USER
  const updateCurrentUser = (newData) => {

    const updatedUser = {
      ...user,
      ...newData
    };

    localStorage.setItem(
      'user',
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);
  };



  return (

    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        loginUser,
        logoutUser,
        updateCurrentUser
      }}
    >

      {children}

    </AuthContext.Provider>
  );
};


// CUSTOM HOOK
export const useAuth = () => {

  return useContext(AuthContext);
};
