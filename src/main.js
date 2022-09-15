import { createApp } from 'vue'
import App from './App.vue'
import zForm from './components/zForm.vue'
if(process.env.NODE_ENV === 'development'){
    const app = createApp(App)
    app.mount('#app')
}
export  default zForm

