import { createApp } from "vue";
import App from "./App.vue";
import Button from './Button/index'
import Demo from './Demo/index.vue'

const app = createApp(App)
app.component(Button.name, Button);
app.component(Demo.name, Demo)


app.mount("#app");
