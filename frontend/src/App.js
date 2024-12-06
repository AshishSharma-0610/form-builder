import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FormEditor from './components/FormEditor';
import FormRenderer from './components/FormRenderer';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<FormEditor />} />
          <Route path="/form/:id" element={<FormRenderer />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;