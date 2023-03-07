declare interface PartType {
  /** 이 부위에 장착된 아이템 이름 */
  name: string

  /** 
   * 강화로 얻는 수치 (무기, 방어구, 악세서리, 보조장비에만 있다)  
   * "강화 단계"가 아니고 힘/지능 또는 물리/마법 공격력 증가 수치임!!!
   * */
  upgrade?: number

  /** 품질 (무기, 방어구, 악세서리, 보조장비에만 있다) */
  kaledo?: number

  /** 엠블렘 (무기, 방어구, 악세서리, 보조장비, 칭호에만 있다) */
  emblems?: EmblemSpec[]

  /** 장착된 카드 이름 (무기, 방어구, 악세서리, 보조장비, 칭호에만 있다) */
  card?: string

  /** 마법봉인 (무기, 방어구, 악세서리, 보조장비, 봉인석에만 있다) */
  magicProps?: MagicPropsCareAbout[]

  /** 아이템 재질 (방어구에만 있다) */
  material?: ArmorMaterial

}


declare interface EquipsState {

  무기: PartType
  상의: PartType
  하의: PartType
  머리어깨: PartType
  벨트: PartType
  신발: PartType
  팔찌: PartType
  목걸이: PartType
  반지: PartType
  보조장비: PartType
  칭호: PartType
  봉인석: PartType

}

declare type AvatarState = {
  [k in AvatarPart]: "Uncommon" | "Rare"
} & {
  오라: string
  무기아바타: string
}


declare interface TonicState {
  Accu: number;
  crit: number;
  def: number;
  el_all: number;
  strn_intl: number;
  hp_mp_max: number;
  vit_psi: number;
}

declare interface CracksState {

  /** 장착 중인 정수 이름 */
  Spells: string[]
}


declare interface GuildState {
  StatLv: number
  AtkLv: number
  CritLv: number
  ElLv: number
  SpeedAtkLv: number
  SpeedCastLv: number
  SpeedMoveLv: number
  AccuLv: number
  PublicStatLv: number
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