import { Provider } from 'react-redux';
import { store } from '../redux/store';

export function AppProviders({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
