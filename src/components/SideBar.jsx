import styled, { keyframes } from "styled-components";
import logo from "../assets/logo-invrec.png";
import { v } from "../styles/Variables";
import PropTypes from "prop-types";
import { AiOutlineLeft } from "react-icons/ai";
import { HiOutlineUserGroup } from "react-icons/hi";
import {
  MdInventory2,
  MdOutlineHome,
  MdOutlineShoppingCart,
  MdOutlineBuild,
} from "react-icons/md";
import { IoStatsChartOutline } from "react-icons/io5";
import { TbCashRegister } from "react-icons/tb";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FaBook, FaRecycle } from "react-icons/fa6";

Sidebar.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
};
export function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const ModSidebaropen = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const { setTheme, theme } = useContext(ThemeContext);
  const CambiarTheme = () => {
    setTheme((theme) => (theme === "light" ? "dark" : "light"));
  };

  return (
    <Container $isOpen={sidebarOpen} $themeUse={theme}>
      <button className="sidebarbutton" onClick={ModSidebaropen}>
        <AiOutlineLeft />
      </button>
      <div className="logocontent">
        <div className="imgcontent">
          <img src={logo} alt="logo" />
        </div>
        <h2>Invrec</h2>
      </div>

      {linksArray.map(({ icon, label, to }) => (
        <div className="LinkContainer" key={label}>
          <NavLink
            to={to}
            className={({ isActive }) => `Links${isActive ? " active" : ""}`}
          >
            <div className="Linkicon">{icon}</div>
            <span className={`LinkText ${sidebarOpen ? "visible" : "hidden"}`}>
              {label}
            </span>
          </NavLink>
        </div>
      ))}
      <Divider />
      {dailyLinksArray.map(({ icon, label, to }) => (
        <div className="LinkContainer" key={label}>
          <NavLink
            to={to}
            className={({ isActive }) => `Links${isActive ? " active" : ""}`}
          >
            <div className="Linkicon">{icon}</div>
            <span className={`LinkText ${sidebarOpen ? "visible" : "hidden"}`}>
              {label}
            </span>
          </NavLink>
        </div>
      ))}

      <Divider />
      {secondarylinksArray.map(({ icon, label, to }) => (
        <div className="LinkContainer" key={label}>
          <NavLink
            to={to}
            className={({ isActive }) => `Links${isActive ? " active" : ""}`}
          >
            <div className="Linkicon">{icon}</div>
            <span className={`LinkText ${sidebarOpen ? "visible" : "hidden"}`}>
              {label}
            </span>
          </NavLink>
        </div>
      ))}
      <Divider />
      <div className="Themecontent">
        <div className="Togglecontent">
          <div className="grid theme-container">
            <div className="content">
              <div className="demo">
                <label className="switch">
                  <input
                    type="checkbox"
                    className="theme-swither"
                    onClick={CambiarTheme}
                    aria-label="Cambiar tema"
                  ></input>
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
//#region links
const linksArray = [
  {
    label: "Inicio",
    icon: <MdOutlineHome />,
    to: "/",
  },
  {
    label: "Insumos",
    icon: <MdInventory2 />,
    to: "/insumos",
  },
  {
    label: "Productos",
    icon: <FaBook />,
    to: "/productos",
  },
  {
    label: "Devolución",
    icon: <FaRecycle />,
    to: "/devolucion",
  },
];

//#endregion

//#region secondary links
const secondarylinksArray = [
  {
    label: "Usuarios",
    icon: <HiOutlineUserGroup />,
    to: "/usuarios",
  },
];
//#endregion

//#region daily links
const dailyLinksArray = [
  {
    label: "Compras",
    icon: <MdOutlineShoppingCart />,
    to: "/compras",
  },
  {
    label: "Producción",
    icon: <MdOutlineBuild />,
    to: "/produccion",
  },
  {
    label: "Ventas",
    icon: <TbCashRegister />,
    to: "/ventas",
  },
  {
    label: "Estadisticas",
    icon: <IoStatsChartOutline />,
    to: "/estadisticas",
  },
];
//#endregion

//#region styled components

// Animaciones
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-10px);
  }
