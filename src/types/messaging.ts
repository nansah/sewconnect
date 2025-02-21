
export interface Message {
  text: string;
  sender: "user" | "seamstress" | "system";
  type?: "text" | "image" | "measurements" | "system";
  created_at: string;
}

export interface Seamstress {
  id: string;
  name: string;
  image: string;
  specialty?: string;
  location?: string;
  price?: string;
}

export interface Measurements {
  bust: string;
  waist: string;
  hips: string;
  height: string;
  shoulderToWaist: string;
  waistToKnee: string;
}

export interface LocationState {
  seamstress: Seamstress;
}
