import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../ui/button";
import {
  Home,
  ArrowLeft,
  Loader2,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  ShoppingCart,
} from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";

export default function MyOrders({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        // Base query
        let query = supabase
          .from("jason_orders")
          .select(
            `
            id,
            order_number,
            status,
            total_amount,
            created_at,
            order_items:jason_order_items(
              id,
              quantity,
              price_at_purchase,
              product:product_id(
                id,
                name,
                cloudinary_urls
              )
            )
          `
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        // Filter by status if not "all"
        if (activeStatus !== "all") {
          query = query.eq("status", activeStatus);
        }

        const { data, error } = await query;

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user.id, activeStatus]);

  const statuses = [
    { value: "all", label: "All Orders", icon: <Package size={16} /> },
    { value: "cart", label: "In Cart", icon: <ShoppingCart size={16} /> },
    {
      value: "processing",
      label: "Processing",
      icon: <Loader2 size={16} className="animate-spin" />,
    },
    { value: "shipped", label: "Shipped", icon: <Truck size={16} /> },
    { value: "delivered", label: "Delivered", icon: <CheckCircle size={16} /> },
    { value: "cancelled", label: "Cancelled", icon: <XCircle size={16} /> },
  ];

  const getOrderTotalItems = (order) => {
    return order.order_items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            size="icon"
            className="md:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">My Orders</h1>
        </div>
        <Button onClick={() => navigate("/")} variant="ghost">
          <Home className="w-4 h-4 mr-2" /> Go to Home
        </Button>
      </div>

      <div className="p-6 bg-white shadow-sm rounded-xl">
        {/* Status Filter Tabs */}
        <div className="flex pb-2 mb-6 overflow-x-auto scrollbar-hide">
          {statuses.map((status) => (
            <button
              key={status.value}
              onClick={() => setActiveStatus(status.value)}
              className={`flex items-center px-4 py-2 mr-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeStatus === status.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="mr-2">{status.icon}</span>
              {status.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : /* Empty State */
        orders.length === 0 ? (
          <div className="py-12 text-center">
            <Package className="w-12 h-12 mx-auto text-gray-400" />
            <h3 className="mt-4 mb-2 text-lg font-medium text-gray-700">
              No orders found
            </h3>
            <p className="text-gray-500">
              {activeStatus === "all"
                ? "You haven't placed any orders yet."
                : `You don't have any ${activeStatus} orders.`}
            </p>
            <Button onClick={() => navigate("/products")} className="mt-4">
              Browse Products
            </Button>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="overflow-hidden transition-shadow border rounded-lg hover:shadow-sm"
              >
                {/* Order Header */}
                <div className="flex flex-col items-start justify-between gap-2 p-4 border-b bg-gray-50 sm:flex-row sm:items-center">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">
                        Order #{order.order_number}
                      </span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <span className="text-sm text-gray-500">
                      Placed on{" "}
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      {getOrderTotalItems(order)} item
                      {getOrderTotalItems(order) !== 1 ? "s" : ""}
                    </span>
                    <span className="font-medium">
                      ₦{order.total_amount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="p-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {order.order_items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex space-x-4">
                        <div className="flex-shrink-0 w-16 h-16 overflow-hidden bg-gray-100 rounded-md">
                          {item.product.cloudinary_urls?.[0] ? (
                            <img
                              src={item.product.cloudinary_urls[0]}
                              alt={item.product.name}
                              className="object-cover w-full h-full"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full text-gray-400">
                              <Package size={20} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                          <p className="text-sm font-medium">
                            ₦{item.price_at_purchase.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.order_items.length > 3 && (
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500">
                          +{order.order_items.length - 3} more item
                          {order.order_items.length - 3 !== 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="flex justify-end p-4 border-t bg-gray-50">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
