export function px2rem ($px) {
  return ($px / 37.5)
}

export function realPx (px) {
  const maxWidth = window.innerWidth > 500 ? 500 : window.innerWidth
  return px * (maxWidth / 375)
}

export function resortNavigation (arr) {
  return [].concat(...arr.map(item => [].concat(item, ...resortNavigation(item.subitems))))
}
