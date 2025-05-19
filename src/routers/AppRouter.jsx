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
  Production,
  Statics,
} from "../pages";
import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoutes";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/registro" element={<Register />} />
      <Route path="/ingreso" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/usuarios" element={<Users />} />
        <Route path="/insumos" element={<Raws />} />
        <Route path="/productos" element={<Processed />} />
        <Route path="/devolucion" element={<Returned />} />
        <Route path="/ventas" element={<Sales />} />
        <Route path="/compras" element={<Purchases />} />
        <Route path="/produccion" element={<Production />} />
        <Route path="/estadisticas" element={<Statics />} />
      </Route>
    </Routes>
  );
};
