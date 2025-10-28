import React from 'react'
import Header from './Components/Header/header';
import { Outlet } from 'react-router-dom';

const App = () => {
  return (
    <>
      <Header/>
      <Outlet/>
    </>
  )
}

export default App