import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User, UserWithUsername } from "../interfaces/User";
import { db } from "../firebase";
import { equalTo, get, orderByChild, push, query, ref } from "firebase/database";
import bcrypt from "bcryptjs";

export default function LoginRegister() {
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();

    const [errorDN, setErrorDN] = useState('');
    const [errorDK, setErrorDK] = useState('');
    const [passwordMatchError, setPasswordMatchError] = useState('');

    const [userdn, setuserdn] = useState<UserWithUsername>({
        email: '',
        password: '',
    });

    const [userdk, setuserdk] = useState<User>({
        email: '',
        password: '',
        dateoff: 0,
        tacgia: 0,
        ten: '',
        vip: 0,
    });

    const [password2, setPassword2] = useState('');

    const handleChangedn = (e: React.ChangeEvent<HTMLInputElement>) => {
        setuserdn({ ...userdn, [e.target.id]: e.target.value });
    };

    const handleChangedk = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setuserdk({ ...userdk, [id]: value });

        if (id === 'password' && password2) {
            setPasswordMatchError(value !== password2 ? 'Mật khẩu nhập lại không khớp!' : '');
        }
    };

    const handlePassword2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword2(value);

        setPasswordMatchError(value !== userdk.password ? 'Mật khẩu nhập lại không khớp!' : '');
    };

    const handleSubmitdn = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorDN('');

        if (!userdn.email || !userdn.password) {
            setErrorDN("Vui lòng điền đủ thông tin!");
            return;
        }

        const q = query(ref(db, 'users'), orderByChild('email'), equalTo(userdn.email));
        const snapshot = await get(q);
        if (snapshot.exists()) {
            const data = snapshot.val();
            const khachhang = Object.values(data)[0] as any;
            const isMatch = await bcrypt.compare(userdn.password, khachhang.password);
            if (isMatch) {
                const emailKey = khachhang.email.replace(/[^a-zA-Z0-9]/g, '');
                localStorage.setItem('email', khachhang.email);
                localStorage.setItem('emailKey', emailKey);
                navigate('/');
            } else {
                setErrorDN("Mật khẩu không đúng!");
            }
        } else {
            setErrorDN("Email không tồn tại!");
        }
    };

    const handleSubmitdk = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorDK('');

        for (const key in userdk) {
            if ((userdk as any)[key] === '') {
                setErrorDK("Vui lòng điền đủ thông tin!");
                return;
            }
        }

        if (userdk.ten.length < 2) {
            setErrorDK('Họ và tên phải có ít nhất 2 ký tự!');
            return;
        }
        if (userdk.password.length < 6) {
            setErrorDK('Mật khẩu phải có ít nhất 6 ký tự!');
            return;
        }
        if (userdk.password !== password2) {
            setErrorDK('Mật khẩu nhập lại không khớp!');
            return;
        }

        const q = query(ref(db, 'users'), orderByChild('email'), equalTo(userdk.email));
        const snapshot = await get(q);
        if (snapshot.exists()) {
            setErrorDK("Email đã được sử dụng!");
            return;
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(userdk.password, salt);
        userdk.password = hashedPassword;

        try {
            await push(ref(db, `users`), userdk);
            alert('Đăng ký thành công!');
            handleReset();
            setIsSignUp(false);
        } catch (err) {
            setErrorDK("Đăng ký thất bại! Vui lòng thử lại.");
            console.error(err);
        }
    };

    const handleReset = () => {
        setuserdk({
            email: '',
            password: '',
            dateoff: 0,
            tacgia: 0,
            ten: '',
            vip: 0,
        });
        setPassword2('');
        setErrorDK('');
        setPasswordMatchError('');
    };

    return (
        <div className='form-login'>
            <div className={`container ${isSignUp ? 'active' : ''}`}>
                <div className="form-container sign-up">
                    <form onSubmit={handleSubmitdk}>
                        <h1>Đăng ký</h1>
                        <input type="text" placeholder="Họ và tên" id="ten" value={userdk.ten} onChange={handleChangedk} />
                        <input type="email" placeholder="Email" id="email" value={userdk.email} onChange={handleChangedk} />
                        <input type="password" placeholder="Mật khẩu" id="password" value={userdk.password} onChange={handleChangedk} />
                        <input type="password" placeholder="Nhập lại mật khẩu" value={password2} onChange={handlePassword2Change} />
                        {(passwordMatchError || errorDK) && (
                            <p className="text-danger">{passwordMatchError || errorDK}</p>
                        )}
                        <button type="submit">Đăng ký</button>
                    </form>
                </div>

                <div className="form-container sign-in">
                    <form onSubmit={handleSubmitdn}>
                        <h1>Đăng nhập</h1>
                        <input
                            type="text"
                            id="email"
                            value={userdn.email}
                            onChange={handleChangedn}
                            autoComplete="email"
                            placeholder="Nhập email"
                        />
                        <input
                            type="password"
                            id="password"
                            value={userdn.password}
                            onChange={handleChangedn}
                            autoComplete="current-password"
                            placeholder="Nhập mật khẩu"
                        />
                        {errorDN && <p className="text-danger">{errorDN}</p>}
                        <div className="buttonWrapper">
                            <button type="submit">Đăng nhập</button>
                        </div>
                    </form>
                </div>

                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1>Welcome Back!</h1>
                            <img className="rounded-image" src="/logo.png" alt="BIIC" />
                            <button
                                className="hidden"
                                type="button"
                                onClick={() => setIsSignUp(false)}
                            >
                                Đăng nhập
                            </button>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <img className="rounded-image" src="/logo.png" alt="BIIC" />
                            <button
                                className="hidden"
                                type="button"
                                onClick={() => setIsSignUp(true)}
                            >
                                Đăng ký
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
