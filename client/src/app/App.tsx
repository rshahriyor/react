import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "../core/contexts/AuthContext";
import { router } from "./router";

const App = () => {
  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  )
}

export default App;