export function realPx (px) {
  const maxWidth = window.innerWidth > 500 ? 500 : window.innerWidth
  return px * (maxWidth / 375)
}

export function resortNavigation (arr) {
  return [].concat(...arr.map(item => [].concat(item, ...resortNavigation(item.subitems))))
}

export function findNavParent (navigation, item, level = 0) {
  return !item.parent ? level : findNavParent(navigation.filter(parentItem => parentItem.id === item.parent)[0], ++level)
}
