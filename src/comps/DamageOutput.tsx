import { useAppSelector } from "../feats/hooks"
import { selectMyAttr, selectMyFinalEltype } from "../feats/selector/selectors"
import { AtypeAttrKey } from "../constants"
import { selectClassAtype } from "../feats/selector/selfSelectors"
import { Num } from "./widgets/NumberView"
import { critChance, critFt, getPlainDamage } from "../damage"
import { add } from "../utils"


export function DamageOutput({ sk = false, crit = false }: { sk?: boolean, crit?: boolean | "mean" }) {
  const attrs = useAppSelector(selectMyAttr)
  const atype = useAppSelector(selectClassAtype)
  const eltype = useAppSelector(selectMyFinalEltype)

  let damage = getPlainDamage(atype, eltype, attrs)
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
