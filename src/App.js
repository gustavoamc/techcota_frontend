import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { UserProvider } from "./context/UserContext";
import Navbar from "./components/layout/Navbar";
import Container from "./components/layout/Container";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Message from "./components/layout/Message";
import CreateBudget from "./pages/budget/CreateBudget";
import Budgets from "./pages/budget/Budgets";


function App() {
  return (
    <Router>
      <UserProvider>
        <Navbar />
        <Message />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/budget/" element={<Budgets />} />
            <Route path="/budget/create" element={<CreateBudget />} />
          </Routes>
        </Container>
        <Footer />
      </UserProvider>
    </Router>
  );
}

export default App;
