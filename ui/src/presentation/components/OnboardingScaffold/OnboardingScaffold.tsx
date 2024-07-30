import { FC, PropsWithChildren } from 'react';
import './OnboardingScaffold.scss'


const OnboardingScaffold: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='scaffoldWrapper'>
      <div className="titleSidebar">
        <h2 className="title">G.E.R</h2>
        <h4>Manage. Assign. Track</h4>
      </div>
      <div className="formContainer">{children}</div>
    </div>
  )
}

export default OnboardingScaffold