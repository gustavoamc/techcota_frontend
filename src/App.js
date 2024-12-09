import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { UserProvider } from "./context/UserContext";
import Navbar from "./components/layout/Navbar";
import Container from "./components/layout/Container";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";


function App() {
  return (
    <Router>
      <UserProvider>
        <Navbar />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Container>
        <Footer />
      </UserProvider>
    </Router>
  );
}

export default App;
