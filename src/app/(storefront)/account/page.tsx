"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/store/cartContext";
import {
  User,
  Package,
  Heart,
  MapPin,
  Lock,
  Mail,
  Phone,
  ArrowRight,
  LogOut,
  CheckCircle,
  Truck,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const { wishlist } = useCart();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [authMode, setAuthMode] = useState<"login" | "register" | "otp">("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    otp: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active account tab when logged in
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "addresses">("overview");

  // Fetch current session on load
  useEffect(() => {
    fetchSession();
  }, []);

  const fetchSession = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (res.ok && data.authenticated) {
        setCurrentUser(data.user);
      } else {
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 1. Password / Register Submit
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      const endpoint = authMode === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload =
        authMode === "login"
          ? { email: formData.email, password: formData.password }
          : {
              name: formData.name,
              email: formData.email,
              password: formData.password,
              phone: formData.phone,
            };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      setSuccessMsg(authMode === "login" ? "Welcome back!" : "Account created successfully!");
      await fetchSession();
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. OTP flow
  const handleSendOtp = () => {
    if (!formData.phone && !formData.email) {
      setErrorMsg("Please enter your mobile number or email address.");
      return;
    }
    setOtpSent(true);
    setErrorMsg(null);
    setSuccessMsg("Verification code sent! For instant testing, use OTP: 123456");
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.otp !== "123456") {
      setErrorMsg("Invalid OTP. Please enter 123456.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Auto register/login with OTP
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email || `user_${Date.now()}@vaishiri.com`,
          name: formData.name || "Vaishiri Member",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "OTP verification failed.");

      await fetchSession();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to verify OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Login with Google
  const handleGoogleAuth = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "priya.sharma@gmail.com",
          name: "Priya Sharma",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Google authentication failed.");

      setSuccessMsg("Signed in with Google successfully!");
      await fetchSession();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to authenticate with Google.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Quick Demo Login as Priya Sharma
  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "priya@example.com",
          password: "customer123",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Demo login failed.");

      await fetchSession();
    } catch (err: any) {
      setErrorMsg(err.message || "Demo login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setCurrentUser(null);
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="pt-36 pb-24 max-w-md mx-auto px-4 text-center font-sans">
        <div className="w-8 h-8 border-2 border-[#86412D] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-charcoal-500 uppercase tracking-wider">Loading your profile...</p>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STATE A: USER IS LOGGED IN
  // -------------------------------------------------------------
  if (currentUser) {
    return (
      <div className="pt-32 pb-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
        {/* Top Header */}
        <div className="pb-8 border-b border-[#E8E2D8] mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-wider text-[#86412D] font-bold">
                Vaishiri Privileged Member
              </span>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] rounded-2xs font-medium">
                Verified Account
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-950 font-normal">
              Welcome, {currentUser.name}
            </h1>
            <p className="text-xs text-charcoal-500 mt-1">
              {currentUser.email} {currentUser.phone && `• ${currentUser.phone}`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              className="px-5 py-2.5 bg-[#86412D] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#6B3323] transition-colors"
            >
              Shop Collection
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 border border-[#E8E2D8] text-charcoal-700 hover:text-red-700 hover:border-red-300 text-xs uppercase tracking-wider font-medium transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-4 border-b border-[#E8E2D8] mb-8 text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 transition-colors relative ${
              activeTab === "overview"
                ? "text-[#86412D] border-b-2 border-[#86412D]"
                : "text-charcoal-500 hover:text-charcoal-900"
            }`}
          >
            Dashboard Overview
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 transition-colors relative ${
              activeTab === "orders"
                ? "text-[#86412D] border-b-2 border-[#86412D]"
                : "text-charcoal-500 hover:text-charcoal-900"
            }`}
          >
            Orders & Tracking ({currentUser.orders?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("addresses")}
            className={`pb-3 transition-colors relative ${
              activeTab === "addresses"
                ? "text-[#86412D] border-b-2 border-[#86412D]"
                : "text-charcoal-500 hover:text-charcoal-900"
            }`}
          >
            Delivery Addresses ({currentUser.addresses?.length || 0})
          </button>
        </div>

        {/* Tab 1: Overview Cards */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                onClick={() => setActiveTab("orders")}
                className="p-6 bg-[#FAF7F2] border border-[#E8E2D8] hover:border-[#86412D] transition-colors flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <Package className="w-6 h-6 text-[#86412D] mb-3" />
                  <h3 className="font-serif text-xl text-charcoal-900 group-hover:text-[#86412D] transition-colors">
                    Orders & Shipments
                  </h3>
                  <p className="text-xs text-charcoal-500 mt-1 leading-relaxed">
                    Track live deliveries across India via Blue Dart & Delhivery Express.
                  </p>
                </div>
                <span className="text-xs text-[#86412D] font-bold uppercase tracking-wider mt-6 flex items-center gap-1">
                  View Orders <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>

              <Link
                href="/account/wishlist"
                className="p-6 bg-[#FAF7F2] border border-[#E8E2D8] hover:border-[#86412D] transition-colors flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Heart className="w-6 h-6 text-[#86412D]" />
                    {wishlist.length > 0 && (
                      <span className="px-2 py-0.5 bg-[#86412D] text-white text-[10px] font-bold rounded-full">
                        {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-xl text-charcoal-900 group-hover:text-[#86412D] transition-colors">
                    Saved Wishlist
                  </h3>
                  <p className="text-xs text-charcoal-500 mt-1 leading-relaxed">
                    Your favorite handcrafted batik suits, sarees, and bedsheets.
                  </p>
                </div>
                <span className="text-xs text-[#86412D] font-bold uppercase tracking-wider mt-6 flex items-center gap-1">
                  View Wishlist <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              <div
                onClick={() => setActiveTab("addresses")}
                className="p-6 bg-[#FAF7F2] border border-[#E8E2D8] hover:border-[#86412D] transition-colors flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <MapPin className="w-6 h-6 text-[#86412D] mb-3" />
                  <h3 className="font-serif text-xl text-charcoal-900 group-hover:text-[#86412D] transition-colors">
                    Saved Addresses
                  </h3>
                  <p className="text-xs text-charcoal-500 mt-1 leading-relaxed">
                    Default shipping destinations for speedy 1-click checkout.
                  </p>
                </div>
                <span className="text-xs text-[#86412D] font-bold uppercase tracking-wider mt-6 flex items-center gap-1">
                  Manage Addresses <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-white border border-[#E8E2D8] p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
                <h3 className="font-serif text-lg text-charcoal-950 font-normal">
                  Recent Orders
                </h3>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-xs text-[#86412D] font-semibold hover:underline"
                >
                  View All
                </button>
              </div>

              {currentUser.orders && currentUser.orders.length > 0 ? (
                <div className="divide-y divide-[#E8E2D8]">
                  {currentUser.orders.slice(0, 3).map((ord: any) => (
                    <div key={ord.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-charcoal-950 text-sm font-serif">{ord.orderNumber}</span>
                          <span className="px-2 py-0.5 bg-[#FAF7F2] border border-[#E8E2D8] text-charcoal-700 text-[10px] uppercase font-bold">
                            {ord.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-charcoal-500 mt-0.5">
                          {ord.items?.length || 1} item(s) • Total: {formatPrice(ord.grandTotal)}
                        </p>
                      </div>
                      <Link
                        href={`/order-confirmation/${ord.orderNumber}`}
                        className="text-xs text-[#86412D] hover:underline font-semibold flex items-center gap-1 w-fit"
                      >
                        <span>View Invoice & Tracking</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-charcoal-500 py-4 font-light">
                  No orders placed yet. Explore our handcrafted collection to make your first purchase!
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Orders List */}
        {activeTab === "orders" && (
          <div className="bg-white border border-[#E8E2D8] p-6 space-y-4">
            <h3 className="font-serif text-xl text-charcoal-950 font-normal pb-3 border-b border-[#E8E2D8]">
              Your Order History
            </h3>

            {currentUser.orders && currentUser.orders.length > 0 ? (
              <div className="divide-y divide-[#E8E2D8]">
                {currentUser.orders.map((ord: any) => (
                  <div key={ord.id} className="py-5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-serif text-base font-semibold text-charcoal-950 block">
                          Order #{ord.orderNumber}
                        </span>
                        <span className="text-[11px] text-charcoal-500">
                          Placed on {new Date(ord.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs uppercase font-bold rounded-2xs">
                          {ord.status}
                        </span>
                        <span className="text-sm font-bold text-charcoal-950">
                          {formatPrice(ord.grandTotal)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-charcoal-600">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-[#86412D]" />
                        <span>Courier: Blue Dart / Delhivery Express</span>
                      </div>
                      <Link
                        href={`/order-confirmation/${ord.orderNumber}`}
                        className="px-4 py-2 bg-charcoal-900 text-white hover:bg-[#86412D] text-xs uppercase tracking-wider font-semibold transition-colors"
                      >
                        Track Shipment & Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-charcoal-500">
                <Package className="w-8 h-8 text-charcoal-400 mx-auto mb-2" />
                <p className="text-xs">You have not placed any orders yet.</p>
                <Link
                  href="/shop"
                  className="mt-4 inline-block px-5 py-2.5 bg-[#86412D] text-white text-xs uppercase tracking-wider font-bold"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Saved Addresses */}
        {activeTab === "addresses" && (
          <div className="bg-white border border-[#E8E2D8] p-6 space-y-4">
            <h3 className="font-serif text-xl text-charcoal-950 font-normal pb-3 border-b border-[#E8E2D8]">
              Saved Delivery Addresses
            </h3>

            {currentUser.addresses && currentUser.addresses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentUser.addresses.map((addr: any) => (
                  <div key={addr.id} className="p-4 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xs space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-charcoal-900 text-sm">{addr.fullName}</span>
                      {addr.isDefaultShipping && (
                        <span className="text-[10px] text-[#86412D] font-bold uppercase tracking-wider">
                          Default Address
                        </span>
                      )}
                    </div>
                    <p className="text-charcoal-600">{addr.addressLine1}</p>
                    {addr.addressLine2 && <p className="text-charcoal-600">{addr.addressLine2}</p>}
                    <p className="text-charcoal-600">
                      {addr.city}, {addr.state} - {addr.postalCode}
                    </p>
                    <p className="text-charcoal-500 pt-1">Phone: {addr.phone}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-charcoal-500 py-4 font-light">
                No saved addresses yet. Addresses used at checkout will be saved here automatically.
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // STATE B: USER IS NOT LOGGED IN -> AUTHENTICATION PORTAL
  // -------------------------------------------------------------
  return (
    <div className="pt-32 pb-24 max-w-md mx-auto px-4 sm:px-6 font-sans">
      <div className="text-center mb-8">
        <span className="text-[10px] uppercase tracking-wider text-[#86412D] font-bold block mb-1">
          Vaishiri Client Access
        </span>
        <h1 className="font-serif text-3xl text-charcoal-950 font-normal">
          {authMode === "login"
            ? "Sign in to Your Account"
            : authMode === "register"
            ? "Create an Account"
            : "OTP Mobile Login"}
        </h1>
        <p className="text-xs text-charcoal-500 mt-2 font-light">
          Enjoy express checkout, order tracking, and exclusive discounts.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-3 border border-[#E8E2D8] p-1 bg-[#FAF7F2] mb-6 text-xs font-semibold text-center">
        <button
          type="button"
          onClick={() => {
            setAuthMode("login");
            setErrorMsg(null);
            setSuccessMsg(null);
          }}
          className={`py-2 transition-colors ${
            authMode === "login" ? "bg-white text-charcoal-950 shadow-xs" : "text-charcoal-500 hover:text-charcoal-900"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setAuthMode("register");
            setErrorMsg(null);
            setSuccessMsg(null);
          }}
          className={`py-2 transition-colors ${
            authMode === "register" ? "bg-white text-charcoal-950 shadow-xs" : "text-charcoal-500 hover:text-charcoal-900"
          }`}
        >
          Register
        </button>
        <button
          type="button"
          onClick={() => {
            setAuthMode("otp");
            setErrorMsg(null);
            setSuccessMsg(null);
          }}
          className={`py-2 transition-colors ${
            authMode === "otp" ? "bg-white text-charcoal-950 shadow-xs" : "text-charcoal-500 hover:text-charcoal-900"
          }`}
        >
          OTP Login
        </button>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="p-3 mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xs flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Google OAuth Login Button */}
      <button
        type="button"
        onClick={handleGoogleAuth}
        disabled={isSubmitting}
        className="w-full py-3 px-4 bg-white border border-[#E8E2D8] hover:bg-[#FAF7F2] text-charcoal-800 text-xs font-medium flex items-center justify-center gap-2.5 shadow-2xs transition-colors mb-4"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.26v3.13C3.26 21.36 7.36 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.26c-.25-.72-.38-1.49-.38-2.26s.13-1.54.38-2.26V6.61H1.26C.46 8.21 0 10.05 0 12s.46 3.79 1.26 5.39l4.02-3.13z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.26 6.61l4.02 3.13c.95-2.84 3.6-4.99 6.72-4.99z"
          />
        </svg>
        <span>Continue with Google</span>
      </button>

      <div className="relative flex items-center justify-center my-5">
        <div className="border-t border-[#E8E2D8] w-full" />
        <span className="bg-white px-3 text-[10px] text-charcoal-400 uppercase tracking-widest absolute">
          or use credentials
        </span>
      </div>

      {/* Forms based on AuthMode */}
      {authMode === "otp" ? (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <label className="text-[11px] uppercase tracking-wider text-charcoal-600 block mb-1">
              Mobile Number / Email
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                name="phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleInputChange}
                className="flex-1 px-3 py-2.5 bg-[#FAF7F2] border border-[#E8E2D8] text-xs focus:outline-none focus:border-[#86412D]"
              />
              <button
                type="button"
                onClick={handleSendOtp}
                className="px-3 py-2.5 bg-charcoal-900 text-white text-xs font-semibold hover:bg-[#86412D] transition-colors whitespace-nowrap"
              >
                Send OTP
              </button>
            </div>
          </div>

          {otpSent && (
            <div>
              <label className="text-[11px] uppercase tracking-wider text-charcoal-600 block mb-1">
                Enter 6-digit OTP
              </label>
              <input
                type="text"
                maxLength={6}
                required
                name="otp"
                placeholder="123456"
                value={formData.otp}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#E8E2D8] text-xs tracking-widest text-center font-bold text-charcoal-950 focus:outline-none focus:border-[#86412D]"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !otpSent}
            className="w-full py-3.5 bg-[#86412D] text-white text-xs uppercase tracking-wider font-bold hover:bg-[#6B3323] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Verifying..." : "Verify & Sign In"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {authMode === "register" && (
            <div>
              <label className="text-[11px] uppercase tracking-wider text-charcoal-600 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                name="name"
                placeholder="Priya Sharma"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#E8E2D8] text-xs focus:outline-none focus:border-[#86412D]"
              />
            </div>
          )}

          <div>
            <label className="text-[11px] uppercase tracking-wider text-charcoal-600 block mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              name="email"
              placeholder="priya@example.com"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#E8E2D8] text-xs focus:outline-none focus:border-[#86412D]"
            />
          </div>

          {authMode === "register" && (
            <div>
              <label className="text-[11px] uppercase tracking-wider text-charcoal-600 block mb-1">
                Phone Number (For Delivery SMS)
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#E8E2D8] text-xs focus:outline-none focus:border-[#86412D]"
              />
            </div>
          )}

          <div>
            <label className="text-[11px] uppercase tracking-wider text-charcoal-600 block mb-1">
              Password
            </label>
            <input
              type="password"
              required
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#E8E2D8] text-xs focus:outline-none focus:border-[#86412D]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#86412D] text-white text-xs uppercase tracking-wider font-bold hover:bg-[#6B3323] transition-colors disabled:opacity-50"
          >
            {isSubmitting
              ? "Authenticating..."
              : authMode === "login"
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>
      )}

      {/* Demo Credentials Helper */}
      <div className="mt-8 p-4 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xs space-y-2 text-xs">
        <span className="font-semibold text-charcoal-900 block">
          One-Click Demo Customer Account:
        </span>
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={isSubmitting}
          className="w-full py-2 bg-charcoal-900 text-white text-[11px] uppercase tracking-wider font-medium hover:bg-[#86412D] transition-colors"
        >
          Sign In as Priya Sharma (Demo)
        </button>
        <p className="text-[10px] text-charcoal-500 text-center font-light">
          Email: priya@example.com • Password: customer123
        </p>
      </div>
    </div>
  );
}
