import { useCallback, useContext, useEffect, useState } from 'react'
import '../style/App.scss'
import '../style/Misc.scss'

import { Equips } from './Equips'
import { Creatures } from './Creature'
import { Guilds } from "./Guilds"
import { Cracks } from "./Cracks"
import { Tonic } from "./Tonic"
import { Avatars } from "./Avatar"
import { TabContext } from '../responsiveContext'
import { ItemSelectModal } from './Modal'
import { ModalContext } from "./modalContext"
import { MyStat as MyStat } from './MyStat'
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
        <nav className="Navigator">
          <NavLink name="장비">장비</NavLink>
          <NavLink name="아바타">칭호/아바타</NavLink>
          <NavLink name="크리쳐">크리쳐</NavLink>
          <NavLink name="마력결정">마력 결정</NavLink>
          <NavLink name="봉인석">성안의 봉인</NavLink>
          <NavLink name="길드">길드 버프</NavLink>
        </nav>
        <Tab name="장비"><Equips /></Tab>
        <Tab name="아바타"><Avatars /></Tab>
        <Tab name="크리쳐"><Creatures /></Tab>
        <Tab name="마력결정"><Tonic /></Tab>
        <Tab name="봉인석"><Cracks /></Tab>
        <Tab name="길드"><Guilds /></Tab>
        <MyStat />
        <SkillTestSet />
      </div>
    </ModalContext.Provider>
    </TabContext.Provider>
  )
}

export default App
