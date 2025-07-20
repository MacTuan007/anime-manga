import Header from "../partials/Header";
import SlideBar from "../partials/SlideBar";

export default function HistoryBill() {
    return (
        <>
            <Header />
            <div className="container mt-4">
                <div className="row">
                    {/* Sidebar */}
                    <div className="col-md-3 mb-3">
                        <SlideBar />
                    </div>

                    {/* Form */}
                    <div className="col-md-9">
                        <div className="card shadow-sm">
                            <div className="card-header bg-dark text-white">Lịch sử giao dịch</div>
                            <div className="card-body">
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}