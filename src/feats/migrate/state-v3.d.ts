declare namespace State_v3 {
  interface SelfState {
    myName: string
    dfclass: DFClassName
    level: number
    achieveLevel: number
    atkFixed: number
  
  }
  
  interface ItemsState {
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
  
  interface CardState {
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
  
  interface EmblemState {
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
  
  interface MagicPropsState {
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
  
  interface UpgradeOrKaledoState {
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
  
  interface MaterialState {
    상의: ArmorMaterial
    하의: ArmorMaterial
    머리어깨: ArmorMaterial
    벨트: ArmorMaterial
    신발: ArmorMaterial
  }
  
  type AvatarRarityState = { [k in WearAvatarPart]: WearAvatarRarity }
  
  interface TonicState {
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
  
  interface GuildState {
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
  
  interface CreaturePropState {
    CreatureStat: number
    RedPropsValue: number
    BluePropsValue: number
    GreenPropsEl: number
  }
  
  type OptionalChoiceType = number
  
  interface Choices {
    branches: Record<string, OptionalChoiceType>
    gives: Record<string, OptionalChoiceType>
    exclusives: Record<string, string>
  }
  
  type NumberCalibrate = Omit<CalibrateState, "eltype" | "sk_inc">
  
  interface CalibrateState {
    strn: number
    intl: number
    str_inc: number
    int_inc: number
  
    atk_ph: number
    atk_mg: number
    atk_ph_inc: number
    atk_mg_inc: number
  
    crit_ph: number
    crit_mg: number
    crit_ph_pct: number
    crit_mg_pct: number
  
    dmg_inc: number
    cdmg_inc: number
    catk_inc: number
    dmg_add: number
  
    eltype: Eltype[]
    
    el_fire: number
    el_ice: number
    el_lght: number
    el_dark: number
  
    eldmg_fire: number
    eldmg_ice: number
    eldmg_lght: number
    eldmg_dark: number
    
    sk_inc: number[]
    sk_inc_sum: number
  
    target_def: number
    target_res: number
  
    DefBreak: number
  
  }
  
  interface CustomSkillState {
    cases: SkillOneAttackSpec[]
  }
  
  interface DFCharState {
    Self: SelfState
    Item: ItemsState
    Card: CardState
    Emblem: EmblemState
    MagicProps: MagicPropsState
    Upgrade: UpgradeOrKaledoState
    Material: MaterialState
    Avatar: AvatarRarityState
    Guild: GuildState
    CreatureProp: CreaturePropState
    Choice: Choices
    Calibrate: CalibrateState
  }
  
  interface EnemyTargetState {
    Defense: number
    ElRes: number
  }
  
  interface SavedChar {
    
    id: string
    TimeStamp: number
    DFChar: DFCharState
    DamageGrab: number
  }
  
  interface EquipPreset {
    id: string
    label?: string
    TimeStamp: number
    Equips: {
      [k in EquipPart]: string
    }
  }
  
  interface CustomSkillPreset {
    id: string
    label?: string
    TimeStamp: number
    Skills: CustomSkillState
  }
  
  interface SavedCharCollection {
    byID: {
      [k: string]: SavedChar
    }
    IDs: string[]
  }
  
  interface EquipPresetCollection {
    byID: {
      [k: string]: EquipPreset
    }
    IDs: string[]
  }
  
  interface CustomSkillPresetCollection {
    byID: {
      [k: string]: CustomSkillPreset
    }
    IDs: string[]
  }
  
  interface _RootState {
    My: DFCharState
    Tonic: TonicState
    EnemyTarget: EnemyTargetState
    SavedChars: SavedCharCollection
    EquipPresets: EquipPresetCollection
    CustomSkill: SkillOneAttackSpec[]
    CustomSkillPresets: CustomSkillPresetCollection
  }
}
