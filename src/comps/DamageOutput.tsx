import { AtypeAttrKey } from '../constants'
import { critChance, critFt, getElementalDamage, getPlainDamage } from '../damage'
import { useAppSelector } from '../feats/hooks'
import { selectClassAtype, selectDFClass } from '../feats/selector/baseSelectors'
import { selectAttr, selectFinalEltype } from '../feats/selector/selectors'
import { add } from '../utils'
import { Num } from './widgets/NumberView'

export function DamageOutput({ sk = false, crit = false, id = null }: { sk?: boolean, crit?: boolean | "mean", id?: string }) {
  const attrs = useAppSelector(selectAttr)
  const dfclass = useAppSelector(selectDFClass)
  const atype = useAppSelector(selectClassAtype)
  const eltype = useAppSelector(selectFinalEltype)
  let damage: number

  if (sk && !(eltype?.length > 0) && (dfclass.name === "엘레멘탈마스터" || dfclass.name === "마도학자"))
    damage = getElementalDamage(attrs)
  else 
    damage = getPlainDamage(atype, eltype, attrs)

  if (sk) {
    damage *= (1 + add(attrs["sk_inc"], attrs["sk_inc_sum"]) / 100)
  }
  if (crit) {
    const cdamage = damage * critFt(attrs["cdmg_inc"], attrs["catk_inc"])
    if (crit === "mean") {
      const {
        Crit: critKey, CritCh: critChKey,
      } = AtypeAttrKey[atype]
      const chance = critChance(attrs[critKey], attrs[critChKey])
      damage = ((1 - chance) * damage) + (chance * cdamage)
    } else {
      damage = cdamage
    }
  }
  return (
    <Num className={"AttrValue " + atype} value={damage} />
  )
}
