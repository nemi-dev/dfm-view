declare namespace V5 {

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

declare type DFClassName = "버서커" | "소울브링어" | "웨펀마스터" | "아수라" | "레인저(남)" | "런처(남)" | "메카닉" | "스핏파이어" | "스트라이커" | "넨마스터" | "엘레멘탈마스터" | "마도학자" | "배틀메이지" | "인챈트리스" | "크루세이더(여)" | "미스트리스" | "이단심판관" | "무녀" | "소드마스터" | "베가본드" | "다크템플러" | "데몬슬레이어" | "크루세이더(남)" | "인파이터" | "와일드베인" | "윈드시어" | "레인저(여)" | "런처(여)"


declare interface ItemsState {
  무기: ItemIdentifier
  상의: ItemIdentifier
  하의: ItemIdentifier
  머리어깨: ItemIdentifier
  벨트: ItemIdentifier
  신발: ItemIdentifier
  팔찌: ItemIdentifier
  목걸이: ItemIdentifier
  반지: ItemIdentifier
  보조장비: ItemIdentifier
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

declare interface CardState {
  무기: ItemIdentifier
  상의: ItemIdentifier
  하의: ItemIdentifier
  머리어깨: ItemIdentifier
  벨트: ItemIdentifier
  신발: ItemIdentifier
  팔찌: ItemIdentifier
  목걸이: ItemIdentifier
  반지: ItemIdentifier
  보조장비: ItemIdentifier
  칭호: ItemIdentifier
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
  upgradeValues: UpgradeOrKaledoState
  materials: MaterialState
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

declare interface V5State {
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

}
