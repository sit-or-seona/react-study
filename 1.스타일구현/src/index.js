import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

    <App data={1} data2="hello" data3={[1, 2, 3]} />
  </React.StrictMode>
);