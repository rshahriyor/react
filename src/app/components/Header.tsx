import { FaHeart, FaUser, FaSearch } from "react-icons/fa";
import Logo from "../assets/header-logo.svg";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header className="container max-w-295 mx-auto">
            <div className="flex items-center justify-between gap-5 pt-5">
                <Link to='/' className="logo max-w-70 w-full cursor-pointer">
                    <img src={Logo} alt="logo" />
                </Link>
                <div className="max-w-145 w-full relative">
                    <input type="text" placeholder="Поиск"
                        className="liquid-glass-input" />
                    <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-(--text-color)" />
                </div>
                <div className="profile max-w-70 w-full flex justify-center gap-3">
                    <Link to='/u' className="flex flex-col items-center gap-px cursor-pointer">
                        <FaUser className="text-(--text-color) text-2xl" />
                        <span className="text-(--text-color) text-sm">Аккаунт</span>
                    </Link>
                    <Link to='/m-i' className="flex flex-col items-center gap-px cursor-pointer" >
                        <FaHeart className="text-(--text-color) text-2xl" />
                        <span className="text-(--text-color) text-sm">Избранные</span>
                    </Link >
                </div >
            </div >
        </header >
    )
}

export default Header;