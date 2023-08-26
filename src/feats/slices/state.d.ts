declare type ItemIdentifier = string | null | undefined

/** @deprecated 이제 DFChar에 직접 들어간다. */
declare interface SelfState {

  /** 얘 이름 */
  myName: string

  /** 얘 직업 */
  dfclass: DFClassName

  /** 캐릭터 레벨 (최대 65) */
  level: number

  /** 업적 레벨 (최대 9) */
  achieveLevel: number
  
  /** 독립 공격력 */
  atkFixed: number

}

declare type EquipsGenericState<T> = Record<EquipPart, T>
declare interface ItemsState extends EquipsGenericState<ItemIdentifier> {
  칭호: ItemIdentifier
  오라: ItemIdentifier
  무기아바타: ItemIdentifier
  봉인석: ItemIdentifier
  정수: ItemIdentifier[]
  크리쳐: ItemIdentifier
  아티팩트: {
    Red: ItemIdentifier
    Green: ItemIdentifier
    Blue: ItemIdentifier
  }
}

declare interface CardState extends EquipsGenericState<ItemIdentifier> {
  칭호: ItemIdentifier
}

declare interface EmblemState extends EquipsGenericState<EmblemSpec[]> {
  칭호: EmblemSpec[]
}

declare interface MagicPropsState extends EquipsGenericState<MagicPropsCareAbout[]> {
  봉인석: MagicPropsCareAbout[]
}

declare type EquipsUpState = EquipsGenericState<number>
declare type SkillruneState = EquipsGenericState<string[]>

declare interface MaterialState {
  상의: ArmorMaterial
  하의: ArmorMaterial
  머리어깨: ArmorMaterial
  벨트: ArmorMaterial
  신발: ArmorMaterial
}

declare type AvatarRarityState = Record<WearAvatarPart, WearAvatarRarity>

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
  Creature: number

  /** 레드 아티팩트 옵션에서 "내 스탯" 증가량 총합 */
  Red: number

  /** 블루 아티팩트 옵션에서 오는 "내 타입 공격력" 증가량 총합 */
  Blue: number

  /** 그린 아티팩트 옵션에서 오는 "내 속성강화 + 모든 속성강화" 증가량 총합 */
  Green: number

}

declare type OptionalChoiceType = number

declare interface Choices {
  branches: Record<string, OptionalChoiceType>
  gives: Record<string, OptionalChoiceType>
  exclusives: Record<string, string>
}

declare type NumberCalibrate = Omit<CalibrateState, "eltype" | "sk_inc">


declare type CalibrateState = Pick<BaseAttrs,
| "strn" 
| "intl" 
| "str_inc" 
| "int_inc" 
| "atk_ph" 
| "atk_mg" 
| "atk_ph_inc" 
| "atk_mg_inc" 
| "crit_ph" 
| "crit_mg" 
| "crit_ph_pct" 
| "crit_mg_pct" 
| "dmg_inc" 
| "cdmg_inc" 
| "catk_inc" 
| "dmg_add" 
| "el_fire" 
| "el_ice" 
| "el_lght" 
| "el_dark" 
| "eldmg_fire" 
| "eldmg_ice" 
| "eldmg_lght" 
| "eldmg_dark" 
| "sk_inc_sum" 
| "target_def" 
| "target_res" 
| "DefBreak" 
> & {
  eltype: Eltype[]
  sk_inc: number[]
}

declare interface CustomSkillState {
  cases: CustomSkillOneAttackSpec[]
}

/** 여기까지가 "캐릭터 저장" 단위다  */
declare interface DFChar {
  /** @deprecated  이제 캐릭터에 직접 들어간다 */
  Self?: never

  id: string
  TimeStamp: number

  name: string
  level: number
  dfclass: DFClassName
  achieveLevel: number
  atkFixed: number

  items: ItemsState
  cards: CardState
  emblems: EmblemState
  magicProps: MagicPropsState
  upgradeValues: EquipsUpState
  materials: MaterialState
  unlimitValues: EquipsUpState
  skillrunes: SkillruneState

  avatars: AvatarRarityState
  guild: GuildState
  creatureValues: CreaturePropState
  choices: Choices
  calibrate: CalibrateState
  skillLevelMap: {
    [skillID: number]: number
  }
  skillTPMap: {
    [skillID: number]: number
  }
  skillUseCountMap: {
    [skillID: number]: number
  }
  skillChargeupMap: {
    [skillID: number]: boolean
  }
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

declare interface DFMRootState {
  currentID: string

  /** @deprecated 이제 Chars에 바로 접근한다. */
  My?: never

  SavedChars: {
    byID: { [k: string]: DFChar }
    IDs: string[]
  }

  Tonic: TonicState
  EnemyTarget: {
    /** 적 방어력 (물리+마법 모두) */
    Defense: number
  
    /** 적 속성저항 (4속성 모두) */
    ElRes: number
  }

  CustomSkill: CustomSkillOneAttackSpec[]

  EquipPresets: {
    byID: { [k: string]: EquipPreset }
    IDs: string[]
  }

  CustomSkillPresets: {
    byID: { [k: string]: CustomSkillPreset }
    IDs: string[]
  }
}
