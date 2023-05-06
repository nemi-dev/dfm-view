import { useCallback, useContext, useState } from "react"
import { useAppDispatch } from "../../feats/hooks"
import { getCardsForPart } from "../../items"
import { ItemName } from "../widgets/ItemNameView"
import { ItemIcon } from "../widgets/Icons"
import { ModalContext } from "./modalContext"
import { SetCard, SetCardsAllPossible } from "../../feats/slices/itemSlice"
import styled from "styled-components"
import { LabeledSwitch } from "../widgets/Forms"
import { CurrentPart } from "./CurrentPart"



const CheckieInline = styled(LabeledSwitch)`
  display: inline-flex;
`

function CardSelect({ part, card, all }: { part: CardablePart, card: DFItem, all: boolean }) {
  const { closeModal } = useContext(ModalContext)
  const dispatch = useAppDispatch()
  const onClick = useCallback(() => {
    if (all) dispatch(SetCardsAllPossible(card.name))
    else dispatch(SetCard([part, card.name]))
    closeModal()
  }, [part, card.name, all])
  return (
    <div className="ModalItemSelect" onClick={onClick}>
      <ItemIcon item={card} />
      <ItemName item={card} className="ItemNameResponsive" />
    </div>
  )
}


export function CardModalFragment({ part }: { part: CardablePart }) {
  const items = getCardsForPart(part)
  const [all, setAll] = useState(false)
  return (
    <>
    <h3>카드</h3>
    <CurrentPart part={part} index={0} />
    <div className="ModalMenuScrollable">
      <header>
        <CheckieInline label="선택한 카드를 가능한 모든 부위에 바르기" checked={all} onChange={setAll} />
      </header>
      <div className="ItemSelectArray">
        {items.map((card) => (
          <CardSelect key={card.name} part={part} card={card} all={all} />
        ))}
      </div>
    </div>
    </>
  )
}
