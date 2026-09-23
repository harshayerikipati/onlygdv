import { Link, useNavigate, useLocation } from "react-router-dom";

const NAV = [
  { to: "/", label: "Dashboard" },
  { to: "/vendors", label: "Vendors" },
  { to: "/delivery-boys", label: "Delivery Boys" },
  { to: "/orders", label: "Orders" },
];

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-56 bg-slate-900 text-white flex flex-col">
        <div className="p-5 text-xl font-bold border-b border-slate-700">OnlyGDV Admin</div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`block px-3 py-2 rounded-md text-sm ${
                location.pathname === item.to ? "bg-slate-700" : "hover:bg-slate-800"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button onClick={logout} className="m-3 px-3 py-2 text-sm text-left rounded-md hover:bg-slate-800">
          Log out
        </button>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
