'use babel'

let _keys

function getStyleProperties () {
  return _keys || (_keys = getComputedStyle(document.body))
}

function isStyleProperty(attr) {
  let props = getStyleProperties()

  if (typeof attr !== 'string' && typeof attr !== 'number')
    return false

  if (attr.startsWith('--'))
    return true

  for (let name of props)
    if (attr == name)
      return name

  return false
}

export default function toCSS (obj, indent='') {
  let buffer = ''
  indent = '  ' + indent
  for (let attr in obj) {
    if (isStyleProperty(attr))
      buffer += `${indent}${attr}: ${obj[attr]};\n`
    else
      buffer += `${attr} {\n${toCSS(obj[attr], indent)}}`
  }
  return buffer
}
