import styled from "styled-components";
import { MdLogin, MdLogout } from "react-icons/md";
import { HiOutlineUserAdd } from "react-icons/hi";
import { NavLink } from "react-router-dom";
import { v } from "../styles/Variables";

export function Header() {
  const linksArray = [
    { icon: <HiOutlineUserAdd />, label: "", to: "/registro" },
  ];

  const secondarylinksArray = [
    { icon: <MdLogin />, label: "", to: "/ingreso" },
    {
      icon: <MdLogout />,
      label: "",
      to: "/",
    },
  ];
  return (
    <Container>
      {linksArray.map(({ icon, label, to }) => (
        <div className="Linkcontainer" key={label}>
          <NavLink
            to={to}
            className={({ isActive }) => `Link${isActive ? " active" : ""}`}
          >
            <div className="icon">{icon}</div>
            <span>{label}</span>
          </NavLink>
        </div>
      ))}
      <Divider />
      {secondarylinksArray.map(({ icon, label, to }) => (
        <div className="Linkcontainer" key={label}>
          <NavLink
            to={to}
            className={({ isActive }) => `Link${isActive ? " active" : ""}`}
          >
            <div className="icon">{icon}</div>
            <span>{label}</span>
          </NavLink>
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
`;

const Divider = styled.div`
  width: 1px;
  height: 20px;
  background-color: ${({ theme }) => theme.text};
  margin: 0 10px;
`;
