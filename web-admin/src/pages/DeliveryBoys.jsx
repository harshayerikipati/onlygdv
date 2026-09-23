import { useEffect, useState } from "react";
import client from "../api/client";

export default function DeliveryBoys() {
  const [boys, setBoys] = useState([]);

  useEffect(() => {
    client.get("/api/delivery").then(({ data }) => setBoys(data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Delivery Boys</h1>
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
          {boys.map((b) => (
            <tr key={b.id} className="border-t">
              <td className="p-3">{b.user?.name}</td>
              <td className="p-3">{b.user?.phone}</td>
              <td className="p-3">{b.vehicleType || "—"}</td>
              <td className="p-3">{b.isAvailable ? "Online" : "Offline"}</td>
            </tr>
          ))}
          {boys.length === 0 && (
            <tr>
              <td className="p-3 text-slate-400" colSpan={4}>No delivery boys registered yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
