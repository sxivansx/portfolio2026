import Desktop from './components/Desktop'
import MobileGate from './components/MobileGate'

export default function Home() {
  return (
    <>
      <MobileGate />
      <div className="desktop-app">
        <Desktop />
      </div>
    </>
  )
}
