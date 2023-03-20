declare interface SelfState {

  /** 얘 이름 */
  myName: string

  /** 얘 직업 */
  dfclass: DFClassName

  /** 캐릭터 레벨 (최대 65) */
  level: number

  /** 
   * 공격타입
   * @deprecated `selectMyDFClass` 또는 `whois`로 얻은 객체의 `Atype`을 쓸것
   */
  atype: Atype

  /** 업적 레벨 (최대 9) */
  achieveLevel: number
  
  /** 독립 공격력 */
  atk_fixed: number

}

declare interface ItemsState {
  무기: string
  상의: string
  하의: string
  머리어깨: string
  벨트: string
  신발: string
  팔찌: string
  목걸이: string
  반지: string
  보조장비: string
  칭호: string
  오라: string
  무기아바타: string
  봉인석: string
  정수: string[]
  크리쳐: string
  아티팩트: {
    Red: string
    Green: string
    Blue: string
  }
}

declare interface CardState {
  무기: string | null
  상의: string | null
  하의: string | null
  머리어깨: string | null
  벨트: string | null
  신발: string | null
  팔찌: string | null
  목걸이: string | null
  반지: string | null
  보조장비: string | null
  칭호: string | null
}

declare interface EmblemState {
  무기: EmblemSpec[]
  상의: EmblemSpec[]
  하의: EmblemSpec[]
  머리어깨: EmblemSpec[]
  벨트: EmblemSpec[]
  신발: EmblemSpec[]
  팔찌: EmblemSpec[]
  목걸이: EmblemSpec[]
  반지: EmblemSpec[]
  보조장비: EmblemSpec[]
  칭호: EmblemSpec[]
}

declare interface MagicPropsState {
  무기: MagicPropsCareAbout[]
  상의: MagicPropsCareAbout[]
  하의: MagicPropsCareAbout[]
  머리어깨: MagicPropsCareAbout[]
  벨트: MagicPropsCareAbout[]
  신발: MagicPropsCareAbout[]
  팔찌: MagicPropsCareAbout[]
  목걸이: MagicPropsCareAbout[]
  반지: MagicPropsCareAbout[]
  보조장비: MagicPropsCareAbout[]
  봉인석: MagicPropsCareAbout[]
}

declare interface UpgradeOrKaledoState {
  무기: number
  상의: number
  하의: number
  머리어깨: number
  벨트: number
  신발: number
  팔찌: number
  목걸이: number
  반지: number
  보조장비: number
}

declare interface MaterialState {
  상의: ArmorMaterial
  하의: ArmorMaterial
  머리어깨: ArmorMaterial
  벨트: ArmorMaterial
  신발: ArmorMaterial
}

declare type AvatarRarityState = { [k in WearAvatarPart]: WearAvatarRarity }

declare interface TonicState {
  el_all: number
  hpmax: number
  mpmax: number
  strn_intl: number
  vit_psi: number
  def_ph: number
  def_mg: number
  Crit: number
  Accu: number
}

declare interface GuildState {
  /** 내 스탯 개인버프 레벨 */
  StatLv: number

  /** 내 타입 공격력 개인버프 레벨 */
  AtkLv: number

  /** 내 공격타입 크리티컬 개인버프 레벨 */
  CritLv: number

  /** 모든속성 강화 개인버프 레벨 */
  ElLv: number

  /** 공격속도 개인버프 레벨 */
  SpeedAtkLv: number

  /** 캐스팅속도 개인버프 레벨 */
  SpeedCastLv: number

  /** 이동속도 개인버프 레벨 */
  SpeedMoveLv: number

  /** 적중 개인버프 레벨 */
  AccuLv: number

  /** 길드 공용버프 레벨 */
  PublicStatLv: number
}

declare interface CreaturePropState {

  /** 크리쳐 레벨에 따라 크리쳐가 주는 모든스탯 보너스 */
  CreatureStat: number

  /** 레드 아티팩트 옵션에서 "내 스탯" 증가량 총합 */
  RedPropsValue: number

  /** 블루 아티팩트 옵션에서 오는 "내 타입 공격력" 증가량 총합 */
  BluePropsValue: number

  /** 그린 아티팩트 옵션에서 오는 "내 속성강화 + 모든 속성강화" 증가량 총합 */
  GreenPropsEl: number

}

declare type OptionalChoiceType = number

declare interface Choices {
  branches: Record<string, OptionalChoiceType>
  gives: Record<string, OptionalChoiceType>
  exclusives: Record<string, string>
}

declare type NumberCalibrate = Omit<CalibrateState, "eltype" | "sk_inc">

declare interface CalibrateState {
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

declare interface CustomSkillState {
  cases: SkillOneAttackSpec[]
}

/** 여기까지가 "캐릭터 저장" 단위다  */
declare interface DFCharState {
  Self: SelfState
  Item: ItemsState
  Card: CardState
  Emblem: EmblemState
  MagicProps: MagicPropsState
  Upgrade: UpgradeOrKaledoState
  Material: MaterialState
  Avatar: AvatarRarityState
  // Tonic: TonicState
  Guild: GuildState
  CreatureProp: CreaturePropState
  Choice: Choices
  Calibrate: CalibrateState
  // CustomSklill: CustomSkillState
}

declare interface EnemyTargetState {
  /** 적 방어력 (물리+마법 모두) */
  Defense: number

  /** 적 속성저항 (4속성 모두) */
  ElRes: number
}

declare interface SavedChar {
  
  id: string
  TimeStamp: number
  DFChar: DFCharState
  DamageGrab: number
}

declare interface EquipPreset {
  id: string
  label?: string
  TimeStamp: number
  Equips: {
    [k in EquipPart]: string
  }
}

declare interface CustomSkillPreset {
  id: string
  label?: string
  TimeStamp: number
  Skills: CustomSkillState
}

declare interface SavedCharCollection {
  byID: {
    [k: string]: SavedChar
  }
  IDs: string[]
}

declare interface EquipPresetCollection {
  byID: {
    [k: string]: EquipPreset
  }
  IDs: string[]
}

declare interface CustomSkillPresetCollection {
  byID: {
    [k: string]: CustomSkillPreset
  }
  IDs: string[]
}
