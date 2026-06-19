import React from 'react'
import Navbar from '../home/Navbar'
import Footer from '../home/Footer'

function Layout({children}) {
  return (
    <>
      <Navbar/>
        {children}
        <Footer/>
    </>
  )
}

export default Layout
