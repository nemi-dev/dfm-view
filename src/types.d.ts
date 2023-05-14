declare type NumberZ = number | ""

declare type Atype = "Physc" | "Magic"
declare type Rarity = "Common" | "Uncommon" | "Rare" | "Unique" | "Epic"
declare type Eltype = "Fire" | "Ice" | "Light" | "Dark"

declare type DFClassName = "버서커" | "소울브링어" | "웨펀마스터" | "아수라" | "레인저(남)" | "런처(남)" | "메카닉" | "스핏파이어" | "스트라이커" | "넨마스터" | "엘레멘탈마스터" | "마도학자" | "크루세이더(여)" | "미스트리스" | "이단심판관" | "무녀" | "소드마스터" | "베가본드" | "다크템플러" | "데몬슬레이어" | "크루세이더(남)" | "인파이터" | "와일드베인" | "윈드시어" | "레인저(여)" | "런처(여)"

declare type WeaponType = 
"소검"|"도"|"둔기"|"대검"|"광검"
|"너클"|"건틀릿"|"클로"|"권투글러브"|"통파"
|"리볼버"|"자동권총"|"머스켓"|"핸드캐넌"|"보우건"
|"창"|"봉"|"로드"|"스탭"|"빗자루"
|"십자가"|"염주"|"토템"|"낫"|"배틀액스"
|"락소드"|"윙블레이드"

declare type Itype = WeaponType
|"상의"|"하의"|"머리어깨"|"벨트"|"신발"|"목걸이"|"팔찌"|"반지"|"보조장비"|"카드"|"칭호"|"봉인석"|"정수"|"오라"|"무기아바타"|"크리쳐"

/** 
 * - 인벤토리의 [장비] 탭에 나오는 아이템을 끼는 부위  
 * - 강화/칼레이도박스 가능한 부위
 */
declare type EquipPart = "무기" | "상의" | "하의" | "머리어깨" | "벨트" | "신발" | "팔찌" | "목걸이" | "반지" | "보조장비"

/** 마법봉인이 붙을 수 있는 장비 부위 */
declare type MagicPropsPart = EquipPart | "봉인석"

/** 카드/엠블렘을 박을 수 있는 장비 부위 */
declare type CardablePart = EquipPart | "칭호"

/** 방어구 부위 */
declare type ArmorPart = "상의" | "하의" | "머리어깨" | "벨트" | "신발"

/** 악세서리 부위 */
declare type AccessPart = "팔찌" | "목걸이" | "반지"

/** 방어구 재질 */
declare type ArmorMaterial = "천" | "가죽" | "경갑" | "중갑" | "판금"

/** 부위당 하나만 낄 수 있는 아이템 (정수/아티팩트는 여러개 낄 수 있다.) */
declare type SingleItemPart = EquipPart | "칭호" | "오라" | "무기아바타" | "봉인석" | "크리쳐"

declare type WholePart = EquipPart | "칭호" | "오라" | "무기아바타" | "봉인석" | "정수" | "크리쳐" | "아티팩트"
declare type WearAvatarPart = "모자" | "얼굴" | "상의" | "목가슴" | "신발" | "머리" | "하의" | "허리"

declare type MagicPropsCareAbout = "dmg_inc" | "Stat" | "Atk" | "el_fire" | "el_ice" | "el_lght" | "el_dark"
| "Crit" | "speed_atk" | "Accu" | "DontMind"



declare type EmblemType = "Red" | "Yellow" | "Green" | "Blue" | "Stren" | "Intel" | "Fire" | "Ice" | "Light" | "Dark"

declare type EmblemSpec = [EmblemType, number]

declare type WearAvatarRarity = "Common" | "Uncommon" | "Rare"

declare type ArtifactColor = "Red" | "Green" | "Blue"

/** Base + (inc * 스킬렙)을 나타내는 오브젝트 */
declare interface LinearValue {
  base: number
  inc: number
}

/** 스킬레벨이 정해지지 않았을 때 스킬 수치 (계수, 스탯증가 등) */
declare type SkillValue = number | LinearValue

/** 아이템/아이템 세트/버프 스킬/패시브 스킬 등의 (항상 적용되는) 효과 */
declare interface BaseAttrs {
  /** 힘 */
  strn?: number

  /** 지능 */
  intl?: number

  /** 힘 증가 (%) */
  str_inc?: number

  /** 지능 증가 (%) */
  int_inc?: number

  /** 물리 공격력 */
  atk_ph?: number

  /** 마법 공격력 */
  atk_mg?: number

