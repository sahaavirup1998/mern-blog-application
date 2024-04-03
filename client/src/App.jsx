import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../src/pages/Home"
import About from "../src/pages/About"
import Dashboard from "../src/pages/Dashboard"
import SignIn from "../src/pages/SignIn"
import SignUp from "../src/pages/SignUp"
import Projects from "../src/pages/Projects"
import Header from "./components/Header";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;