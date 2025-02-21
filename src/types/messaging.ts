
export interface Seamstress {
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
  text: string;
  sender: "user" | "seamstress";
  type?: "measurements" | "image";
}
