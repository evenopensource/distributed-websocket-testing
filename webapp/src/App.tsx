import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import theme from './themes/theme';
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from '@mui/material';

import CreatePage from './routes/create-project';
import CreateTestCases from './routes/create-test-cases';

function App() {

  return (
    <div style={{ width: "100vw" }}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<CreatePage />} />
          <Route path="/add-test-cases" element={<CreateTestCases />} />
        </Routes>
      </Router>
    </ThemeProvider>
    </div>

  )
}

export default App;
