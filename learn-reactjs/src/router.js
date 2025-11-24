import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./homePage";
import UpdatePage from "./updatePhone";
import Login from "./login";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/update/:id" element={<UpdatePage />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
