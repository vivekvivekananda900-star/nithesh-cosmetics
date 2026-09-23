"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Box,
  Check,
  Clock3,
  MapPin,
  Package,
  Phone,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  User,
} from "lucide-react";

import { supabase } from "@/app/lib/supabase";

type OrderProduct = {
  id?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type Order = {
  id: string;

  user_id?: string;

  customer_name?: string;
  customerName?: string;

  phone?: string;

  address?: string;

  total?: number;

  status?: string;
  Order_status?: string;

  location?: string;

  created_at?: string;

  products?: OrderProduct[];
};

const steps = [
  "Order Placed",
  "Confirmed",
  "Packed",
  "Out for Delivery",
  "Delivered",
];

export default function TrackOrderPage() {
  const router = useRouter();

  const [orderId, setOrderId] =
    useState("");

  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [userId, setUserId] =
    useState<string | null>(null);

  /* =========================
     LOAD USER
  ========================= */

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
        error,
      } =
        await supabase.auth.getUser();

      if (error || !user) {
        setUserId(null);
        return;
      }

      setUserId(user.id);
    }

    loadUser();
  }, []);

  /* =========================
     STATUS
  ========================= */

  const status = useMemo(() => {
    const raw =
      order?.status ||
      order?.Order_status ||
      "Pending";

    return normalizeStatus(raw);
  }, [order]);

  const currentStep =
    getCurrentStep(status);

  /* =========================
     FETCH ORDER
  ========================= */

  async function fetchOrder(
    id: string,
    silent = false
  ) {
    const cleanOrderId =
      id.trim();

    if (!cleanOrderId) {
      setError(
        "Please enter your Order ID."
      );

      setOrder(null);
      return;
    }

    try {
      if (!silent) {
        setLoading(true);
      }

      setError("");

      const {
        data: { user },
        error: userError,
      } =
        await supabase.auth.getUser();

      if (userError || !user) {
        setError(
          "Please login to track your order."
        );

        setOrder(null);
        return;
      }

      setUserId(user.id);

      const {
        data,
        error,
      } = await supabase
        .from("orders")
        .select("*")
        .eq("id", cleanOrderId)
        .eq(
          "user_id",
          user.id
        )
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        setOrder(null);

        setError(
          "Order not found. Please check your Order ID."
        );

        return;
      }

      setOrder(
        data as Order
      );
    } catch (error) {
      console.error(
        "Track order error:",
        error
      );

      setOrder(null);

      setError(
        "Unable to load this order. Please try again."
      );
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }

  function trackOrder() {
    fetchOrder(orderId);
  }

  /* =========================
     REALTIME
  ========================= */

  useEffect(() => {
    if (
      !order?.id ||
      !userId
    ) {
      return;
    }

    const channel =
      supabase
        .channel(
          `track-order-${order.id}`
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "orders",
            filter: `id=eq.${order.id}`,
          },
          async () => {
            await fetchOrder(
              order.id,
              true
            );
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, [order?.id, userId]);

  /* =========================
     FORMATTERS
  ========================= */

  function formatPrice(
    value: number
  ) {
    return Number(
      value || 0
    ).toLocaleString(
      "en-IN"
    );
  }

  function formatDate(
    value?: string
  ) {
    if (!value) {
      return "";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "";
    }

    return date.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-gradient-to-br
        from-[#fffaf5]
        via-[#fff7f0]
        to-white
        pb-28
      "
    >
      {/* Background */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            -left-40
            top-16
            h-96
            w-96
            rounded-full
            bg-orange-200/30
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -right-40
            top-[500px]
            h-96
            w-96
            rounded-full
            bg-rose-200/20
            blur-3xl
          "
        />
      </div>

      {/* =========================
          HEADER
      ========================= */}

      <header
        className="
          sticky
          top-0
          z-40
          border-b
          border-gray-100/80
          bg-white/90
          backdrop-blur-xl
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-5xl
            items-center
            gap-3
            px-4
            py-4
            sm:px-6
          "
        >
          <button
            type="button"
            onClick={() =>
              router.back()
            }
            aria-label="Go back"
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-2xl
              border
              border-gray-200
              bg-white
              text-gray-700
              shadow-sm
              transition-all
              hover:border-orange-200
              hover:bg-orange-50
              hover:text-orange-600
              active:scale-95
            "
          >
            <ArrowLeft
              size={21}
            />
          </button>

          <div>
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-orange-500
                sm:text-xs
              "
            >
              Nithesh
              Cosmetics
            </p>

            <h1
              className="
                text-xl
                font-black
                tracking-tight
                text-gray-900
                sm:text-2xl
              "
            >
              Track Your Order
            </h1>
          </div>

          <div
            className="
              ml-auto
              hidden
              items-center
              gap-2
              rounded-full
              bg-green-50
              px-3
              py-2
              text-xs
              font-bold
              text-green-700
              sm:flex
            "
          >
            <ShieldCheck
              size={15}
            />

            Secure Tracking
          </div>
        </div>
      </header>

      {/* =========================
          CONTENT
      ========================= */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-5xl
          px-3
          py-6
          sm:px-6
          sm:py-10
        "
      >
        {/* =========================
            SEARCH HERO
        ========================= */}

        <section
          className="
            relative
            overflow-hidden
            rounded-[30px]
            bg-gradient-to-br
            from-orange-500
            via-orange-500
            to-amber-400
            p-5
            text-white
            shadow-[0_22px_60px_rgba(249,115,22,0.28)]
            sm:p-8
          "
        >
          {/* Decoration */}

          <div
            className="
              pointer-events-none
              absolute
              -right-16
              -top-16
              h-52
              w-52
              rounded-full
              bg-white/10
              blur-xl
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-24
              -left-10
              h-56
              w-56
              rounded-full
              bg-yellow-200/15
              blur-2xl
            "
          />

          <div
            className="
              relative
              z-10
              mx-auto
              max-w-2xl
              text-center
            "
          >
            <div
              className="
                mx-auto
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-white/20
                bg-white/10
                px-4
                py-2
                text-[10px]
                font-black
                uppercase
                tracking-[0.17em]
                backdrop-blur-md
                sm:text-xs
              "
            >
              <Sparkles
                size={13}
              />

              Live Order
              Tracking
            </div>

            <div
              className="
                mx-auto
                mt-6
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-[24px]
                border
                border-white/20
                bg-white/15
                backdrop-blur-xl
                sm:h-24
                sm:w-24
                sm:rounded-[28px]
              "
            >
              <Truck
                size={38}
              />
            </div>

            <h2
              className="
                mt-5
                text-2xl
                font-black
                tracking-tight
                sm:text-4xl
              "
            >
              Where is your
              order?
            </h2>

            <p
              className="
                mx-auto
                mt-2
                max-w-md
                text-sm
                leading-6
                text-white/85
                sm:text-base
              "
            >
              Enter your Order
              ID to check the
              latest delivery
              status in real
              time.
            </p>

            {/* Search */}

            <div
              className="
                mt-7
                rounded-[22px]
                border
                border-white/20
                bg-white/15
                p-2
                backdrop-blur-xl
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-2
                  sm:flex-row
                "
              >
                <div
                  className="
                    relative
                    min-w-0
                    flex-1
                  "
                >
                  <Search
                    size={19}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <input
                    type="text"
                    placeholder="Enter your Order ID"
                    value={
                      orderId
                    }
                    onChange={(
                      e
                    ) => {
                      setOrderId(
                        e.target
                          .value
                      );

                      if (
                        error
                      ) {
                        setError(
                          ""
                        );
                      }
                    }}
                    onKeyDown={(
                      e
                    ) => {
                      if (
                        e.key ===
                        "Enter"
                      ) {
                        trackOrder();
                      }
                    }}
                    className="
                      min-h-14
                      w-full
                      rounded-2xl
                      border
                      border-white/30
                      bg-white
                      py-3
                      pl-12
                      pr-4
                      text-sm
                      font-semibold
                      text-gray-900
                      outline-none
                      transition-all
                      placeholder:font-normal
                      placeholder:text-gray-400
                      focus:ring-4
                      focus:ring-white/20
                      sm:text-base
                    "
                  />
                </div>

                <button
                  type="button"
                  onClick={
                    trackOrder
                  }
                  disabled={
                    loading
                  }
                  className="
                    group
                    flex
                    min-h-14
                    shrink-0
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    bg-gray-950
                    px-7
                    font-black
                    text-white
                    shadow-lg
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-black
                    active:scale-95
                    disabled:pointer-events-none
                    disabled:opacity-70
                  "
                >
                  {loading ? (
                    <>
                      <span
                        className="
                          h-5
                          w-5
                          animate-spin
                          rounded-full
                          border-2
                          border-white/40
                          border-t-white
                        "
                      />

                      Tracking...
                    </>
                  ) : (
                    <>
                      <Search
                        size={18}
                      />

                      Track Order
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div
                  className="
                    mt-4
                    rounded-2xl
                    border
                    border-red-200/30
                    bg-red-950/20
                    px-4
                    py-3
                    text-sm
                    font-bold
                    text-white
                    backdrop-blur-md
                  "
                >
                  {error}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =========================
            RESULT
        ========================= */}

        {order && (
          <div
            className="
              mt-6
              grid
              gap-5
              lg:grid-cols-[1fr_360px]
            "
          >
            {/* LEFT */}

            <div className="space-y-5">
              {/* Progress */}

              <section
                className="
                  overflow-hidden
                  rounded-[30px]
                  border
                  border-gray-100
                  bg-white
                  shadow-[0_14px_45px_rgba(15,23,42,0.07)]
                "
              >
                {/* Order Header */}

                <div
                  className="
                    border-b
                    border-gray-100
                    bg-gradient-to-r
                    from-orange-50
                    to-white
                    p-5
                    sm:p-6
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3
                    "
                  >
                    <div
                      className="
                        flex
                        min-w-0
                        items-center
                        gap-3
                      "
                    >
                      <div
                        className="
                          flex
                          h-12
                          w-12
                          shrink-0
                          items-center
                          justify-center
                          rounded-2xl
                          bg-white
                          text-orange-600
                          shadow-sm
                        "
                      >
                        <Box
                          size={
                            21
                          }
                        />
                      </div>

                      <div className="min-w-0">
                        <p
                          className="
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.14em]
                            text-gray-400
                          "
                        >
                          Order ID
                        </p>

                        <p
                          className="
                            mt-0.5
                            truncate
                            text-sm
                            font-black
                            text-gray-900
                            sm:text-base
                          "
                        >
                          #
                          {
                            order.id
                          }
                        </p>

                        {order.created_at && (
                          <p
                            className="
                              mt-1
                              text-[10px]
                              text-gray-400
                              sm:text-xs
                            "
                          >
                            {formatDate(
                              order.created_at
                            )}
                          </p>
                        )}
                      </div>
                    </div>

                    <div
                      className="
                        flex
                        shrink-0
                        items-center
                        gap-1.5
                        rounded-full
                        border
                        border-orange-100
                        bg-orange-50
                        px-3
                        py-1.5
                        text-[10px]
                        font-black
                        text-orange-700
                        sm:text-xs
                      "
                    >
                      <Truck
                        size={
                          14
                        }
                      />

                      {status}
                    </div>
                  </div>
                </div>

                {/* Progress Steps */}

                <div className="p-5 sm:p-6">
                  <div
                    className="
                      mb-6
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <div
                      className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-2xl
                        bg-green-50
                        text-green-600
                      "
                    >
                      <Truck
                        size={
                          20
                        }
                      />
                    </div>

                    <div>
                      <h3
                        className="
                          text-lg
                          font-black
                          text-gray-900
                        "
                      >
                        Delivery
                        Progress
                      </h3>

                      <p
                        className="
                          text-xs
                          text-gray-500
                        "
                      >
                        Status
                        updates
                        automatically
                      </p>
                    </div>
                  </div>

                  <div>
                    {steps.map(
                      (
                        step,
                        index
                      ) => {
                        const completed =
                          index <=
                          currentStep;

                        const active =
                          index ===
                          currentStep;

                        return (
                          <div
                            key={
                              step
                            }
                            className="
                              flex
                              gap-4
                            "
                          >
                            <div
                              className="
                                flex
                                flex-col
                                items-center
                              "
                            >
                              <div
                                className={`
                                  flex
                                  h-10
                                  w-10
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-full
                                  border-4
                                  transition-all
                                  duration-500

                                  ${
                                    active
                                      ? "border-orange-100 bg-orange-500 text-white shadow-[0_0_0_5px_rgba(249,115,22,0.08)]"
                                      : completed
                                      ? "border-green-100 bg-green-500 text-white"
                                      : "border-gray-100 bg-gray-200 text-gray-400"
                                  }
                                `}
                              >
                                {completed ? (
                                  <Check
                                    size={
                                      17
                                    }
                                    strokeWidth={
                                      3
                                    }
                                  />
                                ) : (
                                  <Clock3
                                    size={
                                      16
                                    }
                                  />
                                )}
                              </div>

                              {index !==
                                steps.length -
                                  1 && (
                                <div
                                  className={`
                                    my-1
                                    h-14
                                    w-1
                                    rounded-full

                                    ${
                                      index <
                                      currentStep
                                        ? "bg-green-500"
                                        : "bg-gray-200"
                                    }
                                  `}
                                />
                              )}
                            </div>

                            <div
                              className="
                                pb-7
                                pt-1
                              "
                            >
                              <p
                                className={`
                                  text-base
                                  font-black

                                  ${
                                    active
                                      ? "text-orange-600"
                                      : completed
                                      ? "text-gray-900"
                                      : "text-gray-400"
                                  }
                                `}
                              >
                                {
                                  step
                                }
                              </p>

                              <p
                                className={`
                                  mt-1
                                  text-xs
                                  font-semibold

                                  ${
                                    active
                                      ? "text-orange-500"
                                      : completed
                                      ? "text-green-600"
                                      : "text-gray-400"
                                  }
                                `}
                              >
                                {active
                                  ? "Current status"
                                  : completed
                                  ? "Completed"
                                  : "Waiting..."}
                              </p>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </section>

              {/* Products */}

              <section
                className="
                  rounded-[30px]
                  border
                  border-gray-100
                  bg-white
                  p-5
                  shadow-[0_14px_45px_rgba(15,23,42,0.07)]
                  sm:p-6
                "
              >
                <div
                  className="
                    mb-5
                    flex
                    items-center
                    gap-3
                  "
                >
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-2xl
                      bg-blue-50
                      text-blue-600
                    "
                  >
                    <ShoppingBag
                      size={20}
                    />
                  </div>

                  <div>
                    <h3
                      className="
                        text-lg
                        font-black
                        text-gray-900
                      "
                    >
                      Ordered
                      Products
                    </h3>

                    <p
                      className="
                        text-xs
                        text-gray-500
                      "
                    >
                      {order
                        .products
                        ?.length ||
                        0}{" "}
                      items
                    </p>
                  </div>
                </div>

                {order.products &&
                order.products
                  .length >
                  0 ? (
                  <div className="space-y-3">
                    {order.products.map(
                      (
                        item,
                        index
                      ) => (
                        <div
                          key={
                            item.id ||
                            `${item.name}-${index}`
                          }
                          className="
                            flex
                            items-center
                            gap-3
                            rounded-2xl
                            bg-gray-50
                            p-3
                          "
                        >
                          <div
                            className="
                              flex
                              h-16
                              w-16
                              shrink-0
                              items-center
                              justify-center
                              overflow-hidden
                              rounded-2xl
                              bg-white
                            "
                          >
                            {item.image ? (
                              <img
                                src={
                                  item.image
                                }
                                alt={
                                  item.name
                                }
                                className="
                                  h-full
                                  w-full
                                  object-contain
                                  p-1.5
                                "
                              />
                            ) : (
                              <Package
                                size={
                                  25
                                }
                                className="
                                  text-gray-300
                                "
                              />
                            )}
                          </div>

                          <div
                            className="
                              min-w-0
                              flex-1
                            "
                          >
                            <p
                              className="
                                line-clamp-2
                                text-sm
                                font-bold
                                text-gray-900
                              "
                            >
                              {
                                item.name
                              }
                            </p>

                            <p
                              className="
                                mt-1
                                text-xs
                                text-gray-500
                              "
                            >
                              Qty:{" "}
                              {
                                item.quantity
                              }
                            </p>
                          </div>

                          <p
                            className="
                              shrink-0
                              text-sm
                              font-black
                              text-orange-600
                            "
                          >
                            ₹
                            {formatPrice(
                              Number(
                                item.price ||
                                  0
                              ) *
                                Number(
                                  item.quantity ||
                                    0
                                )
                            )}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div
                    className="
                      rounded-2xl
                      bg-gray-50
                      p-5
                      text-center
                      text-sm
                      text-gray-500
                    "
                  >
                    Product
                    information
                    unavailable.
                  </div>
                )}
              </section>
            </div>

            {/* =========================
                RIGHT
            ========================= */}

            <aside
              className="
                space-y-5
                lg:sticky
                lg:top-28
                lg:h-fit
              "
            >
              {/* Order Info */}

              <section
                className="
                  rounded-[30px]
                  border
                  border-gray-100
                  bg-white
                  p-5
                  shadow-[0_14px_45px_rgba(15,23,42,0.07)]
                "
              >
                <div
                  className="
                    mb-5
                    flex
                    items-center
                    gap-3
                  "
                >
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-2xl
                      bg-orange-50
                      text-orange-600
                    "
                  >
                    <User
                      size={20}
                    />
                  </div>

                  <div>
                    <h3 className="font-black text-gray-900">
                      Order Details
                    </h3>

                    <p className="text-xs text-gray-500">
                      Delivery
                      information
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Customer */}

                  <div
                    className="
                      rounded-2xl
                      bg-gray-50
                      p-4
                    "
                  >
                    <p
                      className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-wide
                        text-gray-400
                      "
                    >
                      Customer
                    </p>

                    <p
                      className="
                        mt-1
                        text-sm
                        font-black
                        text-gray-900
                      "
                    >
                      {order.customer_name ||
                        order.customerName ||
                        "Customer"}
                    </p>
                  </div>

                  {/* Phone */}

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-2xl
                      bg-gray-50
                      p-4
                    "
                  >
                    <Phone
                      size={17}
                      className="
                        shrink-0
                        text-green-600
                      "
                    />

                    <p
                      className="
                        text-sm
                        font-semibold
                        text-gray-700
                      "
                    >
                      {order.phone ||
                        "Not available"}
                    </p>
                  </div>

                  {/* Address */}

                  <div
                    className="
                      flex
                      items-start
                      gap-3
                      rounded-2xl
                      bg-gray-50
                      p-4
                    "
                  >
                    <MapPin
                      size={17}
                      className="
                        mt-0.5
                        shrink-0
                        text-orange-600
                      "
                    />

                    <p
                      className="
                        break-words
                        text-sm
                        leading-6
                        text-gray-700
                      "
                    >
                      {order.address ||
                        "Address not available"}
                    </p>
                  </div>
                </div>

                {/* Total */}

                <div
                  className="
                    mt-5
                    border-t
                    border-gray-100
                    pt-5
                  "
                >
                  <div
                    className="
                      flex
                      items-end
                      justify-between
                    "
                  >
                    <div>
                      <p className="text-xs font-bold text-gray-500">
                        Order Total
                      </p>

                      <p className="mt-1 text-[10px] text-gray-400">
                        Final amount
                      </p>
                    </div>

                    <p
                      className="
                        text-2xl
                        font-black
                        tracking-tight
                        text-orange-600
                      "
                    >
                      ₹
                      {formatPrice(
                        order.total ||
                          0
                      )}
                    </p>
                  </div>
                </div>
              </section>

              {/* Location */}

              <section
                className="
                  rounded-[30px]
                  border
                  border-blue-100
                  bg-gradient-to-br
                  from-blue-50
                  to-white
                  p-5
                  shadow-[0_12px_35px_rgba(59,130,246,0.08)]
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-2xl
                      bg-white
                      text-blue-600
                      shadow-sm
                    "
                  >
                    <MapPin
                      size={20}
                    />
                  </div>

                  <div>
                    <h3 className="font-black text-gray-900">
                      Current
                      Location
                    </h3>

                    <p className="text-xs text-gray-500">
                      Delivery
                      location
                      update
                    </p>
                  </div>
                </div>

                <div
                  className="
                    mt-4
                    rounded-2xl
                    bg-white
                    p-4
                    text-sm
                    font-semibold
                    leading-6
                    text-gray-700
                    shadow-sm
                  "
                >
                  {order.location ||
                    "Location not updated yet"}
                </div>
              </section>

              {/* Live indicator */}

              <div
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  border
                  border-green-100
                  bg-green-50
                  px-4
                  py-3
                  text-xs
                  font-bold
                  text-green-700
                "
              >
                <span
                  className="
                    h-2.5
                    w-2.5
                    animate-pulse
                    rounded-full
                    bg-green-500
                  "
                />

                Live order
                updates enabled
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

/* =========================
   STATUS HELPERS
========================= */

function normalizeStatus(
  value: string
) {
  const status =
    value
      .trim()
      .toLowerCase()
      .replace(
        /[-_]+/g,
        " "
      );

  if (
    status ===
      "processing" ||
    status ===
      "confirmed" ||
    status ===
      "order confirmed"
  ) {
    return "Confirmed";
  }

  if (
    status ===
      "packed" ||
    status ===
      "ready"
  ) {
    return "Packed";
  }

  if (
    status ===
      "out for delivery" ||
    status ===
      "out for delivery " ||
    status ===
      "on the way" ||
    status ===
      "shipped"
  ) {
    return "Out for Delivery";
  }

  if (
    status ===
    "delivered"
  ) {
    return "Delivered";
  }

  if (
    status ===
      "pending" ||
    status ===
      "placed" ||
    status ===
      "order placed"
  ) {
    return "Order Placed";
  }

  if (
    status ===
    "cancelled"
  ) {
    return "Cancelled";
  }

  return value;
}

function getCurrentStep(
  status: string
) {
  const normalized =
    status.toLowerCase();

  if (
    normalized.includes(
      "delivered"
    )
  ) {
    return 4;
  }

  if (
    normalized.includes(
      "out for delivery"
    ) ||
    normalized.includes(
      "on the way"
    ) ||
    normalized.includes(
      "shipped"
    )
  ) {
    return 3;
  }

  if (
    normalized.includes(
      "packed"
    )
  ) {
    return 2;
  }

  if (
    normalized.includes(
      "confirmed"
    ) ||
    normalized.includes(
      "processing"
    )
  ) {
    return 1;
  }

  return 0;
}