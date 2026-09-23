"use client";

import { useEffect, useState } from "react";

import {
  CheckCircle2,
  Loader2,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  Save,
  ShoppingBag,
  Truck,
  UserRound,
} from "lucide-react";

import { supabase } from "@/app/lib/supabase";

interface Product {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customer_name?: string;
  phone?: string;
  address?: string;
  products?: Product[];
  total?: number;
  status?: string;
  location?: string;
  created_at?: string;
}

const STATUS_OPTIONS = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [savingId, setSavingId] =
    useState<string | null>(null);

  const [statusValues, setStatusValues] =
    useState<Record<string, string>>({});

  const [locationValues, setLocationValues] =
    useState<Record<string, string>>({});

  /*
  ========================================
  LOAD ORDERS

  No login check
  No admin role check
  ========================================
  */

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders(showRefresh = false) {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        throw error;
      }

      const orderList = (data || []) as Order[];

      setOrders(orderList);

      const statuses: Record<string, string> = {};
      const locations: Record<string, string> = {};

      orderList.forEach((order) => {
        statuses[order.id] =
          order.status || "Pending";

        locations[order.id] =
          order.location || "";
      });

      setStatusValues(statuses);
      setLocationValues(locations);
    } catch (error) {
      console.error(
        "Orders loading error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to load orders."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  /*
  ========================================
  UPDATE ORDER
  ========================================
  */

  async function updateOrder(id: string) {
    const status =
      statusValues[id] || "Pending";

    const location =
      locationValues[id]?.trim() || "";

    setSavingId(id);

    try {
      const { error } = await supabase
        .from("orders")
        .update({
          status,
          location,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) {
        throw error;
      }

      setOrders((current) =>
        current.map((order) =>
          order.id === id
            ? {
                ...order,
                status,
                location,
              }
            : order
        )
      );

      alert("✅ Order Updated Successfully!");
    } catch (error) {
      console.error(
        "Order update error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Order update failed."
      );
    } finally {
      setSavingId(null);
    }
  }

  /*
  ========================================
  PRICE FORMAT
  ========================================
  */

  function formatPrice(value?: number) {
    return Number(value || 0).toLocaleString(
      "en-IN"
    );
  }

  /*
  ========================================
  STATUS STYLE
  ========================================
  */

  function getStatusStyle(status?: string) {
    switch (status) {
      case "Delivered":
        return "bg-green-50 text-green-700 border-green-100";

      case "Out for Delivery":
        return "bg-blue-50 text-blue-700 border-blue-100";

      case "Shipped":
        return "bg-violet-50 text-violet-700 border-violet-100";

      case "Confirmed":
        return "bg-amber-50 text-amber-700 border-amber-100";

      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  }

  /*
  ========================================
  LOADING
  ========================================
  */

  if (loading) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#fffaf5]
        "
      >
        <div className="text-center">
          <Loader2
            size={40}
            className="
              mx-auto
              animate-spin
              text-orange-500
            "
          />

          <p
            className="
              mt-4
              font-bold
              text-gray-700
            "
          >
            Loading Orders...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="
        min-h-screen
        bg-gradient-to-br
        from-[#fffaf5]
        via-[#fff5eb]
        to-white
        px-4
        py-8
        sm:px-6
      "
    >
      <div
        className="
          mx-auto
          max-w-6xl
        "
      >
        {/* Header */}

        <div
          className="
            mb-8
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.2em]
                text-orange-500
              "
            >
              Nithesh Cosmetics
            </p>

            <h1
              className="
                mt-2
                flex
                items-center
                gap-3
                text-3xl
                font-black
                tracking-tight
                text-gray-900
                sm:text-4xl
              "
            >
              <ShoppingBag
                size={35}
                className="text-orange-500"
              />

              Orders
            </h1>

            <p
              className="
                mt-2
                text-sm
                text-gray-500
              "
            >
              View customer orders and update
              delivery status.
            </p>
          </div>

          <button
            type="button"
            disabled={refreshing}
            onClick={() =>
              fetchOrders(true)
            }
            className="
              flex
              min-h-12
              items-center
              justify-center
              gap-2
              rounded-2xl
              border
              border-orange-100
              bg-white
              px-5
              py-3
              text-sm
              font-black
              text-orange-600
              shadow-sm
              transition-all
              hover:bg-orange-50
              active:scale-[0.98]
              disabled:opacity-60
            "
          >
            <RefreshCw
              size={17}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>
        </div>

        {/* Count */}

        <div
          className="
            mb-6
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-orange-100
            bg-white
            px-4
            py-2
            text-sm
            font-bold
            text-orange-600
            shadow-sm
          "
        >
          <Package size={16} />

          {orders.length}{" "}
          {orders.length === 1
            ? "Order"
            : "Orders"}
        </div>

        {/* Empty */}

        {orders.length === 0 && (
          <div
            className="
              rounded-[30px]
              border
              border-dashed
              border-gray-200
              bg-white
              p-12
              text-center
            "
          >
            <Package
              size={48}
              className="
                mx-auto
                text-gray-300
              "
            />

            <h2
              className="
                mt-4
                text-xl
                font-black
                text-gray-800
              "
            >
              No Orders Found
            </h2>

            <p
              className="
                mt-2
                text-sm
                text-gray-500
              "
            >
              Customer orders will appear here.
            </p>
          </div>
        )}

        {/* Orders */}

        <div className="space-y-6">
          {orders.map((order) => {
            const currentStatus =
              statusValues[order.id] ||
              order.status ||
              "Pending";

            return (
              <article
                key={order.id}
                className="
                  overflow-hidden
                  rounded-[30px]
                  border
                  border-gray-100
                  bg-white
                  shadow-[0_12px_40px_rgba(15,23,42,0.07)]
                "
              >
                {/* Order Header */}

                <div
                  className="
                    border-b
                    border-gray-100
                    bg-gradient-to-r
                    from-orange-50
                    via-white
                    to-white
                    p-5
                    sm:p-6
                  "
                >
                  <div
                    className="
                      flex
                      flex-col
                      gap-4
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                    "
                  >
                    <div>
                      <p
                        className="
                          text-[10px]
                          font-black
                          uppercase
                          tracking-[0.18em]
                          text-gray-400
                        "
                      >
                        Order ID
                      </p>

                      <p
                        className="
                          mt-1
                          break-all
                          text-sm
                          font-bold
                          text-gray-700
                        "
                      >
                        {order.id}
                      </p>
                    </div>

                    <span
                      className={`
                        w-fit
                        rounded-full
                        border
                        px-4
                        py-2
                        text-xs
                        font-black
                        ${getStatusStyle(
                          order.status
                        )}
                      `}
                    >
                      {order.status ||
                        "Pending"}
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  {/* Customer */}

                  <div
                    className="
                      grid
                      gap-4
                      md:grid-cols-3
                    "
                  >
                    <div
                      className="
                        rounded-2xl
                        bg-gray-50
                        p-4
                      "
                    >
                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          text-xs
                          font-bold
                          text-gray-500
                        "
                      >
                        <UserRound size={16} />

                        Customer
                      </div>

                      <p
                        className="
                          mt-2
                          font-black
                          text-gray-900
                        "
                      >
                        {order.customer_name ||
                          "Unknown Customer"}
                      </p>
                    </div>

                    <div
                      className="
                        rounded-2xl
                        bg-gray-50
                        p-4
                      "
                    >
                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          text-xs
                          font-bold
                          text-gray-500
                        "
                      >
                        <Phone size={16} />

                        Phone
                      </div>

                      {order.phone ? (
                        <a
                          href={`tel:${order.phone}`}
                          className="
                            mt-2
                            block
                            font-black
                            text-blue-600
                          "
                        >
                          {order.phone}
                        </a>
                      ) : (
                        <p
                          className="
                            mt-2
                            font-bold
                            text-gray-500
                          "
                        >
                          No Phone
                        </p>
                      )}
                    </div>

                    <div
                      className="
                        rounded-2xl
                        bg-gray-50
                        p-4
                      "
                    >
                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          text-xs
                          font-bold
                          text-gray-500
                        "
                      >
                        <MapPin size={16} />

                        Address
                      </div>

                      <p
                        className="
                          mt-2
                          text-sm
                          font-bold
                          leading-6
                          text-gray-800
                        "
                      >
                        {order.address ||
                          "No Address"}
                      </p>
                    </div>
                  </div>

                  {/* Products */}

                  <div className="mt-6">
                    <h3
                      className="
                        flex
                        items-center
                        gap-2
                        text-lg
                        font-black
                        text-gray-900
                      "
                    >
                      <Package
                        size={20}
                        className="text-orange-500"
                      />

                      Products
                    </h3>

                    <div
                      className="
                        mt-4
                        space-y-3
                      "
                    >
                      {order.products?.length ? (
                        order.products.map(
                          (item, index) => (
                            <div
                              key={`${order.id}-${index}`}
                              className="
                                flex
                                items-center
                                justify-between
                                gap-4
                                rounded-2xl
                                border
                                border-gray-100
                                bg-gray-50/70
                                p-4
                              "
                            >
                              <div className="min-w-0">
                                <p
                                  className="
                                    font-bold
                                    text-gray-900
                                  "
                                >
                                  {item.name}
                                </p>

                                <p
                                  className="
                                    mt-1
                                    text-xs
                                    text-gray-500
                                  "
                                >
                                  ₹
                                  {formatPrice(
                                    item.price
                                  )}{" "}
                                  ×{" "}
                                  {item.quantity}
                                </p>
                              </div>

                              <p
                                className="
                                  shrink-0
                                  font-black
                                  text-orange-600
                                "
                              >
                                ₹
                                {formatPrice(
                                  item.price *
                                    item.quantity
                                )}
                              </p>
                            </div>
                          )
                        )
                      ) : (
                        <div
                          className="
                            rounded-2xl
                            bg-gray-50
                            p-4
                            text-sm
                            text-gray-500
                          "
                        >
                          No products found
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Total */}

                  <div
                    className="
                      mt-6
                      flex
                      items-center
                      justify-between
                      rounded-2xl
                      bg-orange-50
                      p-5
                    "
                  >
                    <span
                      className="
                        text-sm
                        font-bold
                        text-gray-600
                      "
                    >
                      Order Total
                    </span>

                    <span
                      className="
                        text-2xl
                        font-black
                        text-orange-600
                      "
                    >
                      ₹
                      {formatPrice(
                        order.total
                      )}
                    </span>
                  </div>

                  {/* Update */}

                  <div
                    className="
                      mt-6
                      rounded-[24px]
                      border
                      border-gray-100
                      bg-gray-50/70
                      p-4
                      sm:p-5
                    "
                  >
                    <div
                      className="
                        mb-4
                        flex
                        items-center
                        gap-2
                      "
                    >
                      <Truck
                        size={20}
                        className="text-blue-600"
                      />

                      <h3
                        className="
                          font-black
                          text-gray-900
                        "
                      >
                        Update Delivery
                      </h3>
                    </div>

                    <div
                      className="
                        grid
                        gap-4
                        md:grid-cols-[1fr_1fr_auto]
                        md:items-end
                      "
                    >
                      {/* Status */}

                      <div>
                        <label
                          className="
                            mb-2
                            block
                            text-xs
                            font-bold
                            uppercase
                            tracking-wide
                            text-gray-500
                          "
                        >
                          Status
                        </label>

                        <select
                          value={
                            currentStatus
                          }
                          onChange={(e) =>
                            setStatusValues(
                              (current) => ({
                                ...current,

                                [order.id]:
                                  e.target
                                    .value,
                              })
                            )
                          }
                          className="
                            w-full
                            rounded-2xl
                            border
                            border-gray-200
                            bg-white
                            px-4
                            py-3.5
                            font-semibold
                            outline-none
                            focus:border-orange-400
                            focus:ring-4
                            focus:ring-orange-100
                          "
                        >
                          {STATUS_OPTIONS.map(
                            (status) => (
                              <option
                                key={status}
                                value={status}
                              >
                                {status}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      {/* Location */}

                      <div>
                        <label
                          className="
                            mb-2
                            block
                            text-xs
                            font-bold
                            uppercase
                            tracking-wide
                            text-gray-500
                          "
                        >
                          Delivery Location
                        </label>

                        <input
                          type="text"
                          value={
                            locationValues[
                              order.id
                            ] || ""
                          }
                          onChange={(e) =>
                            setLocationValues(
                              (current) => ({
                                ...current,

                                [order.id]:
                                  e.target
                                    .value,
                              })
                            )
                          }
                          placeholder="Example: Nagarkurnool"
                          className="
                            w-full
                            rounded-2xl
                            border
                            border-gray-200
                            bg-white
                            px-4
                            py-3.5
                            outline-none
                            focus:border-orange-400
                            focus:ring-4
                            focus:ring-orange-100
                          "
                        />
                      </div>

                      {/* Save */}

                      <button
                        type="button"
                        disabled={
                          savingId ===
                          order.id
                        }
                        onClick={() =>
                          updateOrder(
                            order.id
                          )
                        }
                        className="
                          flex
                          min-h-13
                          items-center
                          justify-center
                          gap-2
                          rounded-2xl
                          bg-gradient-to-r
                          from-orange-500
                          to-orange-600
                          px-6
                          py-3.5
                          font-black
                          text-white
                          shadow-[0_10px_25px_rgba(249,115,22,0.25)]
                          transition-all
                          hover:-translate-y-0.5
                          active:scale-[0.98]
                          disabled:pointer-events-none
                          disabled:opacity-60
                        "
                      >
                        {savingId ===
                        order.id ? (
                          <>
                            <Loader2
                              size={18}
                              className="animate-spin"
                            />

                            Saving...
                          </>
                        ) : (
                          <>
                            <Save
                              size={18}
                            />

                            Update
                          </>
                        )}
                      </button>
                    </div>

                    {order.status ===
                      "Delivered" && (
                      <div
                        className="
                          mt-4
                          flex
                          items-center
                          gap-2
                          rounded-2xl
                          bg-green-50
                          p-3
                          text-sm
                          font-bold
                          text-green-700
                        "
                      >
                        <CheckCircle2
                          size={18}
                        />

                        Order Delivered
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}