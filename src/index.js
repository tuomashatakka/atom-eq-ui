'use babel'

import { CompositeDisposable } from 'atom'
import Settings from './settings'

let subscriptions

export const config = require('./config.json')

export function activate () {

  let settings  = new Settings()
  subscriptions = new CompositeDisposable()
  subscriptions.add(settings)
}

export function deactivate () {
  subscriptions.dispose()
}
