import memoizee from "memoizee"

function linear(level: number, min: number, max: number, precision: number = 1) {
  const v = min + (max - min) * (level - 1) / 9
  return Math.round(v / precision) * precision
}

/** 엠블렘 문자열("(색깔 또는 속성)(레벨)")을 옵션으로 변환한다 */
export const getEmblem = memoizee(
function _getEmblem([key, level]: EmblemSpec): BaseAttrs {
  switch (key) {
    case "Red":
      const stat = linear(level, 8, 55, 1)
      return { strn: stat, intl: stat, vit: stat, psi: stat }
    case "Yellow":
      return {
        speed_atk: linear(level, 0.4, 2.7, 0.1),
        speed_cast: linear(level, 0.5, 3.6, 0.1)
      }
    case "Green":
      const crit = linear(level, 8, 46, 1)
      return { crit_ph: crit, crit_mg: crit }
    case "Blue": return { speed_move: linear(level, 0.4, 2.7, 0.1) }
    case "Stren": return { strn: linear(level, 24, 98, 1) }
    case "Intel": return { intl: linear(level, 24, 98, 1) }
    case "Fire": return { el_fire: linear(level, 2, 29, 1) }
    case "Ice": return { el_ice: linear(level, 2, 29, 1) }
    case "Light": return { el_lght: linear(level, 2, 29, 1) }
    case "Dark": return { el_dark: linear(level, 2, 29, 1) }
  }
}  
, { primitive: true })

/** !! 이건 엠블렘 아이콘에서만 사용되는 것임!!!! */
export function acceptEmblem(part: EquipPart | "칭호") {
  switch (part) {
    case "무기": return "Weapon"
    case "상의": case "하의": return "Red"
    case "머리어깨": case "벨트": return "Yellow"
    case "신발": case "팔찌": return "Blue"
    case "목걸이": case "반지": return "Green"
    case "보조장비": case "칭호": return "Platinum"
  }
}