`;
const Container = styled.div`
  background: ${(props) => props.theme.bg};
  color: ${(props) => props.theme.text};
  position: fixed;
  top: 60px;
  left: 0;
  width: ${({ $isOpen }) => ($isOpen ? "220px" : "90px")};
  height: calc(100vh - 60px);
  transition: width 0.3s ease-in-out;

  .sidebarbutton {
    position: absolute;
    top: ${v.xxlSpacing};
    right: -18px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${(props) => props.theme.bgtgderecha};
    box-shadow: 0 0 4px ${(props) => props.theme.bg3},
      0 0 7px ${(props) => props.theme.bg};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    transform: ${({ $isOpen }) => ($isOpen ? `initial` : `rotate(180deg)`)};
    border: none;
    letter-spacing: inherit;
    color: inherit;
    font-size: inherit;
    text-align: inherit;
    padding: 0;
    font-family: inherit;
    outline: none;
  }
  .logocontent {
    display: flex;
    justify-content: center;
    margin: -3.2rem 0 0 0;
    align-items: center;
    padding: ${v.smSpacing};
    gap: ${v.ssmSpacing};
    .imgcontent {
      display: flex;
      img {
        width: 2rem;
        max-width: 100%;
        height: auto;
      }
      cursor: pointer;
      transition: all 0.3s;
      transform: ${({ $isOpen }) => ($isOpen ? `scale(0.7)` : `scale(1.1)`)};
    }
    h2 {
      display: ${({ $isOpen }) => ($isOpen ? `block` : `none`)};
    }
  }
  .LinkContainer {
    margin: 8px 0;
    padding: 0 15%;
    :hover {
      background: ${(props) => props.theme.bg3};
      border-radius: 5px;
      transition: background-color 0.3s;
    }
    .Links {
      display: flex;
      align-items: center;
      text-decoration: none;
      padding: calc(${v.smSpacing}-2px) 0;
      color: ${(props) => props.theme.text};
      height: 50px;
      .Linkicon {
        padding: ${v.smSpacing} ${v.mdSpacing};
        display: flex;
        svg {
          font-size: 25px;
        }
      }
      &.active {
        .Linkicon {
          svg {
            color: ${(props) => props.theme.bg4};
          }
        }
      }
      .LinkText {
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
        &.visible {
          animation: ${fadeIn} 0.3s ease-in-out forwards;
        }
        &.hidden {
          animation: ${fadeOut} 0.3s ease-in-out forwards;
        }
      }
    }
  }
  .Themecontent {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .titletheme {
      display: block;
      padding: 10px;
      font-weight: 700;
      opacity: ${({ $isOpen }) => ($isOpen ? `1` : `0`)};
      transition: all 0.3s;
      white-space: nowrap;
      overflow: hidden;
    }
    .Togglecontent {
      margin: ${({ $isOpen }) => ($isOpen ? `auto 40px` : `auto 15px`)};
      width: 36px;
      height: 20px;
      border-radius: 10px;
      transition: all 0.3s;
      position: relative;
      .theme-container {
        background-blend-mode: multiply, multiply;
        transition: 0.4s;
        .grid {
          display: grid;
          justify-items: center;
          align-content: center;
          height: 100vh;
          width: 100vw;
          font-family: "Lato", sans-serif;
        }
        .demo {
          font-size: 20px;
          .switch {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 22px;
            .theme-swither {
              opacity: 0;
              width: 0;
              height: 0;
              &:checked + .slider:before {
                left: -6px;
                content: "🌑";
                transform: translateX(26px);
              }
            }
            .slider {
              position: absolute;
              cursor: pointer;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: ${({ $themeUse }) =>
                $themeUse === "light" ? v.lightcheckbox : v.checkbox};
              transition: 0.4s;
              &::before {
                position: absolute;
                content: "☀️";
                height: 0px;
                width: 0px;
                left: -8px;
                top: 11px;
                line-height: 0px;
                transition: 0.4s;
              }
              &.round {
                border-radius: 24px;
                &::before {
                  border-radius: 50%;
                }
              }
            }
          }
        }
      }
    }
  }
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background: ${(props) => props.theme.bg3};
  margin: ${v.lgSpacing} 0;
`;
//#endregion
