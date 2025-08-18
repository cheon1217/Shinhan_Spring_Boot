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
        {
          username: username,
          password: password,
        },
        {
          withCredentials: true,
        }
      );

      localStorage.setItem('jwtToken', response.data.token);
      alert('로그인 성공');
      navigate('/dashboard');
    } catch (error) {
      alert('로그인 실패');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: 100 }}>
      <h2>로그인</h2>
      <input
        type="text"
        placeholder="아이디"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      /><br /><br />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />
      <button onClick={handleLogin}>로그인</button>
    </div>
  );
}

export default LoginPage;
