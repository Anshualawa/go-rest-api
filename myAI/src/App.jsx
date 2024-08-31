import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Layout from "./Layout"
import MyChatGPT from "./components/MyChatGPT"


function App() {

  return (
    <>
      <Router>
        <Routes path="/" element={<Layout />}>
          <Route index element={<MyChatGPT />} />
          
        </Routes>
      </Router>
    </>
  )
}

export default App
