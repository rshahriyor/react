import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import CompanyDetail from "./pages/CompanyDetail";
import CompanyFilter from "./pages/CompanyFilter";
import MyCompanies from "./pages/user/MyCompanies";
import CompanyForm from "./pages/user/CompanyForm";
import Profile from "./pages/user/Profile";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Home />}></Route>
      <Route path="m/:id" element={<CompanyDetail />}></Route>
      <Route path="m-i" element={<CompanyFilter />}></Route>
      <Route path="u">
        <Route index element={<Navigate to="m-c" replace />} />
        <Route path="m-c" element={<MyCompanies />} />
        <Route path="p" element={<Profile />} />
        <Route path="c-f" element={<CompanyForm />} />
        <Route path="c-f/:id" element={<CompanyForm />} />
      </Route>
    </Route>
  )
);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App;