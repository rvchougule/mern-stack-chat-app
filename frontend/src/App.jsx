import "./App.css";
import { Outlet } from "react-router";
import axios from "axios";
import { ToastContainer } from "react-toastify";

function App() {
  axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

  return (
    <main className="h-full w-full">
      <ToastContainer />
      <Outlet />
    </main>
  );
}

export default App;
