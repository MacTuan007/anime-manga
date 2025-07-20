import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { useEffect } from "react";
import {
    push,
    ref,
    update,
    get,
    query,
    orderByChild,
    equalTo
} from "firebase/database";
import type { Bill } from "../interfaces/Bill";
import Footer from "../partials/Footer";

export default function Success() {
    const navigate = useNavigate();
    const location = useLocation();
    const emailkey = localStorage.getItem("emailkey");

    useEffect(() => {
        const saveBillToFirebase = async () => {
            const queryParams = new URLSearchParams(location.search);
            const amount = parseInt(queryParams.get("amount") || "0") / 100;
            const transactionNo = queryParams.get("transactionNo") || "";
            const payDate = queryParams.get("payDate") || "";
            const email = localStorage.getItem("email");

            if (email && amount && transactionNo && payDate) {
                // 🔐 Kiểm tra session
                const already = sessionStorage.getItem(`processed_${transactionNo}`);
                if (already === "1") {
                    console.warn("Đã xử lý trong session.");
                    return;
                }

                try {
                    // ✅ Kiểm tra trên Firebase: dùng orderByChild + equalTo
                    const billQuery = query(
                        ref(db, "historybills"),
                        orderByChild("transactionNo"),
                        equalTo(transactionNo)
                    );
                    const snap = await get(billQuery);

                    if (snap.exists()) {
                        console.warn("⚠️ Giao dịch đã tồn tại.");
                    } else {
                        // ✅ Ghi bill
                        const bill: Bill = {
                            email,
                            amount,
                            transactionNo,
                            payDate,
                        };
                        await push(ref(db, "historybills"), bill);
                    }

                    // ✅ Tính thời hạn VIP
                    let duration = 0;
                    if (amount === 5000) duration = 1;
                    else if (amount === 29000) duration = 30;
                    else if (amount === 299000) duration = 365;

                    const today = new Date();
                    today.setDate(today.getDate() + duration);
                    const dateoff = today.toISOString().split("T")[0];

                    // ✅ Cập nhật user
                    await update(ref(db, `users/${emailkey}`), {
                        vip: 1,
                        dateoff: dateoff,
                    });

                    // ✅ Đánh dấu session
                    sessionStorage.setItem(`processed_${transactionNo}`, "1");

                    // ✅ Xoá query khỏi URL
                    navigate("/success", { replace: true });
                } catch (err) {
                    console.error("❌ Lỗi xử lý:", err);
                }
            }
        };

        saveBillToFirebase();
    }, [location.search]);

    return (
        <>
            <header className="header">
                <img
                    src="/logo.png"
                    alt="Logo"
                    className="logo"
                    onClick={() => navigate("/")}
                    style={{ cursor: "pointer" }}
                />
            </header>

            <div className="mt-5">
                <div className="alert alert-success" role="alert">
                    ✅ Thanh toán thành công! Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
                </div>
            </div>
            <Footer />
        </>
    );
}
