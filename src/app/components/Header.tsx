import Logo from "../assets/header-logo.svg";
import { Link } from "react-router-dom";

const Header = () => {
    const token = localStorage.getItem('token');
    return (
        <header className="container max-w-295 mx-auto">
            <div className="flex items-center justify-between gap-5 pt-5">
                <Link to='/' className="logo max-w-70 w-full cursor-pointer">
                    <img src={Logo} alt="logo" />
                </Link>
                <div className="max-w-145 w-full relative">
                    <input type="text" placeholder="Поиск"
                        className="liquid-glass-input" />
                    <i className="pi pi-search absolute right-3 top-1/2 transform -translate-y-1/2 text-(--text-color)"></i>
                </div>
                <div className="profile max-w-70 w-full flex justify-center gap-3">
                    <Link to={token ? '/u' : '/login'} className="flex flex-col items-center gap-px cursor-pointer">
                        <i className="pi pi-user text-(--text-color) text-2xl"></i>
                        <span className="text-(--text-color) text-sm">Аккаунт</span>
                    </Link>
                    <Link to='/m-i?is_favorite=true' className="flex flex-col items-center gap-px cursor-pointer" >
                        <i className="pi pi-heart text-(--text-color) text-2xl"></i>
                        <span className="text-(--text-color) text-sm">Избранные</span>
                    </Link >
                </div >
            </div >
        </header >
    )
}

export default Header;