import { NavLink, Outlet } from 'react-router-dom';
import { FaRegBuilding, FaRegUser } from 'react-icons/fa';

const User = () => {
    const menuItems = [
        {
            label: 'My Companies',
            route: 'm-c',
            icon: FaRegBuilding
        },
        {
            label: 'Profile',
            route: 'p',
            icon: FaRegUser
        }
    ];
    return (
        <>
            <div className="flex gap-5">
                <aside className="max-w-70 w-full max-h-fit overflow-auto rounded-[18px] z-1000">
                    <div className="flex flex-col w-full max-h-162.5 overflow-auto">
                        {menuItems.map((menuItem, index) => (
                            <NavLink key={index} to={menuItem.route} className={({ isActive }) => `group flex items-center gap-2 w-full min-h-12.5
                                border-b border-[#EAEAEA] px-4 py-3 text-left break-all
                                text-[16px] font-semibold transition duration-200 cursor-pointer
                                hover:bg-(--bg-color)/80 hover:text-white
                                ${isActive ? 'text-white bg-(--bg-color)' : 'text-black bg-white'}`}>
                                <menuItem.icon className="text-lg" />
                                {menuItem.label}
                            </NavLink>
                        ))}
                    </div>
                </aside >
                <main className="flex-1">
                    <Outlet />
                </main>
            </div >
        </>
    )
}

export default User