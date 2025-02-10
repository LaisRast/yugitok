import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {LikedCardsProvider} from "./contexts/LikedCardsContext.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LikedCardsProvider>
      <App/>
    </LikedCardsProvider>
  </StrictMode>,
)
