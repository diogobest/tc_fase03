import styled from "styled-components";
import { NavLink, useNavigate } from 'react-router-dom'

type HeaderProps = {
  isAuthenticated: boolean
  onLogout: () => void
}

const HeaderContainer = styled.header`
  background-color: #ed145b;
  color: white;
  padding: 18px 28px;
`;

const HeaderContent = styled.div`
  align-items: center;
  display: flex;
  gap: 20px;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 1126px;

  @media (max-width: 720px) {
    align-items: flex-start;
    flex-direction: column;
  }
`

const HeaderTitle = styled(NavLink)`
  color: white;
  font-size: 24px;
  font-weight: 700;
  text-decoration: none;
`

const HeaderNav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  a,
  button {
    border: 1px solid rgba(255, 255, 255, 0.42);
    border-radius: 999px;
    color: white;
    background: rgba(255, 255, 255, 0.12);
    cursor: pointer;
    font: inherit;
    padding: 8px 12px;
    text-decoration: none;
  }

  a.active,
  a:hover,
  button:hover {
    background: white;
    color: #ed145b;
  }
`

const Header = ({ isAuthenticated, onLogout }: HeaderProps) => {
  const navigate = useNavigate()

  function handleLogout() {
    onLogout()
    navigate('/')
  }

  return(
    <HeaderContainer>
      <HeaderContent>
        <HeaderTitle to="/">Lista de Posts</HeaderTitle>
        <HeaderNav aria-label="Navegação principal">
          <NavLink to="/">Posts</NavLink>
          {isAuthenticated && <NavLink to="/posts/new">Criar postagem</NavLink>}
          {isAuthenticated && <NavLink to="/admin">Administração</NavLink>}
          {isAuthenticated ? (
            <button type="button" onClick={handleLogout}>Sair</button>
          ) : (
            <NavLink to="/login">Login docente</NavLink>
          )}
        </HeaderNav>
      </HeaderContent>
    </HeaderContainer>
  )
}

export default Header;
