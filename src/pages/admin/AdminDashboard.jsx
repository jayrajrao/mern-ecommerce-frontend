import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPendingProducts, getAllOrders } from "../../services/admin.service";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ pendingProducts: 0, totalOrders: 0, pendingReturns: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [products, orders] = await Promise.all([
          getPendingProducts(),
          getAllOrders(),
        ]);
        const pendingReturns = orders.filter((o) => o.returnStatus === "requested").length;
        setStats({
          pendingProducts: products.length,
          totalOrders: orders.length,
          pendingReturns,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-8">
      <h2 className="mb-6 text-2xl font-bold">Admin Dashboard</h2>
      <div className="flex gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6 text-center min-w-[150px]">
          <h3 className="text-2xl font-bold">{stats.pendingProducts}</h3>
          <p className="text-gray-500">Pending Products</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 text-center min-w-[150px]">
          <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
          <p className="text-gray-500">Total Orders</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 text-center min-w-[150px]">
          <h3 className="text-2xl font-bold">{stats.pendingReturns}</h3>
          <p className="text-gray-500">Pending Returns</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Link to="/admin/products" className="text-blue-600 underline">Manage Products →</Link>
        <Link to="/admin/categories" className="text-blue-600 underline">Manage Categories →</Link>
        <Link to="/admin/orders" className="text-blue-600 underline">Manage Orders →</Link>
      </div>
    </div>
  );
};

export default AdminDashboard;