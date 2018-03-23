'use babel'

import filesystem from 'fs'
import { resolve } from 'path'

// import { sep } from 'path'
// import { ASSETS_PATH, getBase64FromImageUrl, prefix, error } from './utils'

const STYLES_ENTRY_PATH  = resolve(__dirname, '../index.less')
const STYLES_CONFIG_PATH = resolve(__dirname, '../styles/config.less')

// // eslint-disable-next-line complexity
// async function resolveValue (val) {
//
//   // Handle basic types
//   if (!val)
//     val = ''
//   else if (val.toJSON)
//     val = val.toJSON()
//   else if (val.toJS)
//     val = val.toJS()
//   else if (val.toString)
//     val = val.toString()
//
//   // Handle file paths
//   if (val.search(new RegExp(`\\${sep}`)) > -1) {
//     try {
//       let data = asd // await getBase64FromImageUrl(val)
//       val = `url("${data}")`
//     }
//     catch (data) {
//       val = `"${data}"`
//     }
//   }
//
//   // else if(!val.startsWith('#')) {
//   //   let { name } = require('../package.json')
//   //   let assets   = ASSETS_PATH
//   //
//   //   val = `url('atom://${name}/${assets}/${val}.svg')`
//   // }
//
//   return val
// }

export function reloadStylesheet (path) {
  let styleEntry = STYLES_ENTRY_PATH
  let src        = atom.themes.loadLessStylesheet(styleEntry)

  atom.themes.applyStylesheet(path, src, 5)
  atom.themes.refreshLessCache()
  return src
}

export function applyCss (content = '') {
  let path = STYLES_CONFIG_PATH

  if (atom.devMode)
    // eslint-disable-next-line
    console.info(`Writing the less config to\npath ${path}\n---------------------------------\n\n${content}\n\n`)

  let raise = (err) =>
    console.error(err, `Writing less variables to a file ${path} failed`)
    // error(err, `Writing less variables to a file ${path} failed`)

  try {
    content = content + '\n'
    filesystem.writeFileSync(path, content, 'utf8')
    reloadStylesheet(path)
  }
  catch(e) {
    raise(e)
  }

}
