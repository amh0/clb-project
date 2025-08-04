export interface Punto {
  lon: number;
  lat: number;
}

export interface LineaCercana {
  _id: string;
  number: string;
  points: Punto[];
}
