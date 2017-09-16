'use babel'
import { CompositeDisposable } from 'atom'
import self from 'autobind-decorator'
import toCSS from './css'

export default class ThemeSettings {

  get handlers () {
    return {
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
    this.state = {}
    this.subscriptions = new CompositeDisposable()

    let descriptor = (...path) => [ name, ...path ].join('.')
    let { name } = require('../package.json')

    let updaters = [
      atom.config.observe(descriptor('layout'), this.update.bind(this, 'layout')),
      atom.config.observe(descriptor('display'), this.update.bind(this, 'display')),
    ]
    this.subscriptions.add(...updaters)
  }

  @self
  dispose () {
    this.subscriptions.dispose()
  }

  @self
  update (category, config) {
    let entries = Object.entries(config)

    for (let [attr, value] of entries) {
      let handle = this.getHandlerFor(category, attr)
      console.log(this, handle, attr, value)
      handle.call(this, attr, value)
    }
    this.applyStylesheet.call(this)
  }

  @self
  getHandlerFor (...path) {
    let part
    let handler = this.handlers
    while (handler && (part = path.shift()))
      handler = handler[part]
    return handler
  }

  @self
  applyStylesheet () {
    let source = this.css
    let priority = 3
    let sourcePath = `eq-settings`
    let subscription = atom.styles.addStyleSheet(source, { sourcePath, priority })

    this.subscriptions.add(subscription)
  }

  get css () {
    return toCSS({ ':root': this.state })
  }

  @self
  updateStyle (state) {
    Object.assign(this.state, state)
  }

  @self
  updateTabVisibility (prop, val) {
    let workspace = getWorkspace()
    workspace.setAttribute('tab-visible', val)
  }

  @self
  updateTabColoring (prop, val) {
    let workspace = getWorkspace()
    workspace.setAttribute('tab-coloring', val)
  }

  @self
  updateLayoutSpacing (attr, value) {
    attr = `--${attr}`
    this.updateStyle({ [attr]: value })
  }

  @self
  updateLayoutSize (attr, value) {
    attr = `--${attr}`
    this.updateStyle({ [attr]: value })
  }

  @self
  updateTabHeight (attr, value) {
    attr = `--${attr}`
    this.updateStyle({ [attr]: value })
  }

  @self
  updateStatusBarHeight (attr, value) {
    attr = `--${attr}`
    this.updateStyle({ [attr]: value })
  }
}

function getWorkspace () {
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