  /** 물리 공격력 증가 (%) */
  atk_ph_inc?: number

  /** 마법 공격력 증가 (%) */
  atk_mg_inc?: number
  
  /** 물리 크리티컬 */
  crit_ph?: number

  /** 마법 크리티컬 */
  crit_mg?: number

  /** 물리 크리티컬 확률 증가 (%) */
  crit_ph_pct?: number

  /** 마법 크리티컬 확률 증가 (%) */
  crit_mg_pct?: number

  /** 데미지 증가 (%) */
  dmg_inc?: number

  /** 크리티컬 데미지 증가 [%] (암살복, 엘리신발 등) */
  cdmg_inc?: number

  /** 크리티컬 공격력 증가 [%] (버서커/이단심판관 버프, 암살단원의 칼날반지에 있는거) */
  catk_inc?: number

  /** 추가 데미지 (%) */
  dmg_add?: number

  /** 속성 부여 */
  eltype?: Eltype[]

  /** 화속성 강화 */
  el_fire?: number

  /** 수속성 강화 */
  el_ice?: number

  /** 명속성 강화 */
  el_lght?: number

  /** 암속성 강화 */
  el_dark?: number

  /** 화속성 추가 데미지 (%) */
  eldmg_fire?: number

  /** 수속성 추가 데미지 (%) */
  eldmg_ice?: number

  /** 명속성 추가 데미지 (%) */
  eldmg_lght?: number

  /** 암속성 추가 데미지 (%) */
  eldmg_dark?: number

  /** 속성강화가 가장 높은 속성 추가 데미지 */
  AddMaxEldmg?: number

  /** 이게 있으면 화속강과 명속강이 큰쪽으로 같아진다. (런처, 이단심판관) */
  DualTrigger?: boolean

  /** 스킬 공격력 증가 (%) */
  sk_inc?: number

  /** 단리 적용되는 (ex. 패시브 스킬) 스킬 공격력 증가 (%) */
  sk_inc_sum?: number

  /** 특정 스킬 공격력 증가(%) */
  sk_val?: { [k: string]: number }

  /** 특정 스킬의 버프 수치 증가 */
  skb_add?: { [k: string]: number }

  /** 스킬 1회 사용 시 타격횟수 증가 */
  sk_hit?: { [k: string]: number }

  /** 특정 스킬 레벨 증가 */
  sk_lv?: { [k: string]: number }

  /** 특정 스킬 지속시간 증가 */
  sk_dur?: { [k: string]: number }

  /** 특정 스킬 쿨타임 증가/감소 (%) */
  sk_cool?: { [k: string]: number }

  /** 적 방어력 변화 (내가 공격한 적 + 방어 감소 오라 모두 포함) */
  target_def?: number

  /** 적 속성저항 변화 (모든속성) */
  target_res?: number

  /** 적 방어력 감소 (%) */
  DefBreak?: number

  /** 공격 속도 +X% */
  speed_atk?: number
  
  /** 캐스팅 속도 +X% */
  speed_cast?: number

  /** 이동 속도 +X% */
  speed_move?: number

  /** 적중 */
  Accu?: number

  /** 적중 확률 증가 (%) */
  AccuPct?: number

  /** HP MAX (실적용 제외) */
  hpmax?: number

  /** MP MAX (실적용 제외) */
  mpmax?: number

  /** 체력 */
  vit?: number

  /** 정신력 */
  psi?: number

  /** 물리 방어력 */
  def_ph?: number

  /** 마법 방어력 */
  def_mg?: number

  /** 물리 방어력 (%) */
  def_ph_pct?: number

  /** 마법 방어력 (%) */
  def_mg_pct?: number

  /** 화속성 저항 */
  res_fire?: number

  /** 수속성 저항 */
  res_ice?: number

  /** 명속성 저항 */
  res_lght?: number

  /** 암속성 저항 */
  res_dark?: number

  /** 회피 */
  Evd?: number

  /** 회피 확률 증가 [%] */
  EvPct?: number

  /** 마을 이동 속도 증가 [%] */
  Walk?: number

  /** 최대 중첩 횟수 */
  maxRepeat?: number

}

type El_val = "el_fire" | "el_ice" | "el_lght" | "el_dark" 
declare type El = Pick<BaseAttrs, El_val | "eltype">


/**
 * 아이템/아이템세트의 `branch`/`gives`/`exclusive.children`에 들어가는 조건부 효과
 * 
 * 마을에서는 아예 적용되지 않는다.  
 * `pick`을 만족할 때, `attrs`의 모든 효과가 적용되는 것으로 간주한다.  
 * `pick`이 없으면 던전에서 항상 적용된다.
 * */
