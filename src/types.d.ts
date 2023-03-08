declare type NumberZ = number | ""

declare type Atype = "Physc" | "Magic"
declare type Rarity = "Common" | "Uncommon" | "Rare" | "Unique" | "Epic"
declare type Eltype = "Fire" | "Ice" | "Light" | "Dark"

declare type WeaponType = 
"소검"|"도"|"둔기"|"대검"|"광검"
|"너클"|"건틀릿"|"클로"|"권투글러브"|"통파"
|"리볼버"|"자동권총"|"머스켓"|"핸드캐넌"|"보우건"
|"창"|"봉"|"로드"|"스탭"|"빗자루"
|"십자가"|"염주"|"토템"|"낫"|"배틀액스"
|"락소드"|"윙블레이드"

declare type Itype = WeaponType
|"상의"|"하의"|"머리어깨"|"벨트"|"신발"|"목걸이"|"팔찌"|"반지"|"보조장비"|"카드"|"칭호"|"봉인석"|"정수"|"오라"|"무기아바타"

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

declare type ArmorMaterial = "천" | "가죽" | "경갑" | "중갑" | "판금"





declare type WholePart = EquipPart | "칭호" | "오라" | "무기아바타" | "봉인석" | "정수"
declare type WearAvatarPart = "모자" | "얼굴" | "상의" | "목가슴" | "신발" | "머리" | "하의" | "허리"

declare type MagicPropsCareAbout = "dmg_inc" | "Stat" | "Atk" | "el_fire" | "el_ice" | "el_lght" | "el_dark"
| "Crit" | "speed_atk" | "Accu" | null


declare type EmblemLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

declare type EmblemType = "Red" | "Yellow" | "Green" | "Blue" | "Stren" | "Intel" | "Fire" | "Ice" | "Light" | "Dark"

declare type EmblemSpec = [EmblemType, EmblemLevel]




declare interface When {
  /** (branch, exclusive에서) 이 효과가 추가될 조건  */
  when?: string
}

declare type ExclusiveGroup = {
  name: string
  label: string
  children: WhenCombinedAttrs[]

}

declare type Attrs = BaseAttrs & {
  /** 특정 조건에만 적용되는 효과 */
  branch?: WhenCombinedAttrs[]

  /** 모든 파티원에게 적용되는 효과 */
  gives?: BaseAttrs & When

  /** 이 중에서 동시에 하나의 효과만 적용된다. */
  exclusive?: ExclusiveGroup[]
  
}

declare type WhenCombinedAttrs = BaseAttrs & When


declare interface BaseAttrs {

  /** 아이템/세트/스킬/버프 이름 */
  name?: string

  /** 아이콘 이름 */
  image?: string

  /** 아이템 아이콘 오버레이 이름 */
  overlay?: string

  /** 아이템 레벨 */
  level?: number

  /** 아이템 종류 */
  itype?: Itype

  /** 레어도 */
  rarity?: Rarity

  /** (방어구일 때만) 재질 */
  material?: ArmorMaterial

  /** 이 아이템으로 활성화시킬 수 있는 세트 [ex) 에픽 환영극단, 개막/종막] */
  setOf?: string | string[]




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

  /** 크리티컬 데미지 증가 (%) */
  cdmg_inc?: number

  /** 추가 데미지 (%) */
  dmg_add?: number

  /** 속성 부여 */
  eltype?: Eltype | Eltype[]

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

  /** 스킬 공격력 증가 (%) */
  sk_inc?: number

  /** 단리 적용되는 (ex. 패시브 스킬) 스킬 공격력 증가 (%) */
  sk_inc_sum?: number

  /** 특정 스킬 공격력 증가 */
  sk_val?: { [k: string]: number }

  /** 특정 스킬의 1회당 "타격 횟수" 증가/감소 */
  sk_hit?: { [k: string]: number }

  /** 특정 스킬 레벨 증가 */
  sk_lv?: { [k: string]: number }

  /** 특정 스킬의 "지속시간" 증가/감소 (%) */
  sk_dur?: { [k: string]: number }

  /** 특정 스킬 쿨타임 감소/증가 (%) */
  sk_cool?: { [k: string]: number }

  /** 적 방어력 변화 (내가 공격한 적 + 방어 감소 오라 모두 포함) */
  target_def?: number

  /** 적 속성저항 변화 (모든속성) */
  target_res?: number

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

  /** 최대 중첩 횟수 */
  maxRepeat?: number

  /** 기타 관심없는 효과 */
  misc?: string[]

}
declare interface ISet {
  name: string
  children?: string[]
  [icount: number]: Attrs
}

declare interface Card extends BaseAttrs {
  part: CardablePart[]
}


declare interface SkillOneAttackSpec {
  name: string
  value: number
  fixed: number  
  isSkill: boolean 
}


declare interface DFClass {
  name: string
  atype: Atype
  weapons: WeaponType[]
  attrs?: BaseAttrs
}


declare interface OneAttrTripletProps {
  className?: string
  name?: string | JSX.Element
  aKey: any
  percent?: boolean
  signed?: boolean
}
