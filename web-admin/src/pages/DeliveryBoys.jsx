import { useEffect, useState } from "react";
import client from "../api/client";

export default function DeliveryBoys() {
  const [boys, setBoys] = useState([]);

  function load() {
    client.get("/api/delivery").then(({ data }) => setBoys(data));
  }
  useEffect(load, []);

  async function setStatus(id, status) {
    await client.put(`/api/delivery/${id}/status`, { status });
    load();
  }

  const pending = boys.filter((b) => b.status === "PENDING");
  const approved = boys.filter((b) => b.status === "APPROVED");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Delivery Boys</h1>

      <h2 className="font-semibold text-slate-700 mb-2">Pending verification</h2>
      <table className="w-full bg-white rounded-lg shadow mb-8 text-sm">
        <thead className="bg-slate-100 text-left">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Vehicle</th>
            <th className="p-3">Vehicle No.</th>
            <th className="p-3">License No.</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {pending.map((b) => (
            <tr key={b.id} className="border-t">
              <td className="p-3">{b.user?.name}</td>
              <td className="p-3">{b.user?.phone}</td>
              <td className="p-3">{b.vehicleType || "—"}</td>
              <td className="p-3">{b.vehicleNumber || "—"}</td>
              <td className="p-3">{b.licenseNumber || "—"}</td>
              <td className="p-3 space-x-2">
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded-md text-xs"
                  onClick={() => setStatus(b.id, "APPROVED")}
                >
                  Approve
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded-md text-xs"
                  onClick={() => setStatus(b.id, "SUSPENDED")}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
          {pending.length === 0 && (
            <tr>
              <td className="p-3 text-slate-400" colSpan={6}>No riders awaiting verification.</td>
            </tr>
          )}
        </tbody>
      </table>

      <h2 className="font-semibold text-slate-700 mb-2">Approved riders</h2>
      <table className="w-full bg-white rounded-lg shadow text-sm">
        <thead className="bg-slate-100 text-left">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Vehicle</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {approved.map((b) => (
            <tr key={b.id} className="border-t">
              <td className="p-3">{b.user?.name}</td>
              <td className="p-3">{b.user?.phone}</td>
              <td className="p-3">{b.vehicleType || "—"}</td>
              <td className="p-3">{b.isAvailable ? "🟢 Online" : "⚪ Offline"}</td>
            </tr>
          ))}
          {approved.length === 0 && (
            <tr>
              <td className="p-3 text-slate-400" colSpan={4}>No approved riders yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
