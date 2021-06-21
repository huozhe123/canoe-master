import type {App} from 'vue'
export type SFCWithInstall<T> = T & { install(app: App): void; }
export type ComponentSize = 'large' | 'medium' | 'small' | 'mini'