import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useClickOutside } from "../core/hooks/useClickOutside";
import type { ICompany } from "../core/models/company.model";
import { searchCompanies } from "../core/services/company.service";
import Logo from '../shared/assets/header-logo.svg'

interface IFilterMenuProps {
    companies: ICompany[];
    onSelect: () => void;
}

const FilterMenu = ({ companies, onSelect }: IFilterMenuProps) => {
    return (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-2xl z-10 overflow-auto">
            <div className="gap-3.75 pl-4.5 flex items-center py-2">
                <i className="pi pi-building text-(--text-color)"></i>
                <span className="text-(--text-color) font-bold text-[18px]">Предприятия</span>
            </div>
            <ul>
                {companies.map((company) => (
                    <Link onClick={onSelect} to={`/m/${company.id}`} key={company.id}>
                        <li className="px-4.5 py-2 hover:bg-gray-100 cursor-pointer duration-200 text-[17px] text-(--text-color) font-medium">
                            {company.name}
                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    )
}

const Header = () => {
    const [search, setSearch] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const { data: companies } = useQuery({
        queryKey: ['companies', search],
        queryFn: () => searchCompanies(search),
        enabled: search.length > 0,
    });

    useEffect(() => {
        if (!searchValue.length) {
            setSearch('');
            setMenuVisible(false);
            return;
        }

        const timer = setTimeout(() => {
            setSearch(searchValue);
            setMenuVisible(true);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchValue]);

    useClickOutside((containerRef), () => {
        setMenuVisible(false);
    })

    const onFocus = () => {
        if (searchValue.length > 0) {
            setMenuVisible(true);
        }
    }

    return (
        <header className="container max-w-295 mx-auto">
            <div className="flex items-center justify-between gap-5 pt-5">
                <Link to='/' className="logo max-w-70 w-full cursor-pointer">
                    <img src={Logo} alt="logo" />
                </Link>
                <div ref={containerRef} className="max-w-145 w-full relative">
                    <input onFocus={onFocus} value={searchValue} onChange={(e) => setSearchValue(e.target.value)} type="text" placeholder="Поиск"
                        className="liquid-glass-input" />
                    <i className="pi pi-search absolute right-3 top-1/2 transform -translate-y-1/2 text-(--text-color)"></i>
                    {menuVisible && <FilterMenu companies={companies?.data || []} onSelect={() => setMenuVisible(false)} />}
                </div>
                <div className="profile max-w-70 w-full flex justify-center gap-3">
                    <Link to='/u/m-c' className="flex flex-col items-center gap-px cursor-pointer">
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