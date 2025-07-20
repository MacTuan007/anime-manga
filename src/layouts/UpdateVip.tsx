import axios from 'axios';
import Header from "../partials/Header";
import SlideBar from "../partials/SlideBar";

export default function UpdateVip() {
    const goiVip = [
        {
            title: "VIP 1 Ngày",
            price: "5.000đ",
            desc: "Truy cập không giới hạn trong 24 giờ.",
            amount: 5000,
            duration: 1,
        },
        {
            title: "VIP 1 Tháng",
            price: "29.000đ",
            desc: "Truy cập không giới hạn trong 30 ngày.",
            amount: 29000,
            duration: 30,
        },
        {
            title: "VIP 1 Năm",
            price: "299.000đ",
            desc: "Truy cập không giới hạn trong 365 ngày.",
            amount: 299000,
            duration: 365,
        },
    ];

    const handleUpgrade = async (amount: number) => {
        try {
            const response = await axios.post('/api/create_payment', { amount: amount });
            console.log('Phản hồi từ server:', response.data);

            // Nếu server trả về URL thanh toán:
            if (response.data?.paymentUrl) {
                window.location.href = response.data.paymentUrl;
            }
        } catch (error: any) {
            console.error('Lỗi khi tạo thanh toán:', error.response?.data || error.message);
            alert("Có lỗi xảy ra khi tạo thanh toán.");
        }
    };

    return (
        <>
            <Header />
            <div className="container mt-4">
                <div className="row">
                    <div className="col-md-3 mb-3">
                        <SlideBar />
                    </div>

                    <div className="col-md-9" style={{ minHeight: "400px" }}>
                        <div className="card shadow-sm">
                            <div className="card-header bg-dark text-white">Các gói VIP</div>
                            <div className="card-body">
                                <div className="row">
                                    {goiVip.map((goi, index) => (
                                        <div className="col-md-4 mb-3" key={index}>
                                            <div className="card h-100 text-center border-primary">
                                                <div className="card-body">
                                                    <h5 className="card-title text-primary">{goi.title}</h5>
                                                    <h6 className="card-subtitle mb-2 text-muted">{goi.price}</h6>
                                                    <p className="card-text">{goi.desc}</p>
                                                    <button
                                                        className="btn btn-outline-primary"
                                                        onClick={() => handleUpgrade(goi.amount)}
                                                    >
                                                        Chọn gói
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
