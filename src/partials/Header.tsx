import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem('email');
    setIsLoggedIn(!!email); // true nếu có email
  }, []);

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-left">
          <img
            src="/logo.png"
            alt="Logo"
            className="logo"
            onClick={() => navigate('/')}
          />

          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="search-input desktop"
          />

          <button
            className="search-icon mobile"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            🔍
          </button>
        </div>

        {isLoggedIn ? (
          <div className="avatar" onClick={() => navigate('/tai-khoan')}>
            <img
              src="/avt.png"
              alt="User"
              className="avatar-img"
            />
          </div>
        ) : (
          <button
            className="login-button"
            onClick={() => navigate('/loginregister')}
          >
            Đăng nhập / Đăng ký
          </button>
        )}
      </div>

      {showMobileSearch && (
        <div className="mobile-search-bar">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="search-input"
          />
        </div>
      )}
    </header>
  );
}
