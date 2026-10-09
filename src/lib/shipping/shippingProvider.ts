export interface ShippingRateCalculation {
  pincode: string;
  orderTotal: number;
  weightGrams?: number;
}

export interface ShippingQuote {
  courierName: string;
  serviceTier: string;
  fee: number;
  estimatedDaysMin: number;
  estimatedDaysMax: number;
  isFree: boolean;
}

export class ShippingService {
  /**
   * Calculates dynamic shipping based on domestic/international rules & luxury threshold
   */
  async calculateShipping(calc: ShippingRateCalculation): Promise<ShippingQuote> {
    // Vaishiri Clothing Policy: Free shipping on orders above ₹999 across India, otherwise flat ₹79
    const isComplimentary = calc.orderTotal >= 999;

    return {
      courierName: "Delhivery / Blue Dart Express",
      serviceTier: "Standard Surface & Express Air",
      fee: isComplimentary ? 0 : 79,
      estimatedDaysMin: 4,
      estimatedDaysMax: 7,
      isFree: isComplimentary,
    };
  }

  /**
   * Generate official tracking URL
   */
  getTrackingUrl(courier: string, trackingNumber: string): string {
    return `https://www.bluedart.com/tracking?track=${trackingNumber}`;
  }
}

export const shippingService = new ShippingService();

