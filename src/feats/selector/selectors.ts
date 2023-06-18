import { createSelector } from '@reduxjs/toolkit'

import { applyAddMaxEldmg, atx, combine, dualTrigger, whatElType } from '../../attrs'
import { AtypeAttrKey } from '../../constants'
import { critChance, critFt, defRate, getElementalDamage, getPlainDamage, getRealdef } from '../../damage'
import { CombineItems, createActiveCondyces, getActiveISetsFromPartSources, partsWithMainItem } from '../../items'
import { add } from '../../utils'
import {
  selectAchBonus, selectCaliSource, selectClassAtype, selectDFChar, selectChoice, selectDFClass, selectLevel
} from './baseSelectors'
import { partExposer } from './itemSelectors'
import { selectGuilds } from './guildSelectors'

import type { RootState } from "../store"
import { avatarParts, makeAvatarSet, rareSet, uncommonSet, getAvatarAttr } from '../../avatar'
import { getPartSource } from '../dfchar'


/** 마력결정 스탯보너스를 모두 얻는다. */
export function selectTonics(state: RootState): AttrSource {
  const { el_all, hpmax, mpmax, strn_intl, vit_psi, def_ph, def_mg, Crit, Accu } = state.Tonic

  return {
    name: "마력결정",
    attrs: {
      strn: strn_intl,
      intl: strn_intl,
      vit: vit_psi,
      psi: vit_psi,
      Accu,
      ...atx("Crit", Crit),
      ...atx("El", el_all),
      def_ph,
      def_mg,
      hpmax,
      mpmax
    }
  }
}

/** 지금 착용중인 레어 아바타의 수를 선택한다. */
export const selectRareAvatarCount = createSelector(
  selectDFChar,
  (dfchar) => avatarParts
    .map(part => dfchar.avatars[part])
    .reduce((n, rarity) => rarity === "Rare" ? n + 1 : n, 0)
)

/** 지금 착용중인 언커먼 아바타의 수를 선택한다. */
export const selectUncommonAvatarCount = createSelector(
  selectDFChar,
  (dfchar) => avatarParts
    .map(part => dfchar.avatars[part])
    .reduce((n, rarity) => rarity === "Uncommon" ? n + 1 : n, 0)
)


/** "아바타" 부분을 선택한다. */
export const selectWearAvatarSource = createSelector(
  selectDFChar,
  selectRareAvatarCount,
  selectUncommonAvatarCount,
  (dfchar, rareCount, uncommonCount) => {
    const rareSets = makeAvatarSet(rareSet, "레어아바타 세트")(rareCount)
    const uncommonSets = makeAvatarSet(uncommonSet, "상급아바타 세트")(uncommonCount)
    return [
      {
        name: "아바타",
        attrs: combine(...avatarParts.map(p => getAvatarAttr(p, dfchar.avatars[p])))
      },
      rareSets,
      uncommonSets
    ]
  }
)

export function expandSource(source: PartSourceSet) {
  if (!source) return []
  const { item, card, emblems = [], magicProps, upgrade, spells = [], blessing, artifacts = [], artifactProps = [] } = source
  const a = [ item, upgrade, card, magicProps, ...emblems, ...artifacts, ...artifactProps, ...spells, blessing ]
  return a.filter(v => v != null)
}


/** 10장비의 모든 아이템+강화+카드+엠블렘+마법봉인 효과를 선택한다. */
export const selectPartSource = createSelector(
  selectDFChar,
  partExposer<EquipPart | "칭호" | "오라" | "무기아바타" | "크리쳐" | "봉인석">(),
  (dfchar, part) => getPartSource(dfchar, part)
)

/** 
 * 내 캐릭터의, "10장비 + 칭호 + 오라 + 무기아바타 + 크리쳐 + 아티팩트 + 성안의 봉인" 내에서 활성화된 세트효과를 선택한다.
 * (정말 이상한 게 생긴다면, 이를테면 무기 + 상의 아바타 세트 등이 생긴다면 그건 적용되지 않는다.)
 */
export const selectActiveISets = createSelector(
  (state: RootState, id: RootState["currentID"] = undefined) => partsWithMainItem.map(m => selectPartSource(state, id, m)),
  (mainSources) => {
    const isets = getActiveISetsFromPartSources(...mainSources)
    return isets
  }
)


