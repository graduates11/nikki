export const defaultTitle = () => {
  const date = new Date();
  const day = date.getUTCDate();
  const month = date.toLocaleString("default", { month: "long" });
  const hours = date.getHours();
  const minutes = date.getUTCMinutes();
  return `${day}. ${month} at ${hours}:${minutes}`;
};
