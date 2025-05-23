import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabaseClient";
import { Button } from "../../../ui/button";
import {
  ArrowLeft,
  Package,
  Loader2,
  Truck,
  CheckCircle,
  XCircle,
  CreditCard,
  MapPin,
  Calendar,
  ShoppingCart,
} from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          navigate("/login");
          return;
        }

        const { data: orderData, error } = await supabase
          .from("jason_orders")
          .select(
            `
            *,
            order_items:jason_order_items(
              *,
              product:product_id(
                *,
                category:category_id(name)
              )
            ),
            shipping_address:shipping_address_id(*),
            billing_address:billing_address_id(*)
          `
          )
          .eq("id", id)
          .eq("user_id", user.id)
          .single();

        if (error) throw error;
        setOrder(orderData);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      setCancelling(true);
      const { error } = await supabase
        .from("jason_orders")
        .update({ status: "cancelled" })
        .eq("id", id);

      if (error) throw error;

      // Update local state
      setOrder((prev) => ({ ...prev, status: "cancelled" }));
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  const getStatusActions = () => {
    if (!order) return null;

    switch (order.status) {
      case "processing":
        return (
          <Button
            variant="destructive"
            onClick={handleCancelOrder}
            disabled={cancelling}
          >
            {cancelling ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <XCircle className="w-4 h-4 mr-2" />
            )}
            Cancel Order
          </Button>
        );
      case "shipped":
        return (
          <Button variant="secondary" disabled>
            <Truck className="w-4 h-4 mr-2" />
            Track Shipment
          </Button>
        );
      case "delivered":
        return (
          <Button variant="secondary">
            <CheckCircle className="w-4 h-4 mr-2" />
            Leave Review
          </Button>
        );
      case "cart":
        return (
          <Button onClick={() => navigate("/cart")}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Complete Checkout
          </Button>
        );
      default:
        return null;
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );

  if (!order)
    return (
      <div className="py-12 text-center">
        <Package className="w-12 h-12 mx-auto text-gray-400" />
        <h3 className="mt-4 mb-2 text-lg font-medium text-gray-700">
          Order not found
        </h3>
        <Button onClick={() => navigate("/dashboard/orders")}>
          Back to My Orders
        </Button>
      </div>
    );

  return (
    <div className="max-w-4xl px-4 py-8 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={() => navigate("/dashboard/orders")}
          variant="ghost"
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Button>
        <h1 className="text-2xl font-bold">Order #{order.order_number}</h1>
        <div className="w-24"></div> {/* Spacer for alignment */}
      </div>

      <div className="mb-8 overflow-hidden bg-white shadow-md rounded-xl">
        {/* Order Summary */}
        <div className="p-6 border-b">
          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <h3 className="mb-1 font-medium text-gray-500">Order Date</h3>
                <p>
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Package className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <h3 className="mb-1 font-medium text-gray-500">Status</h3>
                <OrderStatusBadge status={order.status} />
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CreditCard className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <h3 className="mb-1 font-medium text-gray-500">Total Amount</h3>
                <p className="font-bold">₦{order.total_amount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Order Actions */}
          <div className="flex justify-end space-x-3">
            {getStatusActions()}
            <Button variant="outline" onClick={() => window.print()}>
              Print Invoice
            </Button>
          </div>
        </div>

        {/* Shipping and Billing Info */}
        <div className="grid grid-cols-1 gap-6 p-6 border-b md:grid-cols-2">
          <div>
            <h3 className="flex items-center mb-3 font-medium text-gray-700">
              <Truck className="w-5 h-5 mr-2 text-blue-500" />
              Shipping Information
            </h3>
            {order.shipping_address ? (
              <div className="space-y-1">
                <p className="font-medium">
                  {order.shipping_address.full_name}
                </p>
                <p>{order.shipping_address.address_line1}</p>
                {order.shipping_address.address_line2 && (
                  <p>{order.shipping_address.address_line2}</p>
                )}
                <p>
                  {order.shipping_address.city}, {order.shipping_address.state}{" "}
                  {order.shipping_address.postal_code}
                </p>
                <p>{order.shipping_address.country}</p>
                <p className="mt-2">Phone: {order.shipping_address.phone}</p>
              </div>
            ) : (
              <p className="text-gray-500">No shipping address provided</p>
            )}
          </div>
          <div>
            <h3 className="flex items-center mb-3 font-medium text-gray-700">
              <CreditCard className="w-5 h-5 mr-2 text-blue-500" />
              Billing Information
            </h3>
            {order.billing_address ? (
              <div className="space-y-1">
                <p className="font-medium">{order.billing_address.full_name}</p>
                <p>{order.billing_address.address_line1}</p>
                {order.billing_address.address_line2 && (
                  <p>{order.billing_address.address_line2}</p>
                )}
                <p>
                  {order.billing_address.city}, {order.billing_address.state}{" "}
                  {order.billing_address.postal_code}
                </p>
                <p>{order.billing_address.country}</p>
                <p className="mt-2">Phone: {order.billing_address.phone}</p>
              </div>
            ) : (
              <p className="text-gray-500">Same as shipping address</p>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="p-6">
          <h2 className="mb-6 text-xl font-bold">Order Items</h2>
          <div className="space-y-6">
            {order.order_items.map((item) => (
              <div key={item.id} className="flex pb-6 border-b last:border-b-0">
                <div className="flex-shrink-0 w-20 h-20 overflow-hidden bg-gray-100 rounded-lg">
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
                <div className="flex-1 min-w-0 ml-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{item.product.name}</h3>
                      {item.product.category && (
                        <p className="text-sm text-gray-500">
                          {item.product.category.name}
                        </p>
                      )}
                    </div>
                    <p className="font-medium text-gray-900">
                      ₦{item.price_at_purchase.toFixed(2)}
                    </p>
                  </div>
                  <p className="mt-1 text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    SKU: {item.product.sku || "N/A"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="pt-6 mt-8 border-t">
            <h3 className="mb-4 text-lg font-medium">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₦{order.total_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>₦0.00</span>{" "}
                {/* You can add shipping cost to your orders table */}
              </div>
              <div className="flex justify-between pt-3 border-t">
                <span className="font-medium">Total</span>
                <span className="font-bold">
                  ₦{order.total_amount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
