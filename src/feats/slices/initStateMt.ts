import { customSkillInit } from "./customSkillInit"

const state: DFCharState = {
  "Self": {
    "myName": "미스트리스약해요상향좀",
    "dfclass": "미스트리스",
    "level": 65,
    "atype": "Magic",
    "achieveLevel": 9,
    "atk_fixed": 317
  },
  "Item": {
    "무기": "워터 토쳐 사이드",
    "상의": "암살자의 서슬 자켓",
    "하의": "암살자의 서슬 팬츠",
    "머리어깨": "암살자의 서슬 스트랩",
    "벨트": "암살자의 서슬 벨트",
    "신발": "암살자의 서슬 부츠",
    "팔찌": "영념의 정화수",
    "목걸이": "생명의 이슬",
    "반지": "유랑하는 바람",
    "보조장비": "브왕가의 족장 완장",
    "칭호": "월하/뜨거운 썸머 바캉스",
    "오라": "월하/바캉스/메이플 오라",
    "무기아바타": "이달의 아이템 무기아바타",
    "봉인석": "선지자의 봉인석 (지능+마법공격력)",
    "정수": ["선지자의 정수 (지능+적중)", "선지자의 정수 (지능+적중)", "선지자의 정수 (지능+적중)", "선지자의 정수 (지능+적중)", "선지자의 정수 (지능+적중)"],
    "크리쳐": "진: 정령왕",
    "아티팩트": {
      "Red": "레어 아티팩트-레드", "Green": "레어 아티팩트-그린", "Blue": "레어 아티팩트-블루"
    }
  },
  "Card": {
    "무기": "모디스 카드",
    "상의": "여제 스테로페 카드",
    "하의": "여제 스테로페 카드",
    "머리어깨": "기어의 디샤 카드",
    "벨트": "사룡 스피라찌의 머리 카드",
    "신발": "허의 환혼 카드",
    "팔찌": "긴발의 로터스 카드",
    "목걸이": "긴발의 로터스 카드",
    "반지": "긴발의 로터스 카드",
    "보조장비": "불의 사념체 카드",
    "칭호": null
  },
  "Emblem": {
    "무기": [["Red", 7], ["Red", 7]],
    "상의": [["Red", 7], ["Red", 7]],
    "하의": [["Red", 7], ["Red", 7]],
    "머리어깨": [["Yellow", 7], ["Yellow", 7]],
    "벨트": [["Yellow", 7], ["Yellow", 7]],
    "신발": [["Blue", 7], ["Blue", 7]],
    "팔찌": [["Blue", 7], ["Blue", 7]],
    "목걸이": [["Green", 7], ["Green", 7]],
    "반지": [["Green", 7], ["Green", 7]],
    "보조장비": [["Intel", 5]],
    "칭호": [["Intel", 5]]
  },
  "MagicProps": {
    "무기": ["dmg_inc", "Stat", "Stat"],
    "상의": ["Stat", "Stat", "Stat"],
    "하의": ["Stat", "Stat", "Stat"],
    "머리어깨": ["Stat", "Stat", "Stat"],
    "벨트": ["Stat", "Stat", "Stat"],
    "신발": ["Stat", "Stat", "Stat"],
    "팔찌": ["el_ice", "el_ice", "el_ice"],
    "목걸이": ["el_ice", "el_ice", "el_ice"],
    "반지": ["el_ice", "el_ice", "el_ice"],
    "보조장비": ["Crit", "Crit", "Crit"],
    "봉인석": ["Atk", "Stat", "Accu"]
  },
  "Upgrade": {
    "무기": 549,
    "상의": 31,
    "하의": 31,
    "머리어깨": 31,
    "벨트": 31,
    "신발": 31,
    "팔찌": 41,
    "목걸이": 41,
    "반지": 41,
    "보조장비": 46
  },
  "Material": {
    "상의": "중갑",
    "하의": "중갑",
    "머리어깨": "중갑",
    "벨트": "중갑",
    "신발": "중갑"
  },
  "Avatar": {
    "모자": "Rare",
    "얼굴": "Rare",
    "상의": "Rare",
    "목가슴": "Rare",
    "신발": "Rare",
    "머리": "Rare",
    "하의": "Rare",
    "허리": "Rare"
  },
  "Guild": {
    "StatLv": 30,
    "AtkLv": 30,
    "CritLv": 30,
    "ElLv": 14,
    "SpeedAtkLv": 14,
    "SpeedCastLv": 14,
    "SpeedMoveLv": 14,
    "AccuLv": 30,
    "PublicStatLv": 5
  },
  "CreatureProp": {
    "CreatureStat": 156,
    "RedPropsValue": 50,
    "BluePropsValue": 50,
    "GreenPropsEl": 10,
  },
  "Choice": {
    "branches": {},
    "gives": {},
    "exclusives": {}
  },
  "Calibrate": {
    "strn": 0,
    "intl": 0,
    "str_inc": 0,
    "int_inc": 0,
    "atk_ph": 0,
    "atk_mg": 0,
    "atk_ph_inc": 0,
    "atk_mg_inc": 0,
    "crit_ph": 0,
    "crit_mg": 0,
    "crit_ph_pct": 0,
    "crit_mg_pct": 0,
    "dmg_inc": 0,
    "cdmg_inc": 0,
    "dmg_add": 0,
    "eltype": [],
    "el_fire": 0,
    "el_ice": 0,
    "el_lght": 0,
    "el_dark": 0,
    "eldmg_fire": 0,
    "eldmg_ice": 0,
    "eldmg_lght": 0,
    "eldmg_dark": 0,
    "sk_inc": [ 0 ],
    "sk_inc_sum": 0,
    "target_def": 0,
    "target_res": 0
  },
  // "CustomSklill": customSkillInit
}

export default state