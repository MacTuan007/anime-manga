import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-dark text-white mt-5 py-4">
            <div className="text-center">
                <p className="mb-1">© 2025 Website Truyện Anime Manga</p>
                <div>
                    <a href="/dieu-khoan" className="text-secondary me-3 text-decoration-none">
                        Điều khoản
                    </a>
                    <a href="/lien-he" className="text-secondary me-3 text-decoration-none">
                        Liên hệ
                    </a>
                    <a href="/bao-mat" className="text-secondary text-decoration-none">
                        Chính sách bảo mật
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
