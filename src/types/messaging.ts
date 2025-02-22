
export interface Message {
  text: string;
  sender: "user" | "seamstress" | "system";
  type?: "text" | "image" | "measurements" | "delivery" | "system";
  created_at: string;
}

export interface ConversationMessage {
  conversation_id: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
  status: string;
  customer_name: string;
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
  height: string;
  shoulderToWaist: string;
  waistToKnee: string;
}

export interface DeliveryTimeframe {
  date: Date;
  urgency: "standard" | "rush" | "express";
}

export interface Review {
  id: string;
  customer_name: string;
  rating: number;
  review_text: string;
  created_at: string;
}
