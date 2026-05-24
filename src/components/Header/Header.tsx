import React from "react";
import styled from "styled-components";

const HeaderContainer = styled.footer`
  background-color: #ed145b;
  color: white;
  text-align: center;
  padding: 10px 0;
  position: fixed;
  bottom: 0;
  width: 100%;
`;

const HeaderTitle = styled.h1`
  text-align: center;
`

const Header: React.FC = () => {
  return(
    <HeaderContainer>
      <HeaderTitle>Lista de Posts </HeaderTitle>
    </HeaderContainer>
  )
}

export default Header;
