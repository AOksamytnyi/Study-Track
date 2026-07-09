export function getNumericParam(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const id = Number(value);
  return Number.isNaN(id) ? null : id;
}

export function getStringParam(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function getPositiveIntegerListParam(value: unknown) {
  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(",")
    .map((item) => Number(item))
    .filter((item) => Number.isInteger(item) && item > 0);
}
