import { createApp } from "vue";
import App from "./App.vue";
import Button from './components/Button/index'
import Demo from './components/Demo/index.vue'

const app = createApp(App)
app.component(Button.name, Button);
app.component(Demo.name, Demo)


app.mount("#app");
