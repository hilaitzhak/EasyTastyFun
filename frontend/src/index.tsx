import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import '../src/i18n/i18n';

// Apply the saved theme before first paint to avoid a flash of the wrong theme.
if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.classList.add('dark');
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);
