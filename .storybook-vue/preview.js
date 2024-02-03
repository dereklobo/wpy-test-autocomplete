import { createApp} from 'vue';
import { addDecorator, addParameters } from '@storybook/vue3';
import { withStyles } from 'storybook-addon-styles/vue'
import '../packages/style.css'
import './style.css'
import Autocomplete from '../packages/autocomplete-vue/Autocomplete.vue'

createApp().component('Autocomplete', Autocomplete)
// createApp(Autocomplete) 

addDecorator(withStyles)
addParameters({
  options: {
    showPanel: false
  },
  styles: {
    margin: '0 auto',
    padding: '40px 24px 0',
    maxWidth: '400px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif',
  }
})
