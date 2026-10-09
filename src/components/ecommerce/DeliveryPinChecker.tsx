"use client";

import React, { useState } from "react";
import { MapPin, CheckCircle, Truck } from "lucide-react";

export default function DeliveryPinChecker() {
  const [pincode, setPincode] = useState("");
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    city?: string;
  } | null>(null);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pincode.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      setResult({
        success: false,
        message: "Please enter a valid 6-digit Indian postal PIN code.",
      });
      return;
    }

    // Dynamic estimation based on region prefix
    let estimatedDays = "3-5 business days";
    let zone = "Metro / Express Hub";
    if (cleanPin.startsWith("45") || cleanPin.startsWith("46")) {
      estimatedDays = "1-2 business days (Madhya Pradesh Origin)";
      zone = "Local Central Hub";
    } else if (cleanPin.startsWith("11") || cleanPin.startsWith("40") || cleanPin.startsWith("56")) {
      estimatedDays = "2-3 business days (Priority Air)";
      zone = "Tier-1 Metro";
    }

    setResult({
      success: true,
      message: `Delivery to ${cleanPin} (${zone}): Expected in ${estimatedDays} via Blue Dart / Delhivery Express. COD Available.`,
    });
  };

  return (
    <div className="p-4 bg-white border border-[#E8E2D8] rounded-xs space-y-2.5">
      <div className="flex items-center gap-2 text-xs font-semibold text-charcoal-900">
        <MapPin className="w-4 h-4 text-[#86412D]" />
        <span>Check Delivery & COD Availability</span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <input
          type="text"
          maxLength={6}
          placeholder="Enter 6-digit PIN (e.g. 452001)"
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
          className="flex-1 px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D8] focus:outline-none focus:border-[#86412D]"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-charcoal-900 text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#86412D] transition-colors"
        >
          Check
        </button>
      </form>

      {result && (
        <div
          className={`flex items-start gap-2 p-2.5 text-xs rounded-2xs ${
            result.success
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {result.success ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <Truck className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          )}
          <span>{result.message}</span>
        </div>
      )}
    </div>
  );
}

