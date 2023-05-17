declare namespace V4 {

  type DFClassName = "버서커" | "소울브링어" | "웨펀마스터" | "아수라" | "레인저(남)" | "런처(남)" | "메카닉" | "스핏파이어" | "스트라이커" | "넨마스터" | "엘레멘탈마스터" | "마도학자" | "크루세이더(여)" | "미스트리스" | "이단심판관" | "무녀" | "소드마스터" | "베가본드" | "다크템플러" | "데몬슬레이어" | "크루세이더(남)" | "인파이터" | "와일드베인" | "윈드시어" | "레인저(여)" | "런처(여)"
  type Eltype = "Fire" | "Ice" | "Light" | "Dark"
  type EmblemSpec = ["Red" | "Yellow" | "Green" | "Blue" | "Stren" | "Intel" | "Fire" | "Ice" | "Light" | "Dark", number]
  type EquipPart = "무기" | "상의" | "하의" | "머리어깨" | "벨트" | "신발" | "팔찌" | "목걸이" | "반지" | "보조장비"
  type ItemIdentifier = string | null | undefined
  type MagicPropsCareAbout = "dmg_inc" | "Stat" | "Atk" | "el_fire" | "el_ice" | "el_lght" | "el_dark" | "Crit" | "speed_atk" | "Accu" | "DontMind"
  type OptionalChoiceType = number
  type WearAvatarRarity = "Common" | "Uncommon" | "Rare"

  interface CustomSkillOneAttackSpec {
    name: string
    value: number
    fixed?: number
    isSkill?: boolean
    maxHit?: number
    eltype?: Eltype[] | null | undefined
  }

  interface DFCharState {
    Self: {
      myName: string
      dfclass: DFClassName
      level: number
      achieveLevel: number
      atkFixed: number
    }
    Item: {
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
    Card: {
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
    Emblem: {
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
    MagicProps: {
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
    Upgrade: {
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
    Material: {
      상의: ArmorMaterial
      하의: ArmorMaterial
      머리어깨: ArmorMaterial
      벨트: ArmorMaterial
      신발: ArmorMaterial
    }
    Avatar: { [k in WearAvatarPart]: WearAvatarRarity }
    Guild: {
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
    CreatureValue: {
      Creature: number
      Red: number
      Blue: number
      Green: number
    }
    Choice: {
      branches: Record<string, OptionalChoiceType>
      gives: Record<string, OptionalChoiceType>
      exclusives: Record<string, string>
    }
    Calibrate: {
      strn?: number
      intl?: number
      str_inc?: number
      int_inc?: number
    
      atk_ph?: number
      atk_mg?: number
      atk_ph_inc?: number
      atk_mg_inc?: number
    
      crit_ph?: number
      crit_mg?: number
      crit_ph_pct?: number
      crit_mg_pct?: number
    
      dmg_inc?: number
      cdmg_inc?: number
      catk_inc?: number
      dmg_add?: number
    
      eltype: Eltype[]
      
      el_fire?: number
      el_ice?: number
      el_lght?: number
      el_dark?: number
    
      eldmg_fire?: number
      eldmg_ice?: number
      eldmg_lght?: number
      eldmg_dark?: number
      
      sk_inc: number[]
      sk_inc_sum?: number
    
      target_def?: number
      target_res?: number
    
      DefBreak?: number
    }
  }

  interface _RootState {
    My: DFCharState
    Tonic: {
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
    EnemyTarget: {
      Defense: number
      ElRes: number
    }
    SavedChars: {
      byID: {
        [k: string]: {
          id: string
          TimeStamp: number
          DFChar: DFCharState
          DamageGrab: number
        }
      }
      IDs: string[]
    }
    EquipPresets: {
      byID: {
        [k: string]: {
          id: string
          label?: string
          TimeStamp: number
          Equips: {
            [k in EquipPart]: string
          }
        }
      }
      IDs: string[]
    }
    CustomSkill: CustomSkillOneAttackSpec[]
    CustomSkillPresets: {
      byID: {
        [k: string]: {
          id: string
          label?: string
          TimeStamp: number
          Skills: {
            cases: CustomSkillOneAttackSpec[]
          }
        }
      }
      IDs: string[]
    }
  }

}
