import { acceptEmblem } from "../../emblem";
import { useAppSelector } from "../../feats/hooks";
import { selectCard, selectEmblemSpecs, selectItem } from "../../feats/selector/equipSelectors";
import { getMaxEmblemCount, isCardable } from "../../items";
import { ItemName } from "../widgets/ItemNameView";
import { ItemIcon, EmblemIcon } from "../widgets/Icons";
import { selectSpell } from "../../feats/selector/cracksSelectors";
import { selectArtifact } from "../../feats/selector/creatureSelectors";
import { RootState } from "../../feats/store";



export function mainItemSelector(part: WholePart, index?: number | "Red" | "Green" | "Blue") {
  if (part === "정수") return selectSpell(index as number)
  if (part === "아티팩트") return selectArtifact(index as "Red"|"Green"|"Blue")
  return selectItem[part]
}

function selectCardGenerous(state: RootState, part: WholePart) {
  if (isCardable(part)) return selectCard[part](state)
  else return null
}

function selectEmblemSpecsGenerous(state: RootState, part: WholePart) {
  if (isCardable(part)) return selectEmblemSpecs[part](state)
  else return []
}



interface CurrentPartProps {
  part: WholePart;
  index?: number | "Red" | "Green" | "Blue";
}
export function CurrentPart({ part, index }: CurrentPartProps) {
  const mainitem = useAppSelector(mainItemSelector(part, index))
  const card = useAppSelector(state => selectCardGenerous(state, part))
  const emblems = useAppSelector(state => selectEmblemSpecsGenerous(state, part))
  const maxEmblem = getMaxEmblemCount(mainitem)
  const accept = acceptEmblem(part as EquipPart | "칭호")
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
  );
}
