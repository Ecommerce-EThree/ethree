import type { Pinia } from 'pinia'
import { App } from 'vue'

export interface VueroAppContext {
  app: App,
  pinia: Pinia
}
export type VueroPlugin = (vuero: VueroAppContext) => void | Promise<void>

// this is a helper function to define plugins with autocompletion
export function definePlugin(plugin: VueroPlugin) {
  return plugin
}
