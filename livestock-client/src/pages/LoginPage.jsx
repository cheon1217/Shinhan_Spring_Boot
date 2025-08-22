import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8090/auth/login',
        { username, password },
        { withCredentials: true }
      );
      localStorage.setItem('jwtToken', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      alert('로그인 실패');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-8 col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h4 text-center mb-4">로그인</h2>

              <div className="mb-3">
                <label className="form-label">아이디</label>
                <input
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="아이디를 입력하세요"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">비밀번호</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                />
              </div>

              <div className="d-grid gap-2">
                <button className="btn btn-primary" onClick={handleLogin}>로그인</button>
                <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>
                  메인으로
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
