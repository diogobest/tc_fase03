import styled from "styled-components";

const FooterContainer = styled.footer`
  border-top: 1px solid var(--border);
  color: var(--text);
  text-align: center;
  padding: 18px;
`;

const Footer = () => {
  return(
    <FooterContainer>
      <p>Área acadêmica de postagens</p>
    </FooterContainer>
  )
}

export default Footer;
