
export interface Message {
  text: string;
  sender: "user" | "seamstress" | "system";
  type?: "text" | "image" | "measurements" | "delivery" | "system";
  created_at: string;
}

export interface Seamstress {
  id: string;
  name: string;
  image: string;
}

export interface LocationState {
  seamstress: Seamstress;
  designToShare?: {
    imageUrl: string;
    description: string;
  };
}

export interface Measurements {
  bust: string;
  waist: string;
  hips: string;
  height: string; // Changed from length to height
  shoulderToWaist: string;
  waistToKnee: string;
}

export interface DeliveryTimeframe {
  date: Date;
  urgency: "standard" | "rush" | "express";
}
