import { useEffect } from 'react'
import { SITE_URL } from '../constants'

interface PageMetaProps {
  title: string
  description: string
  path?: string
  image?: string
}

export default function PageMeta({ title, description, path = '', image }: PageMetaProps) {
  const fullTitle = title === 'jyo tech' ? title : `${title} — jyo tech`
  const url = `${SITE_URL}${path}`
  const ogImage = image ?? `${SITE_URL}/og-default.png`

  useEffect(() => {
    document.title = fullTitle
    setMeta('description', description)
    setOg('title', fullTitle)
    setOg('description', description)
    setOg('url', url)
    setOg('image', ogImage)
  }, [fullTitle, description, url, ogImage])

  return null
}

function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.content = content
}

function setOg(property: string, content: string) {
  let el = document.querySelector(`meta[property="og:${property}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', `og:${property}`)
    document.head.appendChild(el)
  }
  el.content = content
}
