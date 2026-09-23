import { useEffect, useState } from "react";
import client from "../api/client";

export default function Dashboard() {
  const [stats, setStats] = useState({ vendors: 0, deliveryBoys: 0, pendingVendors: 0 });

  useEffect(() => {
    async function load() {
      try {
        const [vendors, pending, boys] = await Promise.all([
          client.get("/api/vendors"),
          client.get("/api/vendors/pending"),
          client.get("/api/delivery"),
        ]);
        setStats({
          vendors: vendors.data.length,
          pendingVendors: pending.data.length,
          deliveryBoys: boys.data.length,
        });
      } catch {
        // ignore in scaffold
      }
    }
    load();
  }, []);

  const cards = [
    { label: "Approved Vendors", value: stats.vendors },
    { label: "Pending Vendor Approvals", value: stats.pendingVendors },
    { label: "Delivery Boys", value: stats.deliveryBoys },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-3 gap-5">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl shadow p-5">
            <div className="text-3xl font-bold text-slate-900">{c.value}</div>
            <div className="text-slate-500 text-sm mt-1">{c.label}</div>
          </div>
        ))}
      </div>
      <p className="text-slate-400 text-sm mt-8">
        Add sales/revenue charts here once payments are wired in — order totals are already
        available via GET /api/orders endpoints per role.
      </p>
    </div>
  );
}
