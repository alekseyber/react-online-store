function getTintedColor(
  color: string,
  v: number = 1,
  light: boolean = false
): string {
  if (!color) {
    console.log("getTintedColor - empty color value return #000000");
    return "#000000";
  }
  if (color.length > 6) {
    color = color.substring(1, color.length);
  }
  const getRezultAction = (value: number): number => {
    return light ? value + v : value - v;
  };
  const rgb = parseInt(color, 16);

  let r = getRezultAction(Math.abs((rgb >> 16) & 0xff));
  if (r > 255) r = r - (r - 255);

  let g = getRezultAction(Math.abs((rgb >> 8) & 0xff));
  if (g > 255) g = g - (g - 255);

  let b = getRezultAction(Math.abs(rgb & 0xff));
  if (b > 255) b = b - (b - 255);

  let rStr: string = Number(r < 0 || isNaN(r))
    ? "0"
    : (r > 255 ? 255 : r).toString(16);
  if (rStr.length === 1) rStr = "0" + rStr;
  let gStr: string = Number(g < 0 || isNaN(g))
    ? "0"
    : (g > 255 ? 255 : g).toString(16);
  if (gStr.length === 1) gStr = "0" + gStr;
  let bStr: string = Number(b < 0 || isNaN(b))
    ? "0"
    : (b > 255 ? 255 : b).toString(16);
  if (bStr.length === 1) bStr = "0" + bStr;
  return "#" + rStr + gStr + bStr;
}

export { getTintedColor };
