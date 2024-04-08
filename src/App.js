import { Routes, Route, BrowserRouter } from 'react-router-dom';
import DefaultLayout from './layout/DefaultLayout';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Info from './pages/Info/Info';
import Forum from './pages/Forum/Forum';
import Register from './pages/Register/Register';
import NotFound from './pages/NotFound/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<DefaultLayout />}>
          <Route index element={<Home />} />
          <Route path="info" element={<Info />} />
          <Route path="forum" element={<Forum />} />
          <Route path="forum/login" element={<Login />} />
          <Route path="forum/register" element={<Register />} />
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;
