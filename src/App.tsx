import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Index from './layouts';
import LoginRegister from './layouts/LoginRegister';
import Account from './layouts/Account';
import ChangePassword from './layouts/ChangePassword';
import UpdateVip from './layouts/UpdateVip';
import Success from './layouts/Success';
import HistoryBill from './layouts/HistoryBill';
import Failure from './layouts/Failure';
import TheLoai from './layouts/TheLoai';
import TruyenDetailPage from './layouts/TruyenDetail';
import ChuongDetailPage from './layouts/ChuongDetail';
import TheoDoiPage from './layouts/TheoDoiPage';
import LichSuPage from './layouts/LichSuPage';
import TimKiemPage from './layouts/TimKiem';

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
        <Route path="/Failure" element={<Failure />} />
        <Route path="/lich-su-giao-dich" element={<HistoryBill />} />
        <Route path="/the-loai/:tag" element={<TheLoai />} />
        <Route path="chi-tiet/:idtruyen" element={<TruyenDetailPage />} />
        <Route path="/chuong-chi-tiet/:idtruyen/:sochuong" element={<ChuongDetailPage />} />
        <Route path="/theo-doi" element={<TheoDoiPage />} />
        <Route path="/lich-su" element={<LichSuPage />} />
        <Route path="/tim-kiem" element={<TimKiemPage />} />
      </Routes>
    </BrowserRouter>
  );
}