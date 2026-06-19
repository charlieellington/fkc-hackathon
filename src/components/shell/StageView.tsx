// Human-first note: the screen switcher for ONE phone. Given the current beat in shared state,
// it renders that screen from this phone's perspective (Maya or Leo). The keyed wrapper makes
// each beat fade+rise in as it appears.
import { useDemo } from '@/context/DemoProvider'
import type { Perspective } from '@/context/demo-types'
import { TodayScreen } from '@/screens/TodayScreen'
import { SparkCard } from '@/components/spark/SparkCard'
import { AfterDarkScreen } from '@/components/afterdark/AfterDarkScreen'
import { QuestionScreen } from '@/components/question/QuestionScreen'
import { AnniversaryPlanCard } from '@/components/anniversary/AnniversaryPlanCard'
import { CloseScreen } from '@/screens/CloseScreen'

export function StageView({ perspective }: { perspective: Perspective }) {
  const { state } = useDemo()

  let screen
  switch (state.currentScreen) {
    case 'today':
      screen = <TodayScreen />
      break
    case 'spark':
      screen = <SparkCard perspective={perspective} />
      break
    case 'afterDark':
      screen = <AfterDarkScreen />
      break
    case 'question':
      screen = <QuestionScreen perspective={perspective} />
      break
    case 'anniversary':
      screen = <AnniversaryPlanCard />
      break
    case 'close':
      screen = <CloseScreen />
      break
  }

  return (
    <div className="h-full w-full" data-demo-step={state.currentScreen} data-perspective={perspective}>
      <div key={state.currentScreen} className="animate-fade-rise h-full w-full">
        {screen}
      </div>
    </div>
  )
}
