import { useCallback, useContext } from 'react'
import styled from 'styled-components'

import { useAppDispatch, useAppSelector } from '../feats/hooks'
import { selectRareAvatarCount, selectUncommonAvatarCount } from '../feats/selector/avatarSelectors'
import { SetMyAvatarRarity, SetMyAvatarRarityAll } from '../feats/slices/slicev5'
import { PortraitMode } from '../responsiveContext'
import { SquareIcon } from './widgets/Icons'
import { RootState } from '../feats/store'

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

`

function selectMyAvatar(state: RootState, part: WearAvatarPart) {
  return state.SavedChars.byID[state.currentID].avatars[part]
}

function WearAvatarPart({ part }: AvatarProps) {
  const dispatch = useAppDispatch()
  const rarity = useAppSelector(state => selectMyAvatar(state, part))
  const onClick = useCallback(() => {
    const newValue = rarity === "Rare" ? "Uncommon" : "Rare"
    dispatch(SetMyAvatarRarity([part, newValue]))
  }, [rarity])
  return (
    <AvatarPartLayout className="AvatarPart Hovering Bordered" onClick={onClick}>
      <SquareIcon className="AvatarIcon" src={`/img/avatar/${rarity}/${part}.png`} frame={`/img/avatar/${rarity}/frame.png`} />
      <div className={`SlotHeading Rarity_${rarity}`}>{rarity === "Rare" ? "레어" : "상급"} {part}</div>
    </AvatarPartLayout>
  )
}


function WearAvatarPartCompact({ part }: AvatarProps) {
  const rarity = useAppSelector(state => selectMyAvatar(state, part))
  const dispatch = useAppDispatch()
  const onClick = useCallback(() => {
    const newValue = rarity === "Rare" ? "Uncommon" : "Rare"
    dispatch(SetMyAvatarRarity([part, newValue]))
  }, [rarity])
  return (
    <div onClick={onClick}>
      <SquareIcon className="AvatarIcon" src={`/img/avatar/${rarity}/${part}.png`} frame={`/img/avatar/${rarity}/frame.png`} />
    </div>
  )
}


const AvatarsSecondLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(4, auto);
  grid-auto-flow: column;
  gap: 2px;
  @media (max-width: 999px) {
    .AvatarIcon {
      --icon-size: 45px;
    }
    display: flex;
    flex-direction: row;
    gap: 0;
    align-items: center;
    justify-content: space-evenly;
  }
`


export function Avatars() {
  const rareCount = useAppSelector(selectRareAvatarCount)
  const uncommonCount = useAppSelector(selectUncommonAvatarCount)
  const dispatch = useAppDispatch()
  const portrait = useContext(PortraitMode)
  const setAll = useCallback((rarity: "Uncommon" | "Rare") => {
    dispatch(SetMyAvatarRarityAll(rarity))
  }, [rareCount])
  const AvatarPartComp = portrait? WearAvatarPartCompact : WearAvatarPart
  return (
    <div className="Avatars">
      <header>
        <h3>아바타</h3>
        <h4>아바타 부위를 클릭해서 바꿀 수 있어요</h4>
      </header>
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
        {rareCount < 8 ? <button onClick={() => setAll("Rare")}>레압 풀셋으로</button> : null}
        {uncommonCount < 8 ? <button onClick={() => setAll("Uncommon")}>상급압 풀셋으로</button> : null}
      </div>
    </div>
  )
}
