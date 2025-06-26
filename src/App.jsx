import { useState } from "react";
import { AppRouter } from "./routers/AppRouter";
import { Header, Sidebar } from "./components";
import styled, { ThemeProvider } from "styled-components";
import { Light, Dark } from "./styles/Themes";
import { ThemeContext } from "./context/ThemeContext";
import { useLocation } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [theme, setTheme] = useState("light");
  const themeStyle = theme === "light" ? Light : Dark;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();
  const location = useLocation();

  const isAuthPage = ["/ingreso", "/registro"].includes(location.pathname);
  return (
    <ThemeContext.Provider value={{ setTheme, theme }}>
      <ThemeProvider theme={themeStyle}>
        <AppContainer>
          {!isAuthPage && user && <Header />}
          <Header />
          <Container className={sidebarOpen ? "sidebarState active" : ""}>
            {!isAuthPage && user && (
              <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            )}
            <ContentContainer $sidebarOpen={!isAuthPage && sidebarOpen}>
              <AppRouter />
            </ContentContainer>
          </Container>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
          />
        </AppContainer>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
const Container = styled.div`
  background: ${({ theme }) => theme.bgtotal};
  color: ${({ theme }) => theme.text};
  display: flex;
  flex: 1;
  overflow: hidden;
  margin-top: 60px;
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 2px;
  background: ${({ theme }) => theme.bgtotal};
  overflow: auto;
  margin-left: ${({ $sidebarOpen }) => ($sidebarOpen ? "220px" : "90px")};
  transition: margin-left 0.3s ease-in-out;
  &::-webkit-scrollbar {
    width: 6px;
  }
`;
export default App;
