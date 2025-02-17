import { useState } from "react";
import { AppRouter } from "./routers/AppRouter";
import { Header, Sidebar } from "./components";
import styled, { ThemeProvider } from "styled-components";
import { Light, Dark } from "./styles/Themes";
import { ThemeContext } from "./context/ThemeContext";

function App() {
  const [theme, setTheme] = useState("light");
  const themeStyle = theme === "light" ? Light : Dark;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <ThemeContext.Provider value={{ setTheme, theme }}>
      <ThemeProvider theme={themeStyle}>
        <AppContainer>
          <Header />
          <Container className={sidebarOpen ? "sidebarState active" : ""}>
            <Sidebar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
            <ContentContainer $sidebarOpen={sidebarOpen}>
              <AppRouter />
            </ContentContainer>
          </Container>
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
  transition: margin-left 0.5s ease-in-out;
  &::-webkit-scrollbar {
    width: 6px;
  }
`;
export default App;
