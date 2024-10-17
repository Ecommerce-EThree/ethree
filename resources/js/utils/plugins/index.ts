import type { Pinia } from 'pinia'

export interface VueroAppContext {
  pinia: Pinia
}
export type VueroPlugin = (vuero: VueroAppContext) => void | Promise<void>

// this is a helper function to define plugins with autocompletion
export function definePlugin(plugin: VueroPlugin) {
  return plugin
}
