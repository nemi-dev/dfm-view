import memoizee from "memoizee"

export const avatarParts = ["모자", "얼굴", "상의", "목가슴", "신발", "머리", "하의", "허리"] as WearAvatarPart[]

const attrMap = {
  모자: ["speed_cast", 12, 14],
  얼굴: ["speed_atk", 5, 6],
  목가슴: ["speed_atk", 5, 6],
  신발: ["speed_move", 5, 6],
  머리: ["speed_cast", 12, 14],
  하의: ["hpmax", 418, 682]
} as const

const rareCoat = { sk_lv: {
  "@Lv10": 1, "@Lv15": 1, "@Lv20": 1, "@Lv25": 1, "@Lv30": 1
}}

const UncommonCoat = { sk_lv: { "@Lv15": 1 }}


export const getAvatarAttr = memoizee(
  function _getAvatarAttr(part: WearAvatarPart, rarity: WearAvatarRarity): BaseAttrs {
    if (rarity === "Common") return {}
    if (part === "허리") return { misc: ["회피 확률 증가"] }
    if (part === "상의") {
      return rarity === "Rare" ? rareCoat : UncommonCoat
    }
    const index = rarity == "Rare"? 2 : 1
    return { [attrMap[part][0]] : attrMap[part][index] }
  }
, { primitive: true })



export const UncommonSet: Record<number, BaseAttrs> = {
  3: { strn: 20, intl: 20, vit: 10, psi: 10 },
  5: { hpmax: 100, mpmax: 100 },
  8: { strn: 20, intl:20, vit: 10, psi: 10, speed_atk: 1, speed_cast: 1, speed_move: 1}
}

export const rareSet: Record<number, BaseAttrs> = {
  3: { strn: 35, intl: 35, vit: 20, psi: 20, speed_atk: 1.5, speed_cast: 1.5, speed_move: 1.5 },
  5: { hpmax: 220, mpmax: 220, AccuPct: 1, misc: ["회피 확률 1% 증가"] },
  8: {
    strn: 35, intl:35, vit: 20, psi: 20, speed_atk: 1.5, speed_cast: 1.5, speed_move: 1.5,
    res_fire: 10, res_ice: 10, res_lght: 10, res_dark: 10,
    misc: ["마을 이동 속도 증가!"]
  }
}


