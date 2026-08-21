import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import StackPicker from './pages/StackPicker'
import StackPickerPrivacy from './pages/StackPickerPrivacy'
import StackPickerSupport from './pages/StackPickerSupport'
import WebHarvest from './pages/WebHarvest'
import WebHarvestPrivacy from './pages/WebHarvestPrivacy'
import WebHarvestSupport from './pages/WebHarvestSupport'

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stackpicker" element={<StackPicker />} />
          <Route path="/stackpicker/privacy" element={<StackPickerPrivacy />} />
          <Route path="/stackpicker/support" element={<StackPickerSupport />} />
          <Route path="/webharvest" element={<WebHarvest />} />
          <Route path="/webharvest/privacy" element={<WebHarvestPrivacy />} />
          <Route path="/webharvest/support" element={<WebHarvestSupport />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
