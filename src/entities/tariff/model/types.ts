export interface Tariff {
  id: string;
  name: string;
  price: number;
  speedLimit: string;
  slug?: string;
  description?: string;
  hasInternet?: boolean;
  hasTv?: boolean;
  hasMovies?: boolean;
  sortOrder?: number;
  createdAt?: string;
}
