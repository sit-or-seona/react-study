import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import AuthContext from '../context/AuthProvider'
import Navbar from './Navbar';

function RequireAuth2({ children }) {
  const { auth } = useContext(AuthContext);
  console.log(auth);

  return (
    <>
      {auth ? (
        <>
          {children}
          <Navbar />
        </>
      ) : (
        <Navigate to="login" replace />
      )}
    </>
  )
}

export default RequireAuth2;