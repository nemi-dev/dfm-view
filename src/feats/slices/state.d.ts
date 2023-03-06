declare interface EquipsType {

  무기: EquipPartType
  상의: ArmorPartType
  하의: ArmorPartType
  머리어깨: ArmorPartType
  벨트: ArmorPartType
  신발: ArmorPartType
  팔찌: EquipPartType
  목걸이: EquipPartType
  반지: EquipPartType
  보조장비: EquipPartType

}

declare type AvatarInitType = {
  [k in AvatarPart]: "Uncommon" | "Rare"
} & {
  칭호: string
  오라: string
  무기아바타: string

  card: string
  emblems: EmblemSpec[]
}


declare interface TonicType {
  Accu: number;
  crit: number;
  def: number;
  el_all: number;
  strn_intl: number;
  hp_mp_max: number;
  vit_psi: number;
}

declare interface CracksType {
  /** 봉인석 이름 */
  rune: string

  /** 봉인석 마법봉인 */
  MagicProps: MagicPropsCareAbout[]

  /** 장착 중인 정수 이름 */
  Spells: string[]
}


declare interface GuildType {
  stat: number
  atk: number
  crit: number
  el_all: number
  speed_atk: number
  Accu: number
  guildPublicStatLv: number
}


declare type NumberCalibrate = Omit<CalibrateInitType, "eltype" | "sk_inc">

declare interface OneAttrTripletProps {
  className?: string
  name?: string | JSX.Element
  aKey: any
  percent?: boolean
  signed?: boolean
}

declare interface CalibrateInitType {
  strn: number,
  intl: number,
  str_inc: number,
  int_inc: number,

  atk_ph: number,
  atk_mg: number,
  atk_ph_inc: number,
  atk_mg_inc: number,

  crit_ph: number,
  crit_mg: number,
  crit_ph_pct: number,
  crit_mg_pct: number,

  dmg_inc: number,
  cdmg_inc: number,
  dmg_add: number,

  eltype: Eltype[]
  
  el_fire: number,
  el_ice: number,
  el_lght: number,
  el_dark: number,

  eldmg_fire: number,
  eldmg_ice: number,
  eldmg_lght: number,
  eldmg_dark: number,
  
  sk_inc: number[],
  sk_inc_sum: number

  target_def: number,
  target_res: number
}