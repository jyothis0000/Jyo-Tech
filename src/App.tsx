import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import ScrollFx from './components/ScrollFx'
import Footer from './components/Footer'
import ProductPage from './components/ProductPage'
import Home from './pages/Home'
import StackPickerPrivacy from './pages/StackPickerPrivacy'
import StackPickerSupport from './pages/StackPickerSupport'
import WebHarvestPrivacy from './pages/WebHarvestPrivacy'
import WebHarvestSupport from './pages/WebHarvestSupport'
import JoPrivacy from './pages/JoPrivacy'
import { products } from './products'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ScrollFx />
      <Nav />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          {products.map(p => (
            <Route key={p.key} path={p.path} element={<ProductPage product={p} />} />
          ))}
          <Route path="/stackpicker/privacy" element={<StackPickerPrivacy />} />
          <Route path="/stackpicker/support" element={<StackPickerSupport />} />
          <Route path="/webharvest/privacy" element={<WebHarvestPrivacy />} />
          <Route path="/webharvest/support" element={<WebHarvestSupport />} />
          <Route path="/jo/privacy" element={<JoPrivacy />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
