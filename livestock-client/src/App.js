import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import StockDashboard from './pages/StockDashboard'; // 실시간 시세 보기
import RequireAuth from './components/RequireAuth';
import MainPage from './pages/MainPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
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
