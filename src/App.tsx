import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Index from './layouts';
import LoginRegister from './layouts/LoginRegister';
import Account from './layouts/Account';
import ChangePassword from './layouts/ChangePassword';
import UpdateVip from './layouts/UpdateVip';
import Success from './layouts/Success';
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/loginregister" element={<LoginRegister />} />
        <Route path="/tai-khoan" element={<Account />} />
        <Route path="/doi-mat-khau" element={<ChangePassword />} />
        <Route path="/nang-cap-vip" element={<UpdateVip />} />
        <Route path="/Success" element={<Success />} />
        <Route path="/Failure" element={<Success />} />
      </Routes>
    </BrowserRouter>
  );
}