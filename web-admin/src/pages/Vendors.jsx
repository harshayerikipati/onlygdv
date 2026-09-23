import { useEffect, useState } from "react";
import client from "../api/client";

export default function Vendors() {
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);

  function load() {
    client.get("/api/vendors/pending").then(({ data }) => setPending(data));
    client.get("/api/vendors").then(({ data }) => setApproved(data));
  }

  useEffect(load, []);

  async function setStatus(id, status) {
    await client.put(`/api/vendors/${id}/status`, { status });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Vendors</h1>

      <h2 className="font-semibold text-slate-700 mb-2">Pending approval</h2>
      <table className="w-full bg-white rounded-lg shadow mb-8 text-sm">
        <thead className="bg-slate-100 text-left">
          <tr>
            <th className="p-3">Business</th>
            <th className="p-3">Type</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {pending.map((v) => (
            <tr key={v.id} className="border-t">
              <td className="p-3">{v.businessName}</td>
              <td className="p-3">{v.type}</td>
              <td className="p-3 space-x-2">
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded-md text-xs"
                  onClick={() => setStatus(v.id, "APPROVED")}
                >
                  Approve
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded-md text-xs"
                  onClick={() => setStatus(v.id, "SUSPENDED")}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
          {pending.length === 0 && (
            <tr>
              <td className="p-3 text-slate-400" colSpan={3}>No pending vendors.</td>
            </tr>
          )}
        </tbody>
      </table>

      <h2 className="font-semibold text-slate-700 mb-2">Approved vendors</h2>
      <table className="w-full bg-white rounded-lg shadow text-sm">
        <thead className="bg-slate-100 text-left">
          <tr>
            <th className="p-3">Business</th>
            <th className="p-3">Type</th>
          </tr>
        </thead>
        <tbody>
          {approved.map((v) => (
            <tr key={v.id} className="border-t">
              <td className="p-3">{v.businessName}</td>
              <td className="p-3">{v.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
