import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { db } from '../firebase';

export default function Header() {
  const navigate = useNavigate();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    const email = localStorage.getItem('email');
    setIsLoggedIn(!!email);
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm.length < 2) {
        setSearchResults([]);
        return;
      }

      const truyenRef = ref(db, 'truyen');
      const snapshot = await get(truyenRef);
      if (!snapshot.exists()) {
        setSearchResults([]);
        return;
      }

      const allData = snapshot.val();
      const matched = Object.entries(allData)
        .filter(([_, val]: any) =>
          val.ten?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 5)
        .map(([id, val]: any) => ({
          id,
          ten: val.ten,
          thumbnail: val.thumbnail || "/no-image.jpg",
        }));

      setSearchResults(matched);
    };

    const timeout = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const handleSelect = (id: string) => {
    navigate(`/chi-tiet/${id}`);
    setSearchTerm('');
    setSearchResults([]);
    setShowMobileSearch(false);
  };

  return (
    <header className="header" style={{ position: 'relative', zIndex: 1050 }}>
      <div className="header-top d-flex justify-content-between align-items-center px-3 py-2">
        <div className="d-flex align-items-center gap-2">
          <img
            src="/logo.png"
            alt="Logo"
            className="logo"
            style={{ height: "40px", cursor: "pointer" }}
            onClick={() => navigate('/')}
          />

          <div className="search-container position-relative d-none d-md-block"
            style={{ width: 300 }}>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchResults.length > 0 && (
              <ul className="search-results list-group position-absolute w-100"
                style={{
                  top: '100%',
                  zIndex: 1060, // cao hơn header menu
                  background: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  maxHeight: '300px',
                  overflowY: 'auto'
                }}>
                {searchResults.map((item) => (
                  <li
                    key={item.id}
                    className="list-group-item d-flex align-items-center gap-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSelect(item.id)}
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.ten}
                      style={{ width: 40, height: 60, objectFit: "cover" }}
                    />
                    <span className="flex-grow-1">{item.ten}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-outline-secondary d-md-none"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            🔍
          </button>

          {isLoggedIn ? (
            <div className="avatar" onClick={() => navigate('/tai-khoan')}>
              <img src="/avt.png" alt="User" className="avatar-img" style={{ width: 40, height: 40 }} />
            </div>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => navigate('/loginregister')}
            >
              Đăng nhập / Đăng ký
            </button>
          )}
        </div>
      </div>

      {showMobileSearch && (
        <div className="px-3 py-2 d-md-none">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchResults.length > 0 && (
            <ul className="search-results list-group mt-1">
              {searchResults.map((item) => (
                <li
                  key={item.id}
                  className="list-group-item d-flex align-items-center gap-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSelect(item.id)}
                >
                  <img
                    src={item.thumbnail}
                    alt={item.ten}
                    style={{ width: 40, height: 60, objectFit: "cover" }}
                  />
                  <span>{item.ten}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </header>
  );
}
