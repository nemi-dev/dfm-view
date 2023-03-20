import '../style/Common.scss'
import '../style/App.scss'
import '../style/Misc.scss'

import { useCallback, useContext, useEffect, useState } from 'react'
import { Equips } from './Equips'
import { Forge } from './Forge'
import { Creatures } from './Creature'
import { Guilds } from "./Guilds"
import { Cracks } from "./Cracks"
import { Tonic } from "./Tonic"
import { Avatars } from "./Avatar"
import { PortraitMode, TabContext } from '../responsiveContext'
import AppModal from './modals/index'
import { ModalContext, ModalContextType } from "../modalContext"
import { MyStat } from './MyStat'
import { SkillTestSet } from './CustomSkill'
import { StickyNav } from './StickyNav'
import { EnemyTarget } from './EnemyTarget'
import { useAppDispatch, useAppSelector } from '../feats/hooks'
import { InitChar } from '../feats/saveReducers'
import store from '../feats/store'


function NavLink({ name, children }: React.PropsWithChildren<{ name: string }> ) {
  const { activeTab, setActiveTab } = useContext(TabContext)
  const className = name === activeTab? "NavLink Active" : "NavLink"  

  const onClick = useCallback(()=>{
    setActiveTab(name)
  }, [name])
  return (
    <span className={className} onClick={onClick}>{children}</span>
  )
}

function Tab({ name, children }: React.PropsWithChildren<{ name: string }> ) {
  const { activeTab } = useContext(TabContext)
  return name === activeTab ? (children as JSX.Element) : null
}

function Navigator() {
  const portrait = useContext(PortraitMode)
  if (!portrait)
  return (
    <nav className="Navigator">
      <NavLink name="장비">장비</NavLink>
      <NavLink name="아바타">칭호/아바타</NavLink>
      <NavLink name="봉인석">봉인석</NavLink>
      <NavLink name="크리쳐">크리쳐</NavLink>
      <NavLink name="길드">길드</NavLink>
      <NavLink name="마력결정">마력결정</NavLink>
    </nav>
  )
  else return (
    <nav className="Navigator">
      <NavLink name="장비">장비</NavLink>
      <NavLink name="대장간">대장간</NavLink>
      <NavLink name="아바타">칭호/아바타</NavLink>
      <NavLink name="봉인석">봉인석</NavLink>
      <NavLink name="기타">기타</NavLink>
    </nav>
  )
}

function Content() {
  const portrait = useContext(PortraitMode)
  if (!portrait)
  return (
    <>
      <Tab name="장비"><Equips /></Tab>
      <Tab name="아바타"><Avatars /></Tab>
      <Tab name="봉인석"><Cracks /></Tab>
      <Tab name="크리쳐"><Creatures /></Tab>
      <Tab name="길드"><Guilds /></Tab>
      <Tab name="마력결정"><Tonic /></Tab>
    </>
  )
  else
  return (
    <>
      <Tab name="장비"><Equips /></Tab>
      <Tab name="대장간"><Forge /></Tab>
      <Tab name="아바타"><Avatars /></Tab>
      <Tab name="봉인석"><Cracks /></Tab>
      <Tab name="기타">
        <Guilds />
        <Tonic />
        <Creatures />
      </Tab>
    </>
  )
}

function App() {

  const dispatch = useAppDispatch()
  const [portrait, setPortrait] = useState(window.innerWidth < 1000)
  const [activeTab, setActiveTab] = useState("장비")
  const [isModalOpen, setOpen] = useState(false)
  const [modalFrag, setModalFrag] = useState<JSX.Element>()
  const lastIDs = useAppSelector(state => state.SavedChars.IDs)
  const rehydrated = store.getState()._persist.rehydrated


  const closeModal = useCallback(() => {
    setOpen(false)
  }, [])

  const openModal = useCallback((children: JSX.Element) => {
    setModalFrag(children)
    setOpen(true)
  }, [])

  const modalContextValue: ModalContextType = { fragment: modalFrag, closeModal, openModal, }
  
  useEffect(() => {
    function onResize(ev: UIEvent) {
      if (window.innerWidth >= 1000) setPortrait(false)
      else setPortrait(true)
    }

    if (lastIDs.length === 0) {
      dispatch(InitChar())
    }
    
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
    <ModalContext.Provider value={modalContextValue}>
    <PortraitMode.Provider value={portrait}>
      {lastIDs.length > 0 && rehydrated? <div className="App">
        <AppModal isOpen={isModalOpen}/>
        <StickyNav />
        <div className="MainWrapper">
          <div className="LeftSide">
            <Navigator />
            <Content />
          </div>
          <div className="RightSide">
            <MyStat />
          </div>
        </div>
        <EnemyTarget />
        <SkillTestSet />
      </div>: null}
    </PortraitMode.Provider>
    </ModalContext.Provider>
    </TabContext.Provider>
  )
}

export default App
