// 星のパスを生成する共通関数
export function generateStarPath(
  size: number,
  spikeLength: number,
  curvature: number,
  cornerRadius: number
) {
  const center = size / 2;

  // 4つの突起の先端座標
  const topY = center - spikeLength;
  const bottomY = center + spikeLength;
  const rightX = center + spikeLength;
  const leftX = center - spikeLength;

  // 角丸用：先端から少し内側の座標
  const topInnerY = topY + cornerRadius;
  const bottomInnerY = bottomY - cornerRadius;
  const rightInnerX = rightX - cornerRadius;
  const leftInnerX = leftX + cornerRadius;

  // 辺を内側に引き込む量（正の値で内側に凹む、負の値で外側に膨らむ）
  const inset = -curvature;

  // 各辺の制御点
  const topRightCtrlX = (center + cornerRadius + rightInnerX) / 2 + inset;
  const topRightCtrlY = (topY + cornerRadius + center) / 2 - inset;

  const rightBottomCtrlX = (rightX - cornerRadius + center) / 2 + inset;
  const rightBottomCtrlY = (center + cornerRadius + bottomInnerY) / 2 + inset;

  const bottomLeftCtrlX = (center - cornerRadius + leftInnerX) / 2 - inset;
  const bottomLeftCtrlY = (bottomY - cornerRadius + center) / 2 + inset;

  const leftTopCtrlX = (leftX + cornerRadius + center) / 2 - inset;
  const leftTopCtrlY = (center - cornerRadius + topInnerY) / 2 - inset;

  return `
    M ${center},${topInnerY}
    Q ${center},${topY} ${center + cornerRadius},${topY + cornerRadius}
    Q ${topRightCtrlX},${topRightCtrlY} ${rightInnerX},${center}
    Q ${rightX},${center} ${rightX - cornerRadius},${center + cornerRadius}
    Q ${rightBottomCtrlX},${rightBottomCtrlY} ${center},${bottomInnerY}
    Q ${center},${bottomY} ${center - cornerRadius},${bottomY - cornerRadius}
    Q ${bottomLeftCtrlX},${bottomLeftCtrlY} ${leftInnerX},${center}
    Q ${leftX},${center} ${leftX + cornerRadius},${center - cornerRadius}
    Q ${leftTopCtrlX},${leftTopCtrlY} ${center},${topInnerY}
    Z
  `
    .replace(/\s+/g, " ")
    .trim();
}
