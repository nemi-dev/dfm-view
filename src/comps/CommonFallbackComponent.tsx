import { FallbackProps } from "react-error-boundary"

export function CommonFallbackComponent({ error, resetErrorBoundary } : FallbackProps) {
  return (
  <div>
    <header>
      <h3>오류가 생겼어요!</h3>
    </header>
    <div>
      이 화면을 보고있다면 개발자가 어딘가 놓친 것이 틀림없습니다. 어서 알려주세요!<br />
      아래의 "다시 시도" 버튼을 눌러도 같은 현상이 생긴다면, 시크릿 탭(Incognito Tab)에서 다시 접속해보세요.
    </div>
    <div>
      <button onClick={resetErrorBoundary}>다시 시도</button>
    </div>
    <div>
      <header>
        <h4>{error.name}</h4>
      </header>
      <div>
        <pre>{error.message}</pre>
        <pre>{error.stack}</pre>
      </div>
    </div>
    <div>
    </div>
  </div>
  )
}

export function ExplosiveButton() {
  return (
    <button onClick={() => { throw new Error('파이어!!!') }}>로봇 전폭</button>
  )
}

export function Runner() {
  throw new Error("랜드러너가 자폭했습니다!")
  return (
    <button onClick={() => { throw new Error('파이어!!!') }}>로봇 전폭</button>
  )
}
