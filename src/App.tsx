import { useEffect, useState } from 'react'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Main from './components/Main/Main'
import Posts from './components/Posts/Posts'
import './App.css'

function App() {
  return(
    <div className="app-content">
      <Header/>
      <Main>
        <Posts/>
      </Main>
      <Footer/>
    </div>
  )
}

export default App;
