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
            <AppRouter />
          </Container>
        </AppContainer>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
const Container = styled.div`
  display: grid;
  grid-template-columns: 90px auto;
  background: ${({ theme }) => theme.bgtotal};
  transition: all 0.3s;
  &.active {
    grid-template-columns: 220px auto;
  }
  color: ${({ theme }) => theme.text};
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export default App;
