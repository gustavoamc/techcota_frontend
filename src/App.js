import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import { UserProvider } from "./context/UserContext";


function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
