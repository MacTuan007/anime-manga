import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Index from './layouts';
import LoginRegister from './layouts/LoginRegister';
import Account from './layouts/Account';
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/loginregister" element={<LoginRegister />} />
        <Route path="/tai-khoan" element={<Account />} />
      </Routes>
    </BrowserRouter>
  );
}