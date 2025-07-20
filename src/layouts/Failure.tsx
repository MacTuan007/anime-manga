import { useNavigate } from "react-router-dom";
import Footer from "../partials/Footer";


export default function Failure() {
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
                <div className="alert alert-danger" role="alert">
                    Đã xảy ra lỗi trong quá trình xử lý yêu cầu của bạn. Vui lòng thử lại sau.
                </div>
            </div>
            <Footer />
        </>
    );
}