declare interface ConditionalNode {

  /** 
   * 이 효과가 적용될 조건/이 조건부 효과의 이름 등 하위 조건부 효과를 기깔나게 표현한 키 이름  
   * 없으면 "던전에서 항상 적용"된다.  
   */
  pick?: string

  /** 
   * 최대 중첩 횟수 (없으면 1)  
   * Exclusive일 때는 사용되지 않는다.
   */
  maxRepeat?: number

  /** 적용되는 효과 (1중첩 기준) */
  attrs: BaseAttrs

  /** 조건이 맞았을 때, 이 효과가 적용될 확률 [%] */
  mt_chance?: number

  /** 조건을 만족해 적용된 이 효과가 지속되는 시간 [초] */
  mt_dur?: number

  /** 효과가 다시 적용 가능하기까지 쿨타임 [초] */
  mt_cool?: number

}

/**
 * 어떤 조건 내에서, 여러 가지 효과 중 단 하나만 생길 수 있는 세트의 그룹 (ex. 로터스무기, 예언자, 새벽의기도)
 */
declare interface ExclusiveSet {

  /** 이 ExclusiveSet의 Key name(이름 또는 적용될 조건이 가능하다.) */
  pickSet?: string

  /** 이 ExclusiveSet의 조건이 만족되었을 때, 발동될 수 있는 효과 모음 */
  children: ConditionalNode[]
}


/** 잘 정리된 아이템 */
declare interface DFItem {

  /** 아이템 이름 */
  name: string

  /** 아이템 ID */
  id: number

  /** 아이템 아이콘 이름 */
  image?: string

  /** 아이템 오버레이 아이콘 이름 (환영극단 2막 등) */
  overlay?: string

  /** 아이템 레벨 (아이템 착용가능 레벨) */
  level: number

  /** 아이템 레어도 */
  rarity: Rarity

  /** 아이템 종류 */
  itype: Itype

  /** 이 아이템으로 활성화시킬 수 있는 세트 [ex) 에픽 환영극단, 개막/종막] */
  setOf?: "all" | string[]

  /** 이 아이템을 쓸 수 있는 직업 */
  who?: DFClassName[]

  /** 이 아이템을 얻을 수 있는 컨텐츠 (환영극단, 오즈마 등) */
  content?: string[]

  /** (카드일 때만) 이 카드를 바를 수 있는 장비 부위 */
  part?: CardablePart[]

  /** (방어구일 때만) 재질 */
  material?: ArmorMaterial

  /** (아티팩트일 때만) 아티팩트 색깔 */
  ArtiColor?: ArtifactColor

  /** 아이템 효과 */
  attrs: BaseAttrs

  /** 특정 조건에만 적용되는 효과 모음 */
  branch?: ConditionalNode[]

  /** 특정 조건을 만족할때 파티원 모두에게 적용되는 효과 모음 */
  gives?: ConditionalNode[]

  /** 특정 조건을 만족할때 생길 수 있는 효과가 여러 개 중에서 하나일 때, 그 모음 */
  exclusive?: ExclusiveSet[]

  /** 기타 관심없는 효과 */
  misc?: string[]

}

/** 아이템 세트 */
declare interface DFISet {
  /** 세트 이름 */
  name?: string
  /**
   * 세트 아이템이 (key:2-9)개 모였을 때 나타나는 효과
   */
  [k: number]: ComplexAttrSource
}



/** 직업 */
declare interface DFClass {

  /** 직업명 */
  name: DFClassName

  /** 공격타입 (물리("Physc")|마법("Magic")만 가능, 컨버전 등이 나오면 다른방법을 써야한다.) */
  atype: Atype

  /** 착용 가능한 무기 */
  weapons: WeaponType[]

  /** 이 직업에게 항상 적용되는 효과 */
  attrs: BaseAttrs

  /** 이 직업이 사용가능한 공격 스킬들 이름 */
  skills: string[]

  /** 이 직업이 사용가능한 패시브/버프 스킬 이름 */
  selfSkills: string[]
}

/** 
 * 효과를 내는 것 (아이템/세트효과/스킬효과/아바타/마력결정/길드버프 등 모조리 포함)  
 * 이것은 "추적"이 가능하게 설계되었고, 그래서 `Source`란 이름이 붙었다.
 * 
 * 이 효과는 이미 "적용된 것"으로 간주되어 `branch`, `gives`, `exclusive` 등이 없다.
 */
declare interface AttrSource {

