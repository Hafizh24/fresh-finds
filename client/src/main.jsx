import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'leaflet/dist/leaflet.css'
import { ThemeProvider } from '@material-tailwind/react'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { ToastContainer } from 'react-toastify'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <ThemeProvider>
      <ToastContainer style={{ zIndex: 10001 }} />
      <App />
    </ThemeProvider>
  </Provider>
)
