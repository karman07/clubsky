import React, { useEffect, useState } from "react";
import { Calendar, CreditCard, Loader2 } from "lucide-react";
import { BASE_URL } from "../constants/constants"; // <-- update your API base url here

type Payment = {
  _id: string;
  orderId: string;
  paymentId?: string;
  amount: number;
  status: string;
  receipt?: string;
  rawResponse?: any;
  createdAt: string;
  updatedAt: string;
};

const statusColors: Record<string, string> = {
  created: "bg-yellow-100 text-yellow-700 border-yellow-300",
  success: "bg-green-100 text-green-700 border-green-300",
  failed: "bg-red-100 text-red-700 border-red-300",
};

const PaymentHistory: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch(`${BASE_URL}/payments/history`);
        const data = await res.json();
        setPayments(data);
      } catch (err) {
        console.error("Failed to fetch payments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Payment History
        </h1>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
          </div>
        ) : payments.length === 0 ? (
          <p className="text-gray-500 text-center">No payment history found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm uppercase">
                  <th className="p-3 text-left">Order ID</th>
                  <th className="p-3 text-left">Payment ID</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr
                    key={p._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3 font-mono text-sm">{p.orderId}</td>
                    <td className="p-3 font-mono text-sm">
                      {p.paymentId ?? "-"}
                    </td>
                    <td className="p-3 font-semibold text-gray-800">
                      ₹{p.amount.toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 text-xs rounded-full border ${statusColors[p.status] || "bg-gray-100 text-gray-700 border-gray-300"
                          }`}
                      >
                        {p.status}
                      </span>
                    </td>
      
                    <td className="p-3 flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {new Date(p.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
