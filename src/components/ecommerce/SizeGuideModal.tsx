"use client";

import React, { useState } from "react";
import { Ruler, X } from "lucide-react";

export default function SizeGuideModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-xs text-[#86412D] hover:underline flex items-center gap-1.5 font-medium"
      >
        <Ruler className="w-3.5 h-3.5" />
        <span>Fabric Dimensions & Stitching Guide</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-xs">
          <div className="bg-white border border-[#E8E2D8] w-full max-w-lg p-6 relative shadow-2xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1 text-charcoal-400 hover:text-charcoal-900"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] uppercase tracking-wider text-[#86412D] font-bold block mb-1">
              Measurement & Fabric Specs
            </span>
            <h3 className="font-serif text-xl text-charcoal-950 mb-4">
              Unstitched 3-Piece Suit Set Guide
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-[#E8E2D8]">
                <thead>
                  <tr className="bg-[#FAF7F2] border-b border-[#E8E2D8] text-charcoal-700">
                    <th className="p-3">Component</th>
                    <th className="p-3">Length</th>
                    <th className="p-3">Width</th>
                    <th className="p-3">Tailoring Fit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2D8] text-charcoal-800">
                  <tr>
                    <td className="p-3 font-medium">Kurta (Top)</td>
                    <td className="p-3">2.50 Meters</td>
                    <td className="p-3">44 Inches</td>
                    <td className="p-3">Fits up to 52&quot; chest (XXXL)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Salwar / Pant (Bottom)</td>
                    <td className="p-3">2.50 Meters</td>
                    <td className="p-3">44 Inches</td>
                    <td className="p-3">Palazzo, Straight Pant, Salwar</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Dupatta</td>
                    <td className="p-3">2.25 Meters</td>
                    <td className="p-3">36-40 Inches</td>
                    <td className="p-3">Full graceful drape</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-3 bg-[#FAF7F2] text-xs text-charcoal-600 rounded-xs space-y-1">
              <p className="font-medium text-charcoal-900">Tailoring Advice:</p>
              <p>
                This set includes ample continuous fabric suitable for straight cut, A-line, Anarkali (up to 12 kalis), and cigarette pants. We recommend pre-washing in gentle cold water prior to stitching.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

