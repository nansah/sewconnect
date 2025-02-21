
export interface Seamstress {
  id?: string;
  name: string;
  image: string;
}

export interface LocationState {
  seamstress: Seamstress;
}

export interface Measurements {
  bust: string;
  waist: string;
  hips: string;
  height: string;
  shoulderToWaist: string;
  waistToKnee: string;
}

export interface Message {
  id?: string;
  text: string;
  sender: "user" | "seamstress";
  type?: "measurements" | "image" | "system";
  created_at?: string;
}

export interface Conversation {
  id?: string;
  user_id?: string;
  seamstress_id?: string;
  messages: Message[];
  orderDetails?: {
    price: string;
    timeframe: string;
    measurements?: string;
    inspiration?: string;
  };
}
