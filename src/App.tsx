// Root of the Nami single-page app.
// Sets up client-side routing (react-router) and the mobile-first "phone column"
// shell that every screen renders inside — full-bleed on a phone, centred in a
// warm frame on desktop. Front-end only: no backend, no APIs.
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'

function App() {
  return (
    <BrowserRouter>
      {/* Warm page backdrop — only visible around the column on larger screens. */}
      <div className="min-h-svh bg-gradient-to-b from-amber-50 via-rose-50 to-orange-100">
        {/* The phone column: roughly a large phone's width, centred. */}
        <div className="mx-auto flex min-h-svh w-full max-w-md flex-col bg-background shadow-sm">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
