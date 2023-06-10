import { useCallback, useContext } from 'react'

import { createSelector } from '@reduxjs/toolkit'

import { acceptEmblem } from '../emblem'
import { useAppDispatch, useAppSelector } from '../feats/hooks'
import { selectDFChar } from '../feats/selector/baseSelectors'
import {
  selectCard, selectCustomMaterial2, selectEmblemSpecs, selectMainItem, selectUpgradeValue
} from '../feats/selector/itemSelectors'
import {
    DecreaseMyEmblemLevel, SetMyArtifactValue, SetMyCreatureStat, SetMyMaterial, SetMyUpgradeValue
} from '../feats/slices/slicev5'
import { getMaxEmblemCount, isArmor, isCardable, isEquip } from '../items'
import { CardModalFragment } from './modals/CardModal'
import { EmblemModal } from './modals/EmblemModal'
import { ModalContext } from '../feats/contexts'
import { NumberInput } from './widgets/Forms'
import { EmblemIcon, ItemIcon } from './widgets/Icons'

const selectCreatureValue = createSelector(
  selectDFChar, my => my.creatureValues
)

interface EquipProps {
  part: EquipPart
}


interface UpgradeFlexProps {
  value: number
  setValue?: (v: number) => unknown
}
export function UpgradeFlex({ value, setValue }: UpgradeFlexProps) {
  if (!setValue) return null
  return (
    <div className="EquipUpgradeValue">
      +<NumberInput value={value} onChange={setValue} />
    </div>
  )
}

function UpgradeEquip({ part }: EquipProps) {
  const dispatch = useAppDispatch()
  const value = useAppSelector(state => selectUpgradeValue(state, undefined, part))
  return <UpgradeFlex value={value} setValue={v => dispatch(SetMyUpgradeValue([part, v]))} />
}

function UpgradeCreature() {
  const dispatch = useAppDispatch()
  const value = useAppSelector(state => selectCreatureValue(state).Creature)
  return <UpgradeFlex value={value} setValue={v => dispatch(SetMyCreatureStat(v))} />
}

export function Upgrade({ part }: PartProps) {
  if (isEquip(part)) {
    return <UpgradeEquip part={part} />
  } else if (part === "크리쳐") {
    return <UpgradeCreature />
  } else return null
}

export function ArtiUpgrade({ color }: { color: ArtifactColor }) {
  const dispatch = useAppDispatch()
  const value = useAppSelector(state => selectCreatureValue(state)[color])
  const setValue = useCallback((v: number) => {
    dispatch(SetMyArtifactValue([color, v]))
  }, [color])
  return <UpgradeFlex value={value} setValue={setValue}/>
}


interface PartProps {
  part: WholePart
}

export function ArmorMaterialSelect({ part }: PartProps) {
  if (!isArmor(part)) return null
  const dispatch = useAppDispatch()
  const item = useAppSelector(state => selectMainItem(state, undefined, part))
  const material = useAppSelector(state => selectCustomMaterial2(state, undefined, part))

  const materialFixed = item?.material
  if (!item || materialFixed) return null
  return (
    <select className="ArmorMaterialSelector" value={material}
      onChange={ev => dispatch(SetMyMaterial([part, ev.target.value as ArmorMaterial]))}>
      <option value="천">천</option>
      <option value="가죽">가죽</option>
      <option value="경갑">경갑</option>
      <option value="중갑">중갑</option>
      <option value="판금">판금</option>
    </select>
  )
}

export function CardSlot({ part }: PartProps) {
  if (!isCardable(part)) return null
  const { openModal } = useContext(ModalContext)
  const card = useAppSelector(state => selectCard(state, undefined, part))
  return (
    <ItemIcon className="Card" item={card}
        onClick={() => openModal(<CardModalFragment part={part} />)}
      />
  )
}


export function EmblemArray({ part }: PartProps) {
  if (!isCardable(part)) return null
  const { openModal } = useContext(ModalContext)
  const dispatch = useAppDispatch()
  const item = useAppSelector(state => selectMainItem(state, undefined, part))
  const emblems = useAppSelector(state => selectEmblemSpecs(state, undefined, part))
  const onItemClick = useCallback((index: number) => {
    if (part === "무기" || part === "보조장비" || part === "칭호")
      openModal(<EmblemModal part={part} index={index} />)
    else
      dispatch(DecreaseMyEmblemLevel([part, index]))
  }, [part])

  const accept = acceptEmblem(part)
  const maxEmblem = getMaxEmblemCount(item)
  return (
    <>
    {emblems.slice(0, maxEmblem).map((spec, index) => (
      <EmblemIcon key={index} spec={spec} accept={accept} onClick={() => onItemClick(index)} />
    ))}
    </>
  )
}
