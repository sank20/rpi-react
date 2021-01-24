const prod = {
  url: "http://192.168.4.1:8000",
};
const dev = {
  url: "http://localhost:8000",
};
export const config = process.env.NODE_ENV === "development" ? dev : prod;
