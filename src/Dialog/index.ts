import {App} from 'vue'
import type { SFCWithInstall } from '../utils/types'
import Dialog from './src/index.vue'

Dialog.install = (app: App) : void => {
  app.component(Dialog.name, Dialog)
}


export default Dialog
export {default as useDialog} from './src/useDialog'