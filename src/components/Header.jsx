import styled from "styled-components";
import { MdLogin, MdLogout } from "react-icons/md";
import { HiOutlineUserAdd } from "react-icons/hi";
import { NavLink } from "react-router-dom";
import { v } from "../styles/Variables";
import { useAuth } from "../hooks/useAuth";

export function Header() {
  const { user, logout } = useAuth();
  const linksArray = user
    ? []
    : [{ icon: <HiOutlineUserAdd />, label: "", to: "/registro" }];

  const secondarylinksArray = user
    ? [
        {
          icon: <MdLogout />,
          label: "",
          to: "#",
          onClick: logout,
        },
      ]
    : [{ icon: <MdLogin />, label: "", to: "/ingreso" }];

  return (
    <Container>
      {linksArray.map(({ icon, label, to }) => (
        <div className="Linkcontainer" key={to}>
          <NavLink
            to={to}
            className={({ isActive }) => `Link${isActive ? " active" : ""}`}
          >
            <div className="icon">{icon}</div>
            <span>{label}</span>
          </NavLink>
        </div>
      ))}

      {linksArray.length > 0 && <Divider />}

      {secondarylinksArray.map(({ icon, label, to, onClick }) => (
        <div className="Linkcontainer" key={to}>
          {onClick ? (
            // Botón para logout (no es un NavLink)
            <button className="Link" onClick={onClick}>
              <div className="icon">{icon}</div>
              <span>{label}</span>
            </button>
          ) : (
            // NavLink normal para login
            <NavLink
              to={to}
              className={({ isActive }) => `Link${isActive ? " active" : ""}`}
            >
              <div className="icon">{icon}</div>
              <span>{label}</span>
            </NavLink>
          )}
        </div>
      ))}
    </Container>
  );
}

const Container = styled.header`
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  padding: 10px 20px;
  height: 60px;
  display: flex;
  justify-content: flex-end;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  position: fixed; // Fija el Header en la parte superior
  top: 0;
  left: 0;
  right: 0;

  .Linkcontainer {
    .Link {
      display: flex;
      align-items: center;
      margin: 0 10px;
      text-decoration: none;
      padding: calc(${v.smSpacing}-2px) 0;
      color: ${({ theme }) => theme.text};
      font-size: 1.4rem;
      transition: color 0.3s;

      &.active {
        color: ${({ theme }) => theme.bg4};
      }

      .icon {
        margin-right: 5px;
      }
    }
    &:hover {
      background-color: ${({ theme }) => theme.bg3};
      border-radius: 5px;
      transition: background-color 0.3s;
    }
  }

  .Linkcontainer {
    button.Link {
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      margin: 0 10px;
      padding: calc(${v.smSpacing} - 2px) 0;
      color: ${({ theme }) => theme.text};
      font-size: 1.4rem;
      transition: color 0.3s;

      &:hover {
        color: ${({ theme }) => theme.bg4};
      }
    }
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 20px;
  background-color: ${({ theme }) => theme.text};
  margin: 0 10px;
`;
