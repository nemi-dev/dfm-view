
/** 패시브/버프 스킬 효과 (스킬레벨 미지정) */
declare interface UnboundBaseAttrs {
  /** 힘 */ 
  strn: SkillValue

  /** 지능 */ 
  intl: SkillValue

  /** 체력 */ 
  vit: SkillValue

  /** 정신력 */ 
  psi: SkillValue

  /** 힘 증가 (%) */ 
  str_inc: SkillValue

  /** 지능 증가 (%) */ 
  int_inc: SkillValue

  /** 물리 공격력 */ 
  atk_ph: SkillValue

  /** 마법 공격력 */ 
  atk_mg: SkillValue

  /** 물리 공격력 증가 (%) */ 
  atk_ph_inc: SkillValue

  /** 마법 공격력 증가 (%) */ 
  atk_mg_inc: SkillValue

  /** 물리 크리티컬 */ 
  crit_ph: SkillValue

  /** 마법 크리티컬 */ 
  crit_mg: SkillValue

  /** 물리 크리티컬 확률 증가 (%) */ 
  crit_ph_pct: SkillValue

  /** 마법 크리티컬 확률 증가 (%) */ 
  crit_mg_pct: SkillValue

  /** 데미지 증가 (%) */ 
  dmg_inc: SkillValue

  /** 크리티컬 데미지 증가 (%) */ 
  cdmg_inc: SkillValue

  /** 크리티컬 공격력 증가 (%, 버서커/이단심판관 등) */ 
  catk_inc: SkillValue

  /** 추가 데미지 (%) */ 
  dmg_add: SkillValue

  /** 화속성 강화 */ 
  el_fire: SkillValue

  /** 수속성 강화 */ 
  el_ice: SkillValue

  /** 명속성 강화 */ 
  el_lght: SkillValue

  /** 암속성 강화 */ 
  el_dark: SkillValue

  /** 화속성 추가 데미지 (%) */ 
  eldmg_fire: SkillValue

  /** 수속성 추가 데미지 (%) */ 
  eldmg_ice: SkillValue

  /** 명속성 추가 데미지 (%) */ 
  eldmg_lght: SkillValue

  /** 암속성 추가 데미지 (%) */ 
  eldmg_dark: SkillValue

  /** 스킬 공격력 증가 (%) */ 
  sk_inc: SkillValue

  /** 단리 적용되는 (ex. 패시브 스킬) 스킬 공격력 증가 (%) */ 
  sk_inc_sum: SkillValue

  /** 적 방어력 변화 (내가 공격한 적 + 방어 감소 오라 모두 포함) */ 
  target_def: SkillValue

  /** 적 속성저항 변화 (모든속성) */ 
  target_res: SkillValue

  /** 적 방어력 변화 (%) */ 
  DefBreak: SkillValue

  /** 공격 속도 +X% */ 
  speed_atk: SkillValue

  /** 캐스팅 속도 +X% */ 
  speed_cast: SkillValue

  /** 이동 속도 +X% */ 
  speed_move: SkillValue

  /** 적중 */ 
  Accu: SkillValue

  /** 적중 확률 증가 (%) */ 
  AccuPct: SkillValue

  /** HP MAX (실적용 제외) */ 
  hpmax: SkillValue

  /** MP MAX (실적용 제외) */ 
  mpmax: SkillValue

  /** 물리 방어력 */ 
  def_ph: SkillValue

  /** 마법 방어력 */ 
  def_mg: SkillValue

  /** 물리 방어력 (%) */ 
  def_ph_pct: SkillValue

  /** 마법 방어력 (%) */ 
  def_mg_pct: SkillValue

  /** 화속성 저항 */ 
  res_fire: SkillValue

  /** 수속성 저항 */ 
  res_ice: SkillValue

  /** 명속성 저항 */ 
  res_lght: SkillValue

  /** 암속성 저항"  */ 
  res_dark: SkillValue

}
