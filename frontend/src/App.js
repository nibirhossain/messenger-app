import {BrowserRouter, Routes, Route} from "react-router-dom"
import Login from "./components/Login";
import Registration from "./components/Registration";
import Messenger from "./components/Messenger";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/messenger/login" element={<Login/>} />
          <Route path="/messenger/registration" element={<Registration/>} />
          <Route path="/" element={<Messenger/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
