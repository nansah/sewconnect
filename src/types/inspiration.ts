export interface DeliveryTimeframe {
  date: Date;
  urgency: "standard" | "rush" | "express";
}

export interface InspirationFormData {
  deliveryTimeframe?: DeliveryTimeframe;
}
