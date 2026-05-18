import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Chat from "./pages/Chat";
// Add page imports here
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
