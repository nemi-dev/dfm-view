import { useAppSelector } from "../feats/hooks"
import { selectMyAttr, selectMyFinalEltype } from "../feats/selector/selectors"
import { AtypeAttrKey } from "../constants"
import { selectClassAtype, selectMyDFClass } from "../feats/selector/selfSelectors"
import { Num } from "./widgets/NumberView"
import { critChance, critFt, getElementalDamage, getPlainDamage } from "../damage"
import { add } from "../utils"


export function DamageOutput({ sk = false, crit = false, id = null }: { sk?: boolean, crit?: boolean | "mean", id?: string }) {
  const attrs = useAppSelector(selectMyAttr)
  const dfclass = useAppSelector(selectMyDFClass)
  const atype = useAppSelector(selectClassAtype)
  const eltype = useAppSelector(selectMyFinalEltype)
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
