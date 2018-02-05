'use babel'
// @flow

type CSSDescription =
  string |
  number |
  { [attribute: string]: CSSDescription }


let _keys: CSSStyleDeclaration


const isPrimitive = (attr: any): boolean =>
  [ 'string', 'number' ].includes(typeof attr)


function getStyleProperties (): CSSStyleDeclaration {
  if (document.body)
    return _keys || (_keys = getComputedStyle(document.body))
  return getComputedStyle(window)
}


function isStyleProperty (attr: string): boolean | string {
  if (!isPrimitive(attr))
    return false

  if (attr.startsWith('--'))
    return true

  let props = getStyleProperties()
  for (let name of props)
    if (attr === name)
      return name

  return false
}


export default function toCSS (obj: CSSDescription, indent: string = ''): string {
  let buffer = ''
  indent = '  ' + indent

  if (isPrimitive(obj))
    return obj.toString()

  for (let attr in obj)
    if (isStyleProperty(attr))
      buffer += `${indent}${attr}: ${obj[attr].toString()};\n`
    else
      buffer += `${attr} {\n${toCSS(obj[attr], indent)}}`

  return buffer
}


export function toLessVariables (obj: CSSDescription, indent: string = ''): string {
  let buffer = ''
  indent = '  ' + indent

  if (isPrimitive(obj))
    return obj.toString()

  for (let attr in obj)
    if (isStyleProperty(attr))
      buffer += `${indent}@eq-config-${attr.replace(/([^\w])/g, '')}: ${obj[attr].toString()};\n`
    else
      buffer += `${attr} {\n${toLessVariables(obj[attr], indent)}}`

  return buffer
}
