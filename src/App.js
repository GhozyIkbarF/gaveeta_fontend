import './App.css';
import AppRoute from './Route'
import { Provider } from 'react-redux';
import store from './store';

function App() {
  return (
      <Provider store={store}>
        <AppRoute />
      </Provider>
  );
}

export default App;
