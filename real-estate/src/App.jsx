import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./Pages/Home"
import About from "./Pages/About"
import Signin from "./Pages/Signin"
import Profile from "./Pages/Profile"
import Signup from "./Pages/Signup"
import Header from "./components/Header"
import PrivateRoute from "./components/PrivateRoute"

const App = () => {
  return (
      <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/signin" element={<Signin/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/about" element={<About/>} />
        <Route element={<PrivateRoute/>}/>
        <Route path="/profile" element={<Profile/>} />
      </Routes>
      </BrowserRouter>
  )
}

export default App;