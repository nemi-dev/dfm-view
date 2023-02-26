import { useAppDispatch, useAppSelector } from '../feats/hooks'
import { EmblemIcon, ItemIcon, ItemIcon2, ItemName } from './CommonUI'
import { useCallback, useContext } from 'react'
import { getAvatarAttr } from '../avatar'
import { SetAvatarType, SetAvatarTypeAll } from '../feats/slices/avatarSlice'
import { SimpleBaseAttrView } from './AttrsView'
import { ModalContext } from "./modalContext"
import { selectDFTitle, selectDFTitleCard, selectDFTitleEmblemSpec, selectRareAvatarCount, selectWeaponAvatar, selectAura, selectAvatarSetAttr, selectWholeAvatarAttrs } from '../feats/avatarSelectors'


export function DFTitle() {
  const { openModal } = useContext(ModalContext)
  const dftitle = useAppSelector(selectDFTitle)
  const card = useAppSelector(selectDFTitleCard)
  const emblem = useAppSelector(selectDFTitleEmblemSpec)[0]
  return (
    <div className="EquipSlot">
      <ItemIcon2 attrs={dftitle} onClick={() => openModal("칭호", "Equip")}/>
      <div className="SlotHeading">
        <ItemName item={dftitle} alt="칭호 없음" />
      </div>
      <div className="EquipCardEmblemUpgrade">
        <ItemIcon2 className="CardSocket" attrs={card} onClick={() => openModal("칭호", "Card")} />
        <EmblemIcon spec={emblem} accept={"Platinum"}
          onClick={() => openModal("칭호", "Emblem", 0)}
        />
      </div>
    </div>
  )
}
interface AvatarProps {
  part: AvatarPart
}

function AvatarPart({ part }: AvatarProps) {
  const rarity = useAppSelector(state => state.Avatar[part])
  const attrs = useAppSelector(state => getAvatarAttr(part, state.Avatar[part]))
  const dispatch = useAppDispatch()
  const onClick = useCallback(() => {
    const newValue = rarity === "Rare" ? "Uncommon" : "Rare"
    dispatch(SetAvatarType([part, newValue]))
  }, [rarity])
  return (
    <div className="AvatarPart" onClick={onClick}>
      <ItemIcon className="AvatarIcon" src={`/img/avatar/${rarity}/${part}.png`} frame={`/img/avatar/${rarity}/frame.png`} />
      <div className="SlotHeading">{rarity === "Rare" ? "레어" : "언커먼"} {part} 아바타</div>
      <div className="AvatarAttrs">
        <SimpleBaseAttrView attrs={attrs} />
      </div>
    </div>
  )
}


export function Avatars() {
  const { openModal } = useContext(ModalContext)
  const rareCount = useAppSelector(selectRareAvatarCount)
  const weaponAvatar = useAppSelector(selectWeaponAvatar)
  const aura = useAppSelector(selectAura)
  const dispatch = useAppDispatch()
  const setAll = useCallback(() => {
    dispatch(SetAvatarTypeAll("Rare"))
  }, [rareCount])
  return (
    <div className="Avatars">
      <h3 style={{ marginBlockEnd: 0 }}>칭호 + 아바타</h3>
      <h4 style={{ marginBlockStart: 0, textAlign: "center" }}>아바타 부위를 클릭해서 바꿀 수 있어요</h4>
      <div className="AvatarsGridBox">
        <DFTitle />
        <AvatarPart part="모자" />
        <AvatarPart part="얼굴" />
        <AvatarPart part="상의" />
        <AvatarPart part="목가슴" />
        <AvatarPart part="신발" />
        <AvatarPart part="머리" />
        <AvatarPart part="하의" />
        <AvatarPart part="허리" />
        <div className="AvatarPart">
          <ItemIcon2 className="AvatarIcon" attrs={weaponAvatar} onClick={() => openModal("무기아바타", "Equip")} />
          <div className="SlotHeading">{weaponAvatar.name}</div>
          <div className="AvatarAttrs">
            <SimpleBaseAttrView attrs={weaponAvatar} />
          </div>
        </div>
        <div className="AvatarPart">
          <ItemIcon2 className="AvatarIcon" attrs={aura} onClick={() => openModal("오라", "Equip")} />
          <div className="SlotHeading">{aura.name}</div>
          <div className="AvatarAttrs">
            <SimpleBaseAttrView attrs={aura} />
          </div>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        {rareCount < 8 ? <button onClick={setAll}>나 풀레압이야!</button> : null}
      </div>
      <div>
        <h4>아바타 세트 효과</h4>
        <SimpleBaseAttrView attrs={useAppSelector(selectAvatarSetAttr)} />
      </div>
      <div>
        <h3>칭호 + 아바타에서 오는 효과</h3>
        <SimpleBaseAttrView attrs={useAppSelector(selectWholeAvatarAttrs)}/>
      </div>
    </div>
  )
}
