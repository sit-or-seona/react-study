import React, { useContext, useRef, useState } from "react";
import { useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthProvider'

function Login() {
  const [name, setName] = useState("");
  const { setAuth } = useContext(AuthContext);
  const nameRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = (e) => {
    e.preventDefault();

    setAuth(name);
    localStorage.setItem('name', JSON.stringify(name));
    navigate(from);
  };

  useEffect(() => {
    nameRef.current.focus()
  }, [])

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">이름</label>
      <input
        ref={nameRef}
        onChange={(e) => setName(e.target.value)}
        id="name"
        type="text"
      />
    </form>
  );
}

export default Login;
