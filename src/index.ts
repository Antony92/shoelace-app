// Import Shoelace themes
import '@shoelace-style/shoelace/dist/themes/light.css'
import '@shoelace-style/shoelace/dist/themes/dark.css'

// Import main styles
import './main.css'

// Import root element
import './app/app-root.element'

// Theme utils
import { applyTheme } from './app/utils/theme.js'

// set up theme
applyTheme()
