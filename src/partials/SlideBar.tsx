import { NavLink } from "react-router-dom";

export default function SlideBar() {

    const logout = () => {
        localStorage.removeItem("email");
    };

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `list-group-item list-group-item-action ${isActive ? "active" : ""}`;

    return (
        <div className="list-group shadow-sm d-grid gap-2">
            <NavLink to="/tai-khoan" className={linkClass}>
                Quản lý tài khoản
            </NavLink>
            <NavLink to="/doi-mat-khau" className={linkClass}>
                Đổi mật khẩu
            </NavLink>
            <NavLink to="/dang-ky-tac-gia" className={linkClass}>
                Đăng ký tác giả
            </NavLink>
            <NavLink to="/nang-cap-vip" className={linkClass}>
                Nâng cấp VIP
            </NavLink>
            <NavLink to="/lich-su-giao-dich" className={linkClass}>
                Lịch sử giao dịch
            </NavLink>
            <NavLink to="/" className={linkClass} onClick={logout}>
                Đăng xuất
            </NavLink>
        </div>
    );
}
