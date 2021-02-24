import { useQuery } from "@apollo/client";
import React, { useEffect, useState, createContext } from "react";
import { GET_APARTMENTS } from "./graphQL/Queries";
import { ApartmentI } from "./interfaces";

export const ApartmentsContext = createContext<ApartmentI[]>([]);

export default function ApartmentsData({ children }: any) {
  const { data, loading, error } = useQuery(GET_APARTMENTS);
  const [apartments, setApartments] = useState<ApartmentI[]>([]);

  useEffect(() => {
    if (data?.apartments) {
      setApartments(data.apartments);
    }
  }, [data]);

  return (
    <ApartmentsContext.Provider value={apartments}>
      {children}
    </ApartmentsContext.Provider>
  );
}
