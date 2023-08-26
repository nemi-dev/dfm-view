import { perfectGuild } from "../../constants"


export const initCustomSkill: CustomSkillOneAttackSpec[] = [
  {
    name: "평타",
    value: 300,
    fixed: 100,
    hit: 3
  },
  {
    name: "평타 막타",
    value: 500,
    fixed: 125,
  },
  {
    name: "스킬1",
    value: 2256,
    fixed: 2256,
    isSkill: true
  },
  {
    name: "스킬 2",
    value: 1210,
    fixed: 1210,
    hit: 5,
    isSkill: true
  },
  {
    name: "스킬3",
    value: 250,
    fixed: 250,
    hit: 15,
    isSkill: true
  },
  {
    name: "각성기(연타형)",
    value: 400,
    fixed: 400,
    hit: 70,
    isSkill: true
  },
  {
    name: "각성기(한방형)",
    value: 21000,
    fixed: 21000,
    isSkill: true
  },
]


export const initCharState: DFChar = {
  id: "InitID",
  TimeStamp: Date.now(),
  "name": "캐릭터 이름",
  "dfclass": "레인저(남)",
  "level": 70,
  "achieveLevel": 9,
  "atkFixed": 343,
  "items": {
    "무기": "울티메이트 파이선",
    "상의": "채울 수 없는 탐욕",
    "하의": "끊임없는 허기",
    "머리어깨": "사라지지 않는 공포",
    "벨트": "가늠할 수 없는 허무",
    "신발": "한줄기 희망",
    "팔찌": "슈퍼 스타 암릿",
    "목걸이": "슈퍼 스타 네클레스",
    "반지": "슈퍼 스타 링",
    "보조장비": "이키의 마법 장갑",
    "칭호": "드보브 칭호",
    "오라": "제국/메이플 황금 오라",
    "무기아바타": "이달의 아이템 무기아바타",
    "봉인석": "섬멸자의 봉인석 (힘+물리공격력)",
    "정수": [
      "섬멸자의 정수 (힘+물리공격력)",
      "섬멸자의 정수 (힘+물리공격력)",
      "섬멸자의 정수 (힘+물리공격력)",
      "섬멸자의 정수 (힘+물리공격력)",
      "섬멸자의 정수 (힘+물리공격력)"
    ],
    "크리쳐": "진: 정령왕",
    "아티팩트": {
      "Red": "마고스 아티팩트-레드",
      "Green": "마고스 아티팩트-그린",
      "Blue": "마고스 아티팩트-블루"
    }
  },
  "cards": {
    "무기": "트윙클 레지나 카드",
    "상의": "개벽의 미카엘라 카드",
    "하의": "개벽의 미카엘라 카드",
    "머리어깨": "기어의 디샤 카드",
    "벨트": "피리토 - 곰 카드",
    "신발": "피리토 - 곰 카드",
    "팔찌": "타르타로스 카드",
    "목걸이": "타르타로스 카드",
    "반지": "타르타로스 카드",
    "보조장비": "무의 오즈마 카드",
    "칭호": null
  },
  "emblems": {
    "무기": [["Red", 7], ["Red", 7]],
    "상의": [["Red", 7], ["Red", 7]],
    "하의": [["Red", 7], ["Red", 7]],
    "머리어깨": [["Yellow", 7], ["Yellow", 7]],
    "벨트": [["Yellow", 7], ["Yellow", 7]],
    "신발": [["Blue", 7], ["Blue", 7]],
    "팔찌": [["Blue", 7], ["Blue", 7]],
    "목걸이": [["Green", 7], ["Green", 7]],
    "반지": [["Green", 7], ["Green", 7]],
    "보조장비": [["Light", 7]],
    "칭호": [["Light", 7]]
  },
  "magicProps": {
    "무기": ["dmg_inc", "Stat", "Stat"],
    "상의": ["Stat", "Stat", "Stat"],
    "하의": ["Stat", "Stat", "Stat"],
    "머리어깨": ["Stat", "Stat", "Stat"],
    "벨트": ["Stat", "Stat", "Stat"],
    "신발": ["Stat", "Stat", "Stat"],
    "팔찌": ["el_lght", "el_lght", "el_lght"],
    "목걸이": ["el_lght", "el_lght", "el_lght"],
    "반지": ["el_lght", "el_lght", "el_lght"],
    "보조장비": ["Crit", "Crit", "Crit"],
    "봉인석": ["speed_atk", "speed_atk", "speed_atk"]
  },
  "upgradeValues": {
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
  "materials": {
    "상의": "가죽",
    "하의": "가죽",
    "머리어깨": "가죽",
    "벨트": "가죽",
    "신발": "가죽"
  },
  "unlimitValues": {
    "무기": 80,
    "상의": 80,
    "하의": 80,
    "머리어깨": 80,
    "벨트": 80,
    "신발": 80,
    "팔찌": 80,
    "목걸이": 80,
    "반지": 80,
    "보조장비": 80
  },
  "skillrunes": {
    "무기": [],
    "상의": [],
    "하의": [],
    "머리어깨": [],
    "벨트": [],
    "신발": [],
    "팔찌": [],
    "목걸이": [],
    "반지": [],
    "보조장비": []
  },
  "avatars": {
    "모자": "Uncommon",
    "얼굴": "Uncommon",
    "상의": "Uncommon",
    "목가슴": "Uncommon",
    "신발": "Uncommon",
    "머리": "Uncommon",
    "하의": "Uncommon",
    "허리": "Uncommon"
  },
  "guild": {
    ...perfectGuild,
    "PublicStatLv": 5
  },
  "creatureValues": {
    "Creature": 156,
    "Red": 50,
    "Blue": 50,
    "Green": 10,
  },
  "choices": {
    "branches": {},
    "gives": {},
    "exclusives": {}
  },
  "calibrate": {
    eltype: [],
    sk_inc: [0],
  },
  skillLevelMap: {},
  skillTPMap: {},
  skillUseCountMap: {},
  skillChargeupMap: {},
}

