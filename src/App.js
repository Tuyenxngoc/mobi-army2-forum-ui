import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import DefaultLayout from './layout/DefaultLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/info" element={<Login />} />
          <Route path="/forum" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;
