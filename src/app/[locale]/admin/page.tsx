"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  Users,
  LogOut,
  ChevronRight,
  Clock,
  CheckCircle,
  Filter
} from "lucide-react";

import { getOrderStats, listOrders } from "@/actions/admin/orders";
import { listProductsAction } from "@/actions/admin/products";
import { deleteCurrentSession, getCurrentAccount } from "@/lib/appwrite/client";

import AdminLogin from "@/components/admin/auth/AdminLoginForm";
import WelcomeMessage from "@/components/admin/WelcomeMessage";
import AdminCreateProductForm from "@/components/admin/products/ProductForm";
import AdminProductRow from "@/components/admin/products/ProductRow";
import AdminOrderRow from "@/components/admin/orders/OrderRow";

import { ProductDoc } from "@/types/product";
import { OrderDoc } from "@/types/order";

type TabType = "overview" | "products" | "orders";
type AdminUser = {
  email: string;
  name?: string;
};
type OrderStats = Awaited<ReturnType<typeof getOrderStats>>;

export default function AdminDashboard() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [products, setProducts] = useState<ProductDoc[]>([]);
  const [orders, setOrders] = useState<OrderDoc[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [orderFilter, setOrderFilter] = useState<string>("all");
  const [loadingOrders, setLoadingOrders] = useState(false);

  const loadDashboardData = useCallback(async () => {
    try {
      const [productsData, statsData] = await Promise.all([
        listProductsAction(),
        getOrderStats(),
      ]);
      setProducts(productsData as ProductDoc[]);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    }
  }, []);

  const loadOrders = useCallback(async (status?: string) => {
    setLoadingOrders(true);
    try {
      const ordersData = await listOrders(status);
      setOrders(ordersData as OrderDoc[]);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentUser = (await getCurrentAccount()) as AdminUser;
        const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",") || [];

        if (adminEmails.includes(currentUser.email)) {
          setUser(currentUser);
          await loadDashboardData();
        }
      } catch {
        // No active session
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [loadDashboardData]);

  useEffect(() => {
    if (activeTab === "orders" && user) {
      loadOrders(orderFilter);
    }
  }, [activeTab, orderFilter, user, loadOrders]);

  const handleLogin = (loggedInUser: AdminUser) => {
    setUser(loggedInUser);
    setShowWelcome(true);
  };

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    loadDashboardData();
  };

  const handleLogout = async () => {
    try {
      await deleteCurrentSession();
      setUser(null);
      setProducts([]);
      setOrders([]);
      setStats(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleOrderUpdate = () => {
    loadOrders(orderFilter);
    loadDashboardData(); // Refresh stats
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900 mx-auto" />
          <p className="text-sm font-medium text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin onSuccess={handleLogin} />;
  }

  if (showWelcome) {
    return <WelcomeMessage userName={user.name || user.email} onComplete={handleWelcomeComplete} />;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900 md:text-3xl">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Welcome back, {user.name || user.email}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/shop"
                className="hidden rounded-sm border border-gray-300 px-4 py-2 text-sm font-bold uppercase tracking-wide text-gray-700 transition-colors hover:border-gray-900 hover:bg-gray-50 sm:block"
              >
                View Shop
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-sm bg-gray-900 px-4 py-2 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-gray-800"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex gap-6">
            {[
              { id: "overview" as TabType, label: "Overview", icon: TrendingUp },
              { id: "products" as TabType, label: "Products", icon: Package },
              { id: "orders" as TabType, label: "Orders", icon: ShoppingBag },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 border-b-2 px-4 py-4 text-sm font-bold uppercase tracking-wide transition-colors ${
                    activeTab === tab.id
                      ? "border-gray-900 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              <div className="border border-gray-200 bg-white p-6">
                <div className="mb-2 flex items-center justify-between">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <div className="text-2xl font-black text-gray-900">{stats?.total || 0}</div>
                <div className="text-xs uppercase tracking-wide text-gray-600">Total Orders</div>
              </div>

              <div className="border border-gray-200 bg-white p-6">
                <div className="mb-2 flex items-center justify-between">
                  <Clock className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="text-2xl font-black text-gray-900">{stats?.ordered || 0}</div>
                <div className="text-xs uppercase tracking-wide text-gray-600">New Orders</div>
              </div>

              <div className="border border-gray-200 bg-white p-6">
                <div className="mb-2 flex items-center justify-between">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="text-2xl font-black text-gray-900">{stats?.delivered || 0}</div>
                <div className="text-xs uppercase tracking-wide text-gray-600">Delivered</div>
              </div>

              <div className="border border-gray-200 bg-white p-6">
                <div className="mb-2 flex items-center justify-between">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-2xl font-black text-gray-900">
                  {stats?.totalRevenue?.toFixed(0) || 0} MAD
                </div>
                <div className="text-xs uppercase tracking-wide text-gray-600">Total Revenue</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="border border-gray-200 bg-white p-6">
                <h2 className="mb-4 text-lg font-black uppercase text-gray-900">Quick Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="flex w-full items-center justify-between rounded-sm border border-gray-300 p-4 text-left transition-colors hover:border-gray-900 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="h-5 w-5 text-gray-600" />
                      <span className="font-bold text-gray-900">View Orders</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                  <button
                    onClick={() => setActiveTab("products")}
                    className="flex w-full items-center justify-between rounded-sm border border-gray-300 p-4 text-left transition-colors hover:border-gray-900 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-gray-600" />
                      <span className="font-bold text-gray-900">Manage Products</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 bg-white p-6">
                <h2 className="mb-4 text-lg font-black uppercase text-gray-900">Order Status</h2>
                <div className="space-y-3">
                  {[
                    { status: "Ordered", count: stats?.ordered || 0, color: "bg-yellow-500" },
                    { status: "Processing", count: stats?.processing || 0, color: "bg-blue-500" },
                    { status: "Delivering", count: stats?.delivering || 0, color: "bg-purple-500" },
                    { status: "Delivered", count: stats?.delivered || 0, color: "bg-green-500" },
                  ].map((item) => (
                    <div key={item.status} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${item.color}`} />
                        <span className="text-sm font-medium text-gray-700">{item.status}</span>
                      </div>
                      <span className="text-sm font-black text-gray-900">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-black uppercase text-gray-900">Add Product</h2>
              <AdminCreateProductForm />
            </div>

            <div className="border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-black uppercase text-gray-900">
                Manage Products ({products.length})
              </h2>
              <div className="space-y-3">
                {products.length === 0 ? (
                  <p className="text-sm text-gray-600">No products yet.</p>
                ) : (
                  products
                    .slice()
                    .reverse()
                    .map((p) => <AdminProductRow key={p.$id} product={p} />)
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex items-center justify-between border border-gray-200 bg-white p-4">
              <h2 className="text-lg font-black uppercase text-gray-900">
                Orders ({orders.length})
              </h2>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-600" />
                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="border border-gray-300 px-3 py-2 text-sm font-bold uppercase focus:border-gray-900 focus:outline-none"
                >
                  <option value="all">All Orders</option>
                  <option value="ordered">Ordered</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="delivering">Delivering</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-3">
              {loadingOrders ? (
                <div className="flex justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
                </div>
              ) : orders.length === 0 ? (
                <div className="border border-gray-200 bg-white p-12 text-center">
                  <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600">
                    {orderFilter === "all" ? "No orders yet" : `No ${orderFilter} orders`}
                  </p>
                </div>
              ) : (
                orders.map((order) => (
                  <AdminOrderRow
                    key={order.$id}
                    order={order}
                    onUpdate={handleOrderUpdate}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
