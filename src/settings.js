'use babel'
// @flow

import { CompositeDisposable } from 'atom'
import self from 'autobind-decorator'
import toCSS, { toLessVariables } from './css'
import { applyCss } from './config'


const { name } = require('../package.json')

const descriptor = (...path) =>
  [ name, ...path ].join('.')

function observe (key) {
  return atom.config.observe(
    descriptor(key),
    this.update.bind(this, key)
  )
}


type HandlerMethodType = (name: string, config: {} | string | number) => any
type HandlerType = { [string]: HandlerMethodType | HandlerType }
type HandlersType = {
  colors: HandlerType,
  layout: HandlerType,
  display: HandlerType,
}

type Color = {
  toRGBAString: () => string,
}


export default class ThemeSettings {

  state: {}
  subscriptions: CompositeDisposable

  get handlers (): HandlersType {
    return {
      colors: {
        tint:            this.updateTintColor,
      },
      display: {
        dockTabs:        this.updateTabVisibility,
        coloredTabs:     this.updateTabColoring,
      },
      layout: {
        size:            this.updateLayoutSize,
        scale:           this.updateLayoutSpacing,
        tabHeight:       this.updateTabHeight,
        statusBarHeight: this.updateStatusBarHeight
      }
    }
  }

  constructor () {
    let keys     = [ 'colors', 'layout', 'display' ]

    this.state = {}
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(...keys.map(observe.bind(this)))
  }

  @self
  dispose () {
    this.subscriptions.dispose()
  }

  @self
  update (category: string, config: {} | number | string) {
    let entries = Object.entries(config)

    for (let [ attr, value ] of entries)
      this.getHandlerFor(category, attr)(attr, value)

    this.applyStylesheet()
  }

  @self
  getHandlerFor (...path: Array<string>): HandlerMethodType {
    let part
    let handler = this.handlers

    while (handler && (part = path.shift()))
      handler = handler[part]

    // $FlowFixMe
    return handler
  }

  @self
  applyStylesheet () {
    let source = this.css
    let priority = 3
    let sourcePath = `eq-settings`
    let subscription: atom$Disposable = atom.styles.addStyleSheet(source, { sourcePath, priority })

    atom.notifications.addInfo("Stylesheet applied", { description: source })
    this.subscriptions.add(subscription)
  }

  get css (): string {
    return toCSS({ ':root': this.state })
  }

  get less (): string {
    return toLessVariables(this.state)
  }

  @self
  updateStyle (state: {}) {
    Object.assign(this.state, state)
  }

  @self
  // eslint-disable-next-line class-methods-use-this
  updateTabVisibility (prop: string, val: boolean) {
    getWorkspace().setAttribute('tab-visibility', val.toString())
  }

  @self
  // eslint-disable-next-line class-methods-use-this
  updateTabColoring (prop: string, val: boolean) {
    getWorkspace().setAttribute('tab-coloring', val.toString())
  }

  @self
  updateLayoutSpacing (attr: string, value: number) {
    attr = `--${attr}`
    this.updateStyle({ [attr]: value })
  }

  @self
  updateLayoutSize (attr: string, value: number) {
    attr = `--${attr}`
    this.updateStyle({ [attr]: value })
  }

  @self
  updateTabHeight (attr: string, value: number) {
    attr = `--${attr}`
    this.updateStyle({ [attr]: value })
  }

  @self
  updateStatusBarHeight (attr: string, value: number) {
    attr = `--${attr}`
    this.updateStyle({ [attr]: value })
  }

  @self
  updateTintColor (attr: string, value: Color) {
    let prop  = `--${attr}`
    let color = value.toRGBAString()

    this.updateStyle({ [prop]: color })
    applyCss(this.less)
  }

}

function getWorkspace (): HTMLElement {
  return atom.views.getView(atom.workspace)
}

// function coloredTabs (state) {
//   let workspace = atom.views.getView(atom.workspace)
//   workspace.setAttribute('tab-colors', state)
// }
//
// function tabHeight (height) {
//   let workspace = atom.views.getView(atom.workspace)
//   workspace.setAttribute('tab-height', height)
// }
//
// function statusBarHeight (height) {
//   let workspace = atom.views.getView(atom.workspace)
//   workspace.setAttribute('status-bar-height', height)
// }
//
// function size (x) {
//   document.body.setAttribute('ui-size', x)
// }
//
// function scale (x) {
//   document.body.setAttribute('ui-spacing', x)
// }
