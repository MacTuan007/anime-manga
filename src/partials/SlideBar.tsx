import { useNavigate } from "react-router-dom";

export default function SlideBar() {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("email");
        navigate("/");
    };

    return (
        <div className="list-group shadow-sm">
            <button className="list-group-item list-group-item-action active" onClick={() => navigate("/tai-khoan")}>
                Quản lý tài khoản
            </button>
            <button className="list-group-item list-group-item-action" onClick={() => navigate("/doi-mat-khau")}>
                Đổi mật khẩu
            </button>
            <button className="list-group-item list-group-item-action" onClick={() => navigate("/dang-ky-tac-gia")}>
                Đăng ký tác giả
            </button>
            <button className="list-group-item list-group-item-action" onClick={() => navigate("/nang-cap-vip")}>
                Nâng cấp VIP
            </button>
            <button className="list-group-item list-group-item-action" onClick={logout}>
                Đăng xuất
            </button>
        </div>
    );
}
