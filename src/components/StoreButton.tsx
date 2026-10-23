import type { Product } from '../products'

const icons = {
  chrome: 'M12 0C8.21 0 4.831 1.757 2.632 4.501l3.953 6.848A5.454 5.454 0 0 1 12 6.545h10.691A12 12 0 0 0 12 0zM1.931 5.47A11.943 11.943 0 0 0 0 12c0 6.012 4.42 10.991 10.189 11.864l3.953-6.847a5.45 5.45 0 0 1-6.865-2.29zm13.342 2.166a5.446 5.446 0 0 1 1.45 7.09l.002.001h-.002l-5.144 8.908A12 12 0 0 0 24 12a11.99 11.99 0 0 0-1.653-6.136zM12 16.364a4.364 4.364 0 1 1 0-8.728 4.364 4.364 0 0 1 0 8.728z',
  windows: 'M0 3.4 9.8 2v9.5H0zm11 -1.6L24 0v11.4H11zM0 12.6h9.8V22L0 20.6zm11 0h13V24l-13-1.8z',
}

export default function StoreButton({ store }: { store: Product['store'] }) {
  const icon = (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={icons[store.platform]} />
    </svg>
  )
  if (!store.href) return <span className="btn btn-off">{icon}{store.label}</span>
  return (
    <a href={store.href} target="_blank" rel="noopener noreferrer" className="btn btn-brand">
      {icon}
      {store.label}
    </a>
  )
}
