import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Layout from "./Layout"
import MyChatGPT from "./components/MyChatGPT"
import Users from "./components/Users"


function App() {

  return (
    <>
      <Router>
        <Routes path="/" element={<Layout />}>
          <Route index element={<MyChatGPT />} />
          <Route path="/dashboard" element={<Users />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
