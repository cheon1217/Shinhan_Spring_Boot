import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import StockDashboard from './pages/StockDashboard'; // 실시간 시세 보기
import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/stock"
          element={
            <RequireAuth>
              <StockDashboard />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
