export interface ApartmentI {
    id: string;
    title: string;
    details: string;
    ownerId: string;
    date: string;
    geolocation: number[];
    address: string;
    city: string;
    price: number;
    type: string;
    photos: string[];
    msquare: number;
    roomCount: number;
}

export interface UserI {
    id?: string;
    email: string;
    token?: string;
    phone: string;
    name: string;
    surname: string;
    roles?: string[];
    verified: boolean; 
}