import {
  Footer,
  Header,
  Home,
  Login,
  Register,
  SideNav,
  Users,
} from "../pages";
import { Route, Routes } from "react-router-dom";

export const AppRouter = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/usuarios" element={<Users />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/ingreso" element={<Login />} />
      </Routes>
      <SideNav />
      <Footer />
    </>
  );
};
