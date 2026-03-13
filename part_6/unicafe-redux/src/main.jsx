import ReactDOM from 'react-dom/client'
import { createStore } from 'redux'
import reducer from './reducer'
import App from './App'

const store = createStore(reducer)

const root = ReactDOM.createRoot(document.getElementById('root'))

const renderApp = () => {
  root.render(<App store={store} />)
}

renderApp()
store.subscribe(renderApp)
