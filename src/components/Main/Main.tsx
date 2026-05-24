import React from "react";
import "./Main.css"
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const Main: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return(
    <main className="main-content">
      { children }
    </main>
  )
}

export default Main;
