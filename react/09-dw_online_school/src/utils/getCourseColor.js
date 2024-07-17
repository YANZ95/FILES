const COLORS = {
  purple: "#d19fe9",
  green: "#7cd9cs",
  yellow: "#f7d16f",
};

function getCourseColor(code) {
  const firstCode = Number(code.charAt(0));
  // Number을 안 쓰면 다르게 써야됨 (숫자를 써야됨)
  switch (firstCode) {
    case 3:
    case 9:
      return COLORS.green;
    case 5:
      return COLORS.yellow;
    case 1:
    case 7:
    case 8:
    default:
      return COLORS.purple;
  }
}

export default getCourseColor;
