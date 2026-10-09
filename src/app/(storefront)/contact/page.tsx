"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, MessageCircle, CheckCircle, Clock, Instagram, Facebook } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    orderNumber: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-28 sm:pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mb-12">
        <span className="text-[10px] sm:text-xs tracking-wider uppercase text-[#86412D] font-bold block mb-1">
          Customer Support & Inquiries
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-charcoal-950 font-normal">
          We Are Here To Assist You
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-600 mt-2 font-light">
          Have questions regarding an order, fabric meterage, or exchange? Reach out to our dedicated Vaishiri customer care team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-[#FAF7F2] p-6 sm:p-8 border border-[#E8E2D8] rounded-xs">
          {submitted ? (
            <div className="py-16 text-center space-y-4">
              <CheckCircle className="w-12 h-12 text-[#86412D] mx-auto" />
              <h3 className="font-serif text-2xl text-charcoal-950">Message Sent Successfully!</h3>
              <p className="text-xs text-charcoal-600 max-w-sm mx-auto leading-relaxed">
                Thank you for contacting Vaishiri Clothing. Our customer care representative will get back to you within 24 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider font-semibold text-charcoal-800 block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white border border-[#E8E2D8] text-xs focus:outline-none focus:border-[#86412D]"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider font-semibold text-charcoal-800 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white border border-[#E8E2D8] text-xs focus:outline-none focus:border-[#86412D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider font-semibold text-charcoal-800 block mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white border border-[#E8E2D8] text-xs focus:outline-none focus:border-[#86412D]"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider font-semibold text-charcoal-800 block mb-1">
                    Order Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.orderNumber}
                    onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                    placeholder="e.g. AVN-2026-12345"
                    className="w-full px-3 py-2.5 bg-white border border-[#E8E2D8] text-xs focus:outline-none focus:border-[#86412D]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider font-semibold text-charcoal-800 block mb-1">
                  How can we help you? *
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your inquiry..."
                  className="w-full px-3 py-2.5 bg-white border border-[#E8E2D8] text-xs focus:outline-none focus:border-[#86412D]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#86412D] text-white hover:bg-[#6B3323] text-xs uppercase tracking-wider font-bold transition-colors shadow-xs"
              >
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Right Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-white border border-[#E8E2D8] space-y-4 rounded-xs">
            <h3 className="font-serif text-xl text-charcoal-950 font-normal">
              Direct Contact Channels
            </h3>

            <div className="space-y-3.5 text-xs text-charcoal-700">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#86412D] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-charcoal-900 block">Email Support</span>
                  <a href="mailto:care@vaishiri.com" className="text-charcoal-600 hover:text-[#86412D]">
                    care@vaishiri.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#86412D] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-charcoal-900 block">Phone & WhatsApp Hotline</span>
                  <a href="tel:+919876543210" className="text-charcoal-600 hover:text-[#86412D]">
                    +91 98765 43210
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#86412D] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-charcoal-900 block">Working Hours</span>
                  <span className="text-charcoal-600">Monday to Saturday: 10:00 AM - 7:00 PM IST</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Channels */}
          <div className="p-6 bg-[#F5F1EC] border border-[#E8E2D8] rounded-xs space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-[#86412D]">
              Connect on Social Media
            </h4>
            <div className="flex flex-col gap-2 text-xs">
              <a
                href="https://www.instagram.com/vaishiri_clothing/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-charcoal-800 hover:text-[#86412D] font-medium"
              >
                <Instagram className="w-4 h-4 text-[#86412D]" />
                <span>Instagram: @vaishiri_clothing</span>
              </a>
              <a
                href="https://www.facebook.com/vaishiri/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-charcoal-800 hover:text-[#86412D] font-medium"
              >
                <Facebook className="w-4 h-4 text-[#86412D]" />
                <span>Facebook: Vaishiri Clothing</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
