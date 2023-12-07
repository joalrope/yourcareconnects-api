export const randomLocation = (latlng: string) => {
  let value = latlng === "lng" ? -74 : 22;

  const decimal = Math.random();

  return value + decimal;
};
