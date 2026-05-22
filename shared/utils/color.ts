export function hexToRgbTriplet(hex: string) {
  const normalized = hex.replace('#', '').trim();

  if (normalized.length !== 6) {
    return '255 255 255';
  }

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  if ([red, green, blue].some((channel) => Number.isNaN(channel))) {
    return '255 255 255';
  }

  return `${red} ${green} ${blue}`;
}