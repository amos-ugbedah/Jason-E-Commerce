import {
  ShoppingCart,
  Loader2,
  Truck,
  CheckCircle,
  XCircle,
  Package,
} from "lucide-react";

export default function OrderStatusBadge({ status }) {
  const statusConfig = {
    cart: {
      icon: <ShoppingCart className="w-4 h-4" />,
      bgColor: "bg-gray-100",
      textColor: "text-gray-800",
      label: "In Cart",
    },
    processing: {
      icon: <Loader2 className="w-4 h-4 animate-spin" />,
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      label: "Processing",
    },
    shipped: {
      icon: <Truck className="w-4 h-4" />,
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      label: "Shipped",
    },
    delivered: {
      icon: <CheckCircle className="w-4 h-4" />,
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      label: "Delivered",
    },
    cancelled: {
      icon: <XCircle className="w-4 h-4" />,
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      label: "Cancelled",
    },
    default: {
      icon: <Package className="w-4 h-4" />,
      bgColor: "bg-gray-100",
      textColor: "text-gray-800",
      label: "Unknown",
    },
  };

  const { icon, bgColor, textColor, label } =
    statusConfig[status] || statusConfig.default;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
    >
      <span className="mr-1.5">{icon}</span>
      {label}
    </span>
  );
}
