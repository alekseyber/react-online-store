import { makeVar } from "@apollo/client";

export const sortValueVar = makeVar<string>("");

export interface ICity {
  id: number;
  cityName: string;
  oblName: string;
}

export const cityСurrentVar = makeVar<ICity>({
  id: 44,
  cityName: "Москва",
  oblName: "Москва",
});

interface IPvzSelected {
  index: number;
  cityid: number;
  Code: string;
  Name: string;
  Address: string;
  WorkTime: string;
  AddressComment: string;
  type: string;
}

export type TPvzSelect = null | IPvzSelected;
export type TDeliverySelect = number;

export const pvzSelectVar = makeVar<TPvzSelect>(null);
export const deliverySelectVar = makeVar<TDeliverySelect>(0);

const googleReKeyInitial: string =
  process.env.REACT_APP_RE_KEY || "6LdMXcQUAAAAAMDZv8aiNoBc1poD0Yd6fZjeivKN";
const yaMapKeyInitial: string =
  process.env.REACT_APP_YMAP_KEY || "b43c189e-389a-4ccc-b79e-436d89a914ee";
let baseApiUrlInitial: string =
  process.env.NODE_ENV !== "production" ? "http://localhost:5000" : "";

if (process.env.REACT_APP_API_URL) {
  baseApiUrlInitial = process.env.REACT_APP_API_URL;
}

export const googleReKeyVar = makeVar<string>(googleReKeyInitial);
export const yaMapKeyVar = makeVar<string>(yaMapKeyInitial);
export const baseApiUrlVar = makeVar<string>(baseApiUrlInitial);
