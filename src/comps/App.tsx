import { useCallback, useContext, useEffect, useState } from 'react'
import '../style/App.scss'
import '../style/Misc.scss'

import { getDefRate } from '../damage'
import {
  set_atk_fixed,
  SetLevel,
  SetTargetDefense,
  SetAchieveLevel,
  SetTragetResist,
  SetAtype
} from '../feats/slice'
import { LabeledInput, OutputView, RadioGroup } from './CommonUI'
import { Equips } from './Equips'
import { Creatures } from './Creature'
import { Guilds } from "./Guilds"
import { Cracks } from "./Cracks"
import { Tonic } from "./Tonic"
import { Avatars } from "./Avatar"
import { useAppDispatch, useAppSelector } from '../feats/hooks'
import { TabContext } from '../responsiveContext'
import { ItemSelectModal } from './Modal'
import { ModalContext } from "./modalContext"
import { VerboseAttrsView } from './VerboseAttrsView'
import { Calibrate } from './Calibrate'
import { SkillTestSet } from './SkillTestSet'


function NavLink({ name, children }: React.PropsWithChildren<{ name: string }> ) {
  const { activeTab, setActiveTab } = useContext(TabContext)
  const className = name === activeTab? "NavLink Active" : "NavLink"

  const onClick = useCallback(()=>{
    setActiveTab(name)
  }, [])
  return (
    <span className={className} onClick={onClick}>{children}</span>
  )
}

function Tab({ name, children }: React.PropsWithChildren<{ name: string }> ) {
  const { activeTab } = useContext(TabContext)
  return name === activeTab ? (children as JSX.Element) : null
}


function App() {

  const dispatch = useAppDispatch()
  const
    my_level = useAppSelector(state => state.Profile.level),
    AchieveLevel = useAppSelector(state => state.Profile.achieveLevel),
    atk_fixed = useAppSelector(state => state.Profile.atk_fixed)

  const [portrait, setPortrait] = useState(false)
  const [activeTab, setActiveTab] = useState("장비")


  const [isOpen, setOpen] = useState(false)
  const [itarget, setItarget] = useState<[WholePart, ModalTargetSelector, number]>(["무기", "Equip", 0])

  const openModal = useCallback((part: WholePart, target: ModalTargetSelector, position: number) => {
    setItarget([part, target, position])
    setOpen(true)
    navigator.vibrate(10)
  }, [])

  const modalContextValue = { isOpen, setOpen, itarget, openModal }
  

  useEffect(() => {
    function onResize(ev: UIEvent) {
      if (window.innerWidth >= 769) setPortrait(false)
      else setPortrait(true)
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('reset', onResize)
  })


  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
    <ModalContext.Provider value={modalContextValue}>

      <div className="App">
        <ItemSelectModal isOpen={isOpen}/>
        <div className="Duplex">
          <LabeledInput label="캐릭터 레벨" value={my_level} onChange={v => dispatch(SetLevel(v))} />
          <LabeledInput label="독립 공격력" value={atk_fixed} onChange={v => dispatch(set_atk_fixed(v))} />
          <LabeledInput label="캐릭터 업적 달성 레벨" value={AchieveLevel} onChange={v => dispatch(SetAchieveLevel(v))} />
          <OutputView tag="업적 달성 보너스: 모든스탯 증가" value={AchieveLevel * 7 - 2} />

        </div>
        <nav className="Navigator">
          <NavLink name="장비">장비</NavLink>
          <NavLink name="아바타">칭호/아바타</NavLink>
          <NavLink name="크리쳐">크리쳐</NavLink>
          <NavLink name="마력결정">마력 결정</NavLink>
          <NavLink name="봉인석">성안의 봉인</NavLink>
          <NavLink name="길드">길드 버프</NavLink>
          <NavLink name="조정">스탯 조정</NavLink>
        </nav>
        <Tab name="장비"><Equips /></Tab>
        <Tab name="아바타"><Avatars /></Tab>
        <Tab name="크리쳐"><Creatures /></Tab>
        <Tab name="마력결정"><Tonic /></Tab>
        <Tab name="봉인석"><Cracks /></Tab>
        <Tab name="길드"><Guilds /></Tab>
        <Tab name="조정"><Calibrate /></Tab>
        <VerboseAttrsView />
        <SkillTestSet />
      </div>
    </ModalContext.Provider>
    </TabContext.Provider>
  )
}

export default App
