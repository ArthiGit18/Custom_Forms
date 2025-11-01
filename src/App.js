import React from 'react';
import Sidebar from './components/Sidebar';
import FormBuilder from './components/FormBuilder';
import './styles/app.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';
const App = () => {
  return (
    <div className="app-container">
      {}
      <Sidebar />
      {}
      <FormBuilder />
    </div>
  );
};
export default App;