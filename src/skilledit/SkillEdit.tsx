import { useState } from "react"

export function SkillEdit() {
  const [skName, setSkName] = useState("")
  return (
    <div>
      <form action="" onSubmit={e => e.preventDefault()}>
        <label htmlFor="skName">스킬 이름</label>
        <input id="skName" value={skName} onChange={e => setSkName(e.target.value)} />
        <div>
          <button>내보내기</button>
        </div>
      </form>
    </div>
  )
}
