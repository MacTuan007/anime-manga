import Header from "../partials/Header";
import SlideBar from "../partials/SlideBar";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  ref,
  query,
  orderByChild,
  equalTo,
  get,
} from "firebase/database";

interface Bill {
  email: string;
  amount: number;
  transactionNo: string;
  payDate: string;
}

export default function HistoryBill() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBills = async () => {
      const email = localStorage.getItem("email");
      if (!email) return;

      try {
        const q = query(ref(db, "historybills"), orderByChild("email"), equalTo(email));
        const snapshot = await get(q);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const list = Object.values(data) as Bill[];
          setBills(list);
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  return (
    <>
      <Header />
      <div className="container mt-4">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 mb-3">
            <SlideBar />
          </div>

          {/* Main content */}
          <div className="col-md-9">
            <div className="card shadow-sm">
              <div className="card-header bg-dark text-white">Lịch sử giao dịch</div>
              <div className="card-body">
                {loading ? (
                  <p>Đang tải dữ liệu...</p>
                ) : bills.length === 0 ? (
                  <p>Không có giao dịch nào.</p>
                ) : (
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Số tiền</th>
                        <th>Mã giao dịch</th>
                        <th>Ngày thanh toán</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bills.map((bill, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{bill.amount.toLocaleString()}đ</td>
                          <td>{bill.transactionNo}</td>
                          <td>{formatDate(bill.payDate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ✅ Chuyển dạng 20250720 thành 20/07/2025
function formatDate(raw: string): string {
  if (raw.length !== 14) return raw;

  const year = raw.substring(0, 4);
  const month = raw.substring(4, 6);
  const day = raw.substring(6, 8);
  const hour = raw.substring(8, 10);
  const minute = raw.substring(10, 12);
  const second = raw.substring(12, 14);

  return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
}