/** 
 * 오체분시된 소스를 선택한다.  
 * 
 * 직업 + 장비 + 아바타 + 크리쳐 + 마력결정 + 성안의봉인 + 길드 + 업적보너스 + 보정값  
 */
export const selectExpandedSources = createSelector(
  selectDFClass,
  (state: RootState, id: RootState["currentID"] = undefined) => partsWithMainItem.map(m => selectPartSource(state, id, m)),
  selectActiveISets,
  selectWearAvatarSource,
  selectTonics,
  selectGuilds,
  selectAchBonus,
  selectCaliSource,
  (dfc, mainSources, isets, wears, tonic, guild, ach, cal) => {
    const z: AttrSource[] = [
      dfc,
      ach,
      ...mainSources.flatMap(s => expandSource(s)),
      ...isets,
      ...wears,
      tonic,
      guild,
      cal,
    ]
    return z
  }
)


/** 
 * 마을에서 내 스탯을 선택한다.  
 * **듀얼트리거/최대 속성강화 추가데미지가 포함되었다면 여기서 적용된다.**
*/
export const selectAttrTown = createSelector(
  selectExpandedSources,
  (sources) => {
    const a = CombineItems(sources)
    return applyAddMaxEldmg(dualTrigger(a))
  }
)

/** 
 * 던전에서 내 스탯을 선택한다. (조건부옵션이 명시적으로 포함됨)  
 * **듀얼트리거/최대 속성강화 추가데미지가 포함되었다면 여기서 적용된다.**
*/
export const selectAttr = createSelector(
  selectExpandedSources,
  selectChoice,
  (sources, choice) => {
    const a = CombineItems(sources, choice)
    return applyAddMaxEldmg(dualTrigger(a))
  }
)

/** 던전에서 내 크리티컬 확률을 선택한다. */
export const selectCritChance = createSelector(
  selectAttr,
  selectClassAtype,
  (attrs, atype) => {
    const { Crit, CritCh } = AtypeAttrKey[atype]
    return critChance(attrs[Crit], attrs[CritCh])
  }
)

/** 던전에서 내 원소 공격속성을 선택한다. */
export const selectFinalEltype = createSelector(
  selectAttr,
  whatElType
)

/** 캐릭터 선택창에서 보일 데미지를 선택한다. */
export const selectExpressionDamage = createSelector(
  selectClassAtype,
  selectDFClass,
  selectAttr,
  selectFinalEltype,
  (atype, dfcl, attrs, eltypes) => {
    const {
      Crit: critKey, CritCh: critChKey,
    } = AtypeAttrKey[atype]
    const chance = critChance(attrs[critKey], attrs[critChKey])
    let damage = (eltypes.length == 0 && (dfcl.name == "엘레멘탈마스터" || dfcl.name == "마도학자"))?
    getElementalDamage(attrs) : getPlainDamage(atype, eltypes, attrs)

    damage *= (1 + add(attrs["sk_inc"], attrs["sk_inc_sum"]) / 100)
    const cdamage = damage * critFt(attrs["cdmg_inc"], attrs["catk_inc"])

    return ((1 - chance) * damage) + (chance * cdamage)
  }
)


/** 내가 입력한 적 방어력을 선택한다. */
export function selectBaseEnemyDefense(state: RootState) {
  return state.EnemyTarget.Defense
}

/** 내가 입력한 적 속성저항을 선택한다. */
export function selectBaseEnemyElRes(state: RootState) {
  return state.EnemyTarget.ElRes
}

/** 방깎 적용후 적 방어력을 선택한다 */
export const selectEnemyDefense = createSelector(
  selectAttr,
  selectBaseEnemyDefense,
  (attrs = {}, def) => {
    const { target_def = 0, DefBreak = 0 } = attrs
    return getRealdef(def, target_def, DefBreak)
  }
)

/** 속깎 적용후 적 속성저항을 선택한다 */
export const selectEnemyElRes = createSelector(
  selectAttr,
  selectBaseEnemyElRes,
  (attrs, res) => {
    const { target_res = 0 } = attrs
    return Math.max(res + target_res, 0)
  }
)

/** 현재 상태의 내 레벨과 적 방어력(방깎적용)으로부터 방어율을 계산한다. */
export const selectEnemyDefRate = createSelector(
  selectLevel,
  selectEnemyDefense,
  defRate
)
