import { makeVar } from "@apollo/client";

export const sortValueVar = makeVar("");
export const cityСurrentVar = makeVar({
  id: 44,
  cityName: "Москва",
  oblName: "Москва",
});

export const pvzSelectVar = makeVar(null);
export const deliverySelectVar = makeVar(0);

const googleReKeyInitial =
  process.env.REACT_APP_RE_KEY || "6LdMXcQUAAAAAMDZv8aiNoBc1poD0Yd6fZjeivKN";
const yaMapKeyInitial =
  process.env.REACT_APP_RE_KEY || "b43c189e-389a-4ccc-b79e-436d89a914ee";
let baseApiUrlInitial =
  process.env.NODE_ENV !== "production" ? "http://localhost:5000" : "";

if (process.env.REACT_APP_API_URL) {
  baseApiUrlInitial = process.env.REACT_APP_API_URL;
}

export const googleReKeyVar = makeVar(googleReKeyInitial);
export const yaMapKeyVar = makeVar(yaMapKeyInitial);
export const baseApiUrlVar = makeVar(baseApiUrlInitial);
