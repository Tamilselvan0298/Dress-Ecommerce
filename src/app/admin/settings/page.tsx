import React from "react";
import { Settings, ShieldCheck, CheckCircle } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 font-sans max-w-4xl mx-auto">
      <div className="pb-6 border-b border-border">
        <span className="text-[10px] tracking-luxury uppercase text-gold-600 font-semibold block mb-1">
          Maison Governance & Configuration
        </span>
        <h1 className="font-serif text-3xl text-charcoal-950 font-normal">
          Atelier System Settings
        </h1>
      </div>

      <div className="bg-surface p-6 sm:p-8 border border-border space-y-6">
        <div>
          <h2 className="font-serif text-lg text-charcoal-950 mb-3 pb-2 border-b border-border">
            1. Brand Metadata
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-charcoal-500 block mb-1">Brand Name</span>
              <input
                type="text"
                readOnly
                value="VAISHIRI CLOTHING"
                className="w-full px-3 py-2 bg-ivory-100 border border-border text-charcoal-800"
              />
            </div>
            <div>
              <span className="text-charcoal-500 block mb-1">Default Base Currency</span>
              <input
                type="text"
                readOnly
                value="INR (₹ Indian Rupee)"
                className="w-full px-3 py-2 bg-ivory-100 border border-border text-charcoal-800"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-serif text-lg text-charcoal-950 mb-3 pb-2 border-b border-border">
            2. Taxation & Logistics Rules
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-charcoal-500 block mb-1">Textile GST Calculation Rate</span>
              <input
                type="text"
                readOnly
                value="5.0% Standard Luxury Handloom GST"
                className="w-full px-3 py-2 bg-ivory-100 border border-border text-charcoal-800"
              />
            </div>
            <div>
              <span className="text-charcoal-500 block mb-1">Complimentary Shipping Threshold</span>
              <input
                type="text"
                readOnly
                value="₹25,000 INR (Free Insured Blue Dart Transit)"
                className="w-full px-3 py-2 bg-ivory-100 border border-border text-charcoal-800"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-serif text-lg text-charcoal-950 mb-3 pb-2 border-b border-border">
            3. Payment Gateways Status
          </h2>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-ivory-50 border border-border">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-charcoal-900">Razorpay Unified Gateway</span>
              </div>
              <span className="text-emerald-700 font-medium">Configured (Test Mode Active)</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-ivory-50 border border-border">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-charcoal-900">Stripe Global Processing</span>
              </div>
              <span className="text-emerald-700 font-medium">Configured (Test Mode Active)</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-ivory-50 border border-border">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-charcoal-900">Doorstep Verification / COD</span>
              </div>
              <span className="text-emerald-700 font-medium">Enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

