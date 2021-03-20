export interface ApartmentI {
  id: string;
  title: string;
  details: string;
  date: string;
  geolocation: number[];
  address: string;
  city: string;
  price: number;
  type: string;
  photos: string[];
  msquare: number;
  roomCount: number;
  ownerId?: string;
  owner?: UserI;
}

export interface UserI {
  id?: string;
  email: string;
  token?: string;
  phone?: string;
  name: string;
  surname: string;
  roles?: string[];
  verified: boolean;
}
