import { useEffect, useState } from "react";
import client from "../api/client";

const STATUS_COLORS = {
  PLACED: "bg-yellow-100 text-yellow-800",
  ACCEPTED: "bg-blue-100 text-blue-800",
  PREPARING: "bg-blue-100 text-blue-800",
  READY: "bg-purple-100 text-purple-800",
  PICKED_UP: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

// Statuses an admin can manually push an order into from the panel.
// (ACCEPTED/PREPARING are normally set by the vendor app, but admin can
// override if a vendor is slow or unreachable.)
const NEXT_STATUS = {
  PLACED: "ACCEPTED",
  ACCEPTED: "PREPARING",
  PREPARING: "READY",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [riders, setRiders] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [assigning, setAssigning] = useState(null); // order id currently showing the rider picker

  function loadOrders() {
    client.get("/api/orders").then(({ data }) => setOrders(data));
  }

  useEffect(() => {
    loadOrders();
    client.get("/api/delivery").then(({ data }) => setRiders(data)).catch(() => {});
  }, []);

  const filtered = filter === "ALL" ? orders : orders.filter((o) => o.status === filter);
  const statuses = ["ALL", ...Object.keys(STATUS_COLORS)];

  async function advanceStatus(order) {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    await client.put(`/api/orders/${order.id}/status`, { status: next });
    loadOrders();
  }

  async function assignRider(orderId, deliveryId) {
    if (!deliveryId) return;
    await client.put(`/api/orders/${orderId}/assign`, { deliveryId });
    setAssigning(null);
    loadOrders();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      <div className="flex gap-2 mb-4 flex-wrap">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium border ${
              filter === s ? "bg-slate-900 text-white border-slate-900" : "border-slate-300 text-slate-600"
            }`}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      <table className="w-full bg-white rounded-lg shadow text-sm">
        <thead className="bg-slate-100 text-left">
          <tr>
            <th className="p-3">Order ID</th>
            <th className="p-3">Customer</th>
            <th className="p-3">Vendor</th>
            <th className="p-3">Total</th>
            <th className="p-3">Payment</th>
            <th className="p-3">Status</th>
            <th className="p-3">Rider</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((o) => (
            <tr key={o.id} className="border-t align-top">
              <td className="p-3 text-slate-400">{o.id.slice(0, 8)}…</td>
              <td className="p-3">{o.customer?.name}</td>
              <td className="p-3">{o.vendor?.businessName}</td>
              <td className="p-3 font-semibold">₹{o.total}</td>
              <td className="p-3">{o.paymentMethod} · {o.paymentStatus}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[o.status] || ""}`}>
                  {o.status.replace("_", " ")}
                </span>
              </td>
              <td className="p-3">{o.deliveryId ? "Assigned" : "—"}</td>
              <td className="p-3 space-y-2">
                {NEXT_STATUS[o.status] && (
                  <button
                    onClick={() => advanceStatus(o)}
                    className="block bg-slate-900 text-white px-3 py-1 rounded-md text-xs"
                  >
                    Mark {NEXT_STATUS[o.status].replace("_", " ")}
                  </button>
                )}

                {o.status === "READY" && !o.deliveryId && (
                  assigning === o.id ? (
                    <select
                      autoFocus
                      onChange={(e) => assignRider(o.id, e.target.value)}
                      onBlur={() => setAssigning(null)}
                      className="border rounded-md px-2 py-1 text-xs"
                      defaultValue=""
                    >
                      <option value="" disabled>Pick a rider…</option>
                      {riders.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.user?.name} {r.isAvailable ? "(online)" : "(offline)"}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <button
                      onClick={() => setAssigning(o.id)}
                      className="block bg-purple-600 text-white px-3 py-1 rounded-md text-xs"
                    >
                      Assign Rider
                    </button>
                  )
                )}
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td className="p-3 text-slate-400" colSpan={8}>No orders in this view.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
