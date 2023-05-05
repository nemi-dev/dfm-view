export const AtypeAttrKey = {
  "Physc": {
    "Stat": "strn",
    "StatInc": "str_inc",
    "Atk" : "atk_ph",
    "AtkInc": "atk_ph_inc",
    "Crit": "crit_ph",
    "CritCh": "crit_ph_pct",
    "스탯": "힘",
    "타입": "물리",
  },
  "Magic": {
    "Stat": "intl",
    "StatInc": "int_inc",
    "Atk" : "atk_mg",
    "AtkInc": "atk_mg_inc",
    "Crit": "crit_mg",
    "CritCh": "crit_mg_pct",
    "스탯": "지능",
    "타입": "마법"
  }
} as const

export const Elemental = {
  "Fire" : {
    "el": "el_fire",
    "eldmg": "eldmg_fire",
    "속성": "화"
  },
  "Ice": {
    "el": "el_ice",
    "eldmg": "eldmg_ice",
    "속성": "수"
  },
  "Light": {
    "el": "el_lght",
    "eldmg": "eldmg_lght",
    "속성": "명"
  },
  "Dark": {
    "el": "el_dark",
    "eldmg": "eldmg_dark",
    "속성": "암"
  }
} as const

