import React from 'react';
import './App.css';
import Absences from "./components/absences";
import Member from "./components/member";

import { BrowserRouter as Router, Routes, Route}
    from 'react-router-dom';

function App() {
  return (
      <Router>
          <Routes>
              <Route path='/' element={<Absences />} />
              <Route path='/member' element={<Member/>} />
          </Routes>
      </Router>
  );
}

export default App;
