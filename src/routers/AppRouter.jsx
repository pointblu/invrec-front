import {
  Home,
  Login,
  Register,
  Users,
  Raws,
  Processed,
  Returned,
  Sales,
  Purchases,
} from "../pages";
import { Route, Routes } from "react-router-dom";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/usuarios" element={<Users />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/ingreso" element={<Login />} />
      <Route path="/insumos" element={<Raws />} />
      <Route path="/produccion" element={<Processed />} />
      <Route path="/devolucion" element={<Returned />} />
      <Route path="/ventas" element={<Sales />} />
      <Route path="/compras" element={<Purchases />} />
    </Routes>
  );
};
