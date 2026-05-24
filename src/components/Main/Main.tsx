import React from "react";
import styled from 'styled-components'

const MainContent = styled.main`
  flex: 1;
`

const Main: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return(
    <MainContent>
      { children }
    </MainContent>
  )
}

export default Main;
