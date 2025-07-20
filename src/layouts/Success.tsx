import { useNavigate } from "react-router-dom";


export default function Success() {
    const navigate = useNavigate();
    return (
        <>
            <header className="header">
                <img
                    src="/logo.png"
                    alt="Logo"
                    className="logo"
                    onClick={() => navigate('/')}
                />
            </header>
            <div className="mt-5">
                <div className="alert alert-success" role="alert">
                    Thanh toán thành công! Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
                </div>
            </div>
        </>
    );
}