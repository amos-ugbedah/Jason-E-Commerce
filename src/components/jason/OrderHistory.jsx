import { Truck, Check, Clock, X } from "lucide-react";

export default function OrderHistory({ limit }) {
  const orders = [
    {
      id: "#JSN-2023-001",
      date: "Nov 15, 2023",
      status: "Delivered",
      items: 3,
      total: 149.99,
      icon: <Check className="text-green-500" />,
    },
    {
      id: "#JSN-2023-002",
      date: "Nov 18, 2023",
      status: "Shipped",
      items: 2,
      total: 89.99,
      icon: <Truck className="text-blue-500" />,
    },
    {
      id: "#JSN-2023-003",
      date: "Nov 20, 2023",
      status: "Processing",
      items: 1,
      total: 49.99,
      icon: <Clock className="text-amber-500" />,
    },
    {
      id: "#JSN-2023-004",
      date: "Nov 5, 2023",
      status: "Cancelled",
      items: 4,
      total: 199.99,
      icon: <X className="text-red-500" />,
    },
  ];

  const displayedOrders = limit ? orders.slice(0, limit) : orders;

  return (
    <div className="space-y-4">
      {displayedOrders.map((order) => (
        <div
          key={order.id}
          className="border rounded-lg p-4 hover:shadow-sm transition"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{order.id}</h3>
              <p className="text-sm text-gray-500">{order.date}</p>
            </div>
            <div className="flex items-center space-x-2">
              {order.icon}
              <span
                className={`text-sm font-medium ${
                  order.status === "Delivered"
                    ? "text-green-600"
                    : order.status === "Shipped"
                    ? "text-blue-600"
                    : order.status === "Processing"
                    ? "text-amber-600"
                    : "text-red-600"
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>
          <div className="mt-3 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {order.items} item{order.items > 1 ? "s" : ""}
            </p>
            <p className="font-medium">${order.total.toFixed(2)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
