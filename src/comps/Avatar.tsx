import { useAppDispatch, useAppSelector } from '../feats/hooks'
import { ItemName } from './CommonUI'
import { EmblemIcon, SquareIcon, ItemIcon } from "./widgets/Icons"
import { useCallback, useContext } from 'react'
import { getAvatarAttr } from '../avatar'
import { SetAvatarRarity, SetAvatarTypeAll } from '../feats/slices/avatarSlice'
import { SimpleBaseAttrView } from './AttrsView'
import { ModalContext } from "../modalContext"
import styled from 'styled-components'
import { PortraitMode } from '../responsiveContext'
import { selectAvatarSetAttr, selectCard, selectEmblemSpecs, selectItem, selectRareAvatarCount } from '../feats/selectors'


export function DFTitle() {
  const { openModal } = useContext(ModalContext)
  const dftitle = useAppSelector(selectItem["칭호"])
  const card = useAppSelector(selectCard["칭호"])
  const emblem = useAppSelector(selectEmblemSpecs["칭호"])[0]
  return (
    <div className="EquipSlot Hovering Bordered">
      <div className="AlwaysEquipPartLayout">
        <ItemIcon item={dftitle} onClick={() => openModal({name:"item", part: "칭호", target: "MainItem"})}/>
        <div className="SlotHeading">
          <ItemName item={dftitle} alt="칭호 없음" />
        </div>
        <div className="EquipAddons">
          <ItemIcon className="Card" item={card} onClick={() => openModal({name:"item", part: "칭호", target: "Card"})} />
          <EmblemIcon spec={emblem} accept={"Platinum"}
            onClick={() => openModal({name:"item", part: "칭호", target: "Emblem", index:0})}
          />
        </div>
      </div>
      <div>
        <SimpleBaseAttrView attrs={dftitle} />
      </div>
    </div>
  )
}
interface AvatarProps {
  part: WearAvatarPart
}

const AvatarPartLayout = styled.div`
  display: grid;
  grid-template-areas: 
  "icon heading"
  "icon attrs"
  ;

  grid-template-rows: auto 1fr;
  grid-template-columns: auto 1fr;

  .AvatarIcon {
    grid-area: icon;
  }

  .SlotHeading {
    grid-area: heading;
  }

  .AvatarAttrs {
    grid-area: attrs;
  }
`

function AvatarPart({ part }: AvatarProps) {
  const rarity = useAppSelector(state => state.Avatar[part])
  const attrs = useAppSelector(state => getAvatarAttr(part, state.Avatar[part]))
  const dispatch = useAppDispatch()
  const onClick = useCallback(() => {
    const newValue = rarity === "Rare" ? "Uncommon" : "Rare"
    dispatch(SetAvatarRarity([part, newValue]))
  }, [rarity])
  return (
    <AvatarPartLayout className="AvatarPart Hovering Bordered" onClick={onClick}>
      <SquareIcon className="AvatarIcon" src={`/img/avatar/${rarity}/${part}.png`} frame={`/img/avatar/${rarity}/frame.png`} />
      <div className="SlotHeading">{rarity === "Rare" ? "레어" : "언커먼"} {part} 아바타</div>
      <div className="AvatarAttrs">
        <SimpleBaseAttrView attrs={attrs} />
      </div>
    </AvatarPartLayout>
  )
}


function AvatarPartCompact({ part }: AvatarProps) {
  const rarity = useAppSelector(state => state.Avatar[part])
  const dispatch = useAppDispatch()
  const onClick = useCallback(() => {
    const newValue = rarity === "Rare" ? "Uncommon" : "Rare"
    dispatch(SetAvatarRarity([part, newValue]))
  }, [rarity])
  return (
    <div onClick={onClick}>
      <SquareIcon className="AvatarIcon" src={`/img/avatar/${rarity}/${part}.png`} frame={`/img/avatar/${rarity}/frame.png`} />
    </div>
  )
}

const AvatarsFirstLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;

  > :first-child {
    grid-area: 1 / 1 / 2 / 3
  }

  @media (max-width: 999px) {
    display: flex;
    flex-direction: column;
    align-items: normal;
  }
`

const AvatarsSecondLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(4, auto);
  grid-auto-flow: column;
  gap: 2px;
  @media (max-width: 999px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-auto-flow: row;
    justify-items: center;
  }
`


export function Avatars() {
  const { openModal } = useContext(ModalContext)
  const rareCount = useAppSelector(selectRareAvatarCount)
  const weaponAvatar = useAppSelector(selectItem["무기아바타"])
  const aura = useAppSelector(selectItem["오라"])
  const dispatch = useAppDispatch()
  const portrait = useContext(PortraitMode)
  const AvatarPartComp = portrait? AvatarPartCompact : AvatarPart
  const setAll = useCallback(() => {
    dispatch(SetAvatarTypeAll("Rare"))
  }, [rareCount])
  return (
    <div className="Avatars">
      <header>
        <h3>칭호 + 아바타</h3>
        <h4>아바타 부위를 클릭해서 바꿀 수 있어요</h4>
      </header>
      <AvatarsFirstLayout className="AvatarsGridBox">
        <DFTitle />
        <div className="EquipSlot AlwaysEquipPartLayout Hovering Bordered">
          <ItemIcon className="AvatarIcon" item={weaponAvatar}
          onClick={() => openModal({name:"item", part:"무기아바타", target:"MainItem"})} />
          <div className="SlotHeading">{weaponAvatar.name}</div>
          <div className="AvatarAttrs">
            <SimpleBaseAttrView attrs={weaponAvatar} />
          </div>
        </div>
        <div className="EquipSlot AlwaysEquipPartLayout Hovering Bordered">
          <ItemIcon className="AvatarIcon" item={aura}
          onClick={() => openModal({name:"item", part:"오라", target:"MainItem"})} />
          <div className="SlotHeading">{aura.name}</div>
          <div className="AvatarAttrs">
            <SimpleBaseAttrView attrs={aura} />
          </div>
        </div>
      </AvatarsFirstLayout>
      <AvatarsSecondLayout>
        <AvatarPartComp part="모자" />
        <AvatarPartComp part="얼굴" />
        <AvatarPartComp part="상의" />
        <AvatarPartComp part="목가슴" />
        <AvatarPartComp part="신발" />
        <AvatarPartComp part="머리" />
        <AvatarPartComp part="하의" />
        <AvatarPartComp part="허리" />
      </AvatarsSecondLayout>
      <div style={{ textAlign: "center" }}>
        {rareCount < 8 ? <button onClick={setAll}>레압풀셋 착용하기</button> : null}
      </div>
      <div>
        <h4>아바타 세트 효과</h4>
        <SimpleBaseAttrView attrs={useAppSelector(selectAvatarSetAttr)} />
      </div>
    </div>
  )
}
