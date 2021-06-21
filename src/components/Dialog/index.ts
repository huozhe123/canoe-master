import {App} from 'vue'
import type {SFCWithInstall} from '@/utils/types'
import { SFCWithInstall } from '../../utils/types'

improt Dialog from './src/index'

Dialog.install = (app: App) : void => {
  app.component(Dialog.name, Dialog)
}

const _Dialog: SFCWithInstall<typeof Dialog> = Dialog

export default _Dialog
export {default as useDialog} from './src/useDialog'