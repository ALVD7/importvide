import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// Registra las herramientas WebMCP en cuanto carga el bundle (antes de montar React)
import './lib/webmcp.js'
import { capturarOrigen, instalarSeguimientoDeClics } from './lib/tracking.js'

// Antes de montar React: así el origen (UTM / referrer) se lee de la URL con
// la que llegó el visitante, y ningún clic a WhatsApp queda sin medir.
capturarOrigen()
instalarSeguimientoDeClics()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
