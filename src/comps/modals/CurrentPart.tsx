import { acceptEmblem } from "../../emblem"
import { useAppSelector } from "../../feats/hooks"
import { selectCard2, selectEmblemSpecs2, selectItem2 } from "../../feats/selector/equipSelectors"
import { getMaxEmblemCount, isCardable } from "../../items"
import { ItemName } from "../widgets/ItemNameView"
import { ItemIcon, EmblemIcon } from "../widgets/Icons"
import { RootState } from "../../feats/store"


function selectCardGenerous(state: RootState, part: WholePart) {
  if (isCardable(part))  //return selectCard[part](state)
    return selectCard2(state, undefined, part)
  else return null
}

function selectEmblemSpecsGenerous(state: RootState, part: WholePart) {
  if (isCardable(part)) // return selectEmblemSpecs[part](state)
    return selectEmblemSpecs2(state, undefined, part)
  else return []
}



interface CurrentPartProps {
  sel: MainItemSelector
}


export function CurrentPart({ sel }: CurrentPartProps) {
  const part = typeof sel === "string" ? sel : sel.part
  const mainitem = useAppSelector(state => selectItem2(state, undefined, sel))
  const card = useAppSelector(state => selectCardGenerous(state, part))
  const emblems = useAppSelector(state => selectEmblemSpecsGenerous(state, part))
  const maxEmblem = getMaxEmblemCount(mainitem)
  const accept = acceptEmblem(part as CardablePart)
  return (
    <header>
      <div className="EquipSlot AlwaysEquipPartLayout CurrentPartItem">
        <ItemIcon item={mainitem} />
        <div className="SlotHeading">
          <ItemName item={mainitem} alt={`${part} 없음`} />
        </div>
        {(mainitem != null && isCardable(part)) ?
          <div className="PartAddons">
            <ItemIcon className="Card" item={card} />
            {emblems.slice(0, maxEmblem).map((spec, ix) => <EmblemIcon key={ix} spec={spec} accept={accept} />
            )}
          </div> : null}
      </div>
    </header>
  )
}
