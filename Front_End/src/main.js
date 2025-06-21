import { createApp } from 'vue'
import App from './App.vue'
import Navigation from './components/Navigation.vue'
import Heroes from './components/Heroes.vue'
import Roles from './components/Roles.vue'

const app = createApp(App)
app.component('navigation', Navigation)
app.component('heroes', Heroes)
app.component('roles', Roles)

app.mount('#app')