"use client";

import { useState } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  Package, 
  MapPin, 
  Phone, 
  Mail,
  Trash2,
  Clock
} from "lucide-react";
import type { OrderDoc, ItemDoc } from "@/app/[locale]/admin/order-actions";
import { updateOrderStatus, deleteOrder, getOrder } from "@/app/[locale]/admin/order-actions";

type Props = {
  order: OrderDoc;
  onUpdate: () => void;
};

const statusColors = {
  ordered: "bg-yellow-100 text-yellow-800 border-yellow-300",
  confirmed: "bg-blue-100 text-blue-800 border-blue-300",
  processing: "bg-purple-100 text-purple-800 border-purple-300",
  delivering: "bg-orange-100 text-orange-800 border-orange-300",
  delivered: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

export default function AdminOrderRow({ order, onUpdate }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [items, setItems] = useState<ItemDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleExpand() {
    if (!expanded && items.length === 0) {
      setLoading(true);
      try {
        const data = await getOrder(order.$id);
        setItems(data.items);
      } catch (error) {
        console.error("Failed to load order items:", error);
      } finally {
        setLoading(false);
      }
    }
    setExpanded(!expanded);
  }

  async function handleStatusChange(newStatus: OrderDoc["status"]) {
    setLoading(true);
    try {
      await updateOrderStatus(order.$id, newStatus);
      onUpdate();
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update order status");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this order? This cannot be undone.")) {
      return;
    }

    setDeleting(true);
    try {
      await deleteOrder(order.$id);
      onUpdate();
    } catch (error) {
      console.error("Failed to delete order:", error);
      alert("Failed to delete order");
    } finally {
      setDeleting(false);
    }
  }

  const orderDate = new Date(order.$createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="border border-gray-200 bg-white">
      {/* Order Header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3 flex-wrap">
              <h3 className="font-black text-gray-900 uppercase">
                {order.fullName}
              </h3>
              <span className={`text-xs font-bold uppercase px-2 py-1 border rounded ${statusColors[order.status]}`}>
                {order.status}
              </span>
            </div>
            
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{orderDate}</span>
              </div>
              <div className="font-bold text-gray-900">
                {order.totalAmount.toFixed(2)} MAD
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-sm p-2 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              title="Delete order"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              onClick={handleExpand}
              className="rounded-sm p-2 hover:bg-gray-100 transition-colors"
            >
              {expanded ? (
                <ChevronUp className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-4">
          {loading ? (
            <div className="text-center py-4">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
            </div>
          ) : (
            <>
              {/* Customer Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">
                    Order number
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p className="font-bold text-gray-900">{order.orderNumber}</p>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-3 w-3" />
                      <a href={`tel:${order.phone}`} className="hover:text-gray-900">
                        {order.phone}
                      </a>
                    </div>
                    {order.email && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="h-3 w-3" />
                        <a href={`mailto:${order.email}`} className="hover:text-gray-900">
                          {order.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">
                    Shipping Address
                  </h4>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="h-3 w-3 mt-1 flex-shrink-0" />
                    <div>
                      <p>{order.address}</p>
                      <p>{order.city}, {order.postalCode}</p>
                      <p className="text-xs mt-1">📍 {order.sourceCountry}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">
                  Items ({items.length})
                </h4>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.$id}
                      className="flex items-center justify-between bg-white border border-gray-200 p-3 text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <Package className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-bold text-gray-900">{item.title}</p>
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-bold text-gray-900">
                        {(item.price * item.quantity).toFixed(2)} MAD
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {order.notes && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">
                    Notes
                  </h4>
                  <p className="text-sm text-gray-600 bg-white border border-gray-200 p-3">
                    {order.notes}
                  </p>
                </div>
              )}

              {/* Status Update */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">
                  Update Status
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(["ordered", "confirmed", "processing", "delivering", "delivered", "cancelled"] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      disabled={loading || order.status === status}
                      className={`
                        px-3 py-1 text-xs font-bold uppercase rounded border transition-colors
                        ${order.status === status 
                          ? statusColors[status] 
                          : "bg-white border-gray-300 text-gray-700 hover:border-gray-900"
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Metadata */}
              <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                <p>IP: {order.ipAddress}</p>
                <p className="truncate">User Agent: {order.userAgent}</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}