  /**
   * (장비/카드/칭호/오라/무기아바타/봉인석/정수 아이템일 때) 아이템 이름  
   * (세트 효과일 때) "<세트 이름>[<세트 효과 발동에 필요한 갯수>]"  
   * (패시브/버프일 때) 스킬 이름  
   * (그 외) "길드"/"마력결정"/"아바타"  
   */
  name: string

  /** 내가 받을 효과 */
  attrs: BaseAttrs

}



/** 효과를 내는 것 중에서 "조건부"가 있는 것들  
 * 아이템 및 세트효과만 이에 해당한다.
 */
declare interface ComplexAttrSource extends AttrSource {

  /** (아이템 또는 세트일 때만) 특정 조건에서만(또는 던전에 입장했을 때만) 적용되는 효과 모음 */
  branch?: ConditionalNode[]

  /** (아이템/세트/스킬일 때만) "파티원에게" 적용되는 효과 모음  
   * ("파티원 기능"이 추가되면 파티원에게 장착시킬 수 있다) */
  gives?: ConditionalNode[]

  /** (아이템/세트일 때만) 특정 조건을 만족했을 때, 발동될 수 있는 킹능성 있는 모든 효과 모음 */
  exclusive?: ExclusiveSet[]
}



/** 공격 스킬의 공격 하나하나를 나타낸다. */
declare interface CustomSkillOneAttackSpec {
  /** 
   * 스킬 공격 세부 이름
   */
  name: string

  /** 스킬 계수 */
  value: number

  /** 스킬 고정값 (없으면 value와 같은 것으로 간주) */
  fixed?: number

  /**
   * 스증 적용 여부
   */
  isSkill?: boolean

  /** 타격 횟수 (없으면 1) */
  maxHit?: number

  /** 이 공격에만 적용되는 공격속성 */
  eltype?: Eltype[] | null | undefined
}



/** 스킬 레벨이 아직 정해지지 않은 스킬 공격 */
declare interface UnboundOneAttack {

  /** 스킬 공격 이름 */
  atName: string

  /** 스킬 계수 [%] */
  value: SkillValue

  /** 스킬 고정값 (없으면 value와 같은 것으로 간주) */
  fixed?: SkillValue

  /** 타격 횟수 (없으면 1) */
  maxHit?: number

  /** 이 공격에만 적용되는 공격속성 (쓰일 가능성 낮음) */
  eltype?: Eltype[] | null | undefined

}

/** 스킬레벨이 적용된 "찐" 스킬공격 */
declare interface RealOneAttack {

  /** 스킬 공격 이름 */
  atName: string

  /** 스킬 계수 [%] */
  value: number

  /** 스킬 고정값 (반드시 있다.) */
  fixed: number

  /** 실제로 지정한 타격 횟수 (반드시 있다.) */
  hit: number

  /** 이 공격에만 적용되는 공격속성 (쓰일 가능성 낮음) */
  eltype?: Eltype[] | null | undefined
}



/** 공격스킬 */
declare interface AttackSkill {
  /** 스킬 ID */
  id: number

  /** 스킬 이름 */
  name: string

  /** 이 스킬을 습득할 수 있는 레벨 */
  level: number

  /** 스킬 레벨을 1 올리기 위해 필요한 SP */
  point: number

  /** 스킬 쿨타임 [초] */
  cool: number

  /** 
   * 이 스킬에 달려있는 공격속성 (ex. 아수라, 엘마, 마도 등)  
   * === false이면 직업의 공격속성을 무효화하고, 무속성이 된다. (ex. 메카닉)  
   * == null 이면 각 직업의 공격속성을 따른다.  
   */
  eltype?: Eltype[] | false | null | undefined

  attacks: UnboundOneAttack[]

}


/** 패시브/버프 스킬 */
declare interface SelfSkill {

  /** 스킬 ID */
  id: number

  /** 스킬 이름 */
  name: string

  /** 스킬 습득만으로 적용되는 효과 */
  acquire?: UnboundBaseAttrs

  /** 스킬 습득만으로 파티원 모두에게 적용되는 효과 */
  acquireGives?: UnboundBaseAttrs

  /** 스킬 습득만으로 던전에서 적용되는 효과 */
  dungeon?: UnboundBaseAttrs

  /** 스킬 사용 시 자신에게 적용되는 효과 */
  buff?: UnboundBaseAttrs

  /** 스킬 사용 시 파티원 모두에게 적용되는 효과 */
  buffGives?: UnboundBaseAttrs

  /** 수치로 표현하기 어려운 효과, 또는 관심없는 효과 */
  misc?: string[]
  
}

