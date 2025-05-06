import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to WebReg</h1>
      <p className="home-subtitle">Your course registration platform</p>
      
      <div className="button-container">
        <button 
          className="home-button plan-button"
          onClick={() => navigate('/plan')}
        >
          Plan Courses
        </button>
        <button 
          className="home-button register-button"
          onClick={() => navigate('/register')}
        >
          Register Classes
        </button>
      </div>
    </div>
  );
}