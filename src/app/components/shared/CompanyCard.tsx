import { useEffect, useState, type MouseEvent } from 'react'
import { NavLink } from 'react-router-dom'
import type { IFile } from '../../core/models/Company';
import { environment } from '../../../environments/environment';
import { FaRegClock, FaHeart, FaRegHeart } from 'react-icons/fa';

interface Tag {
    tag_name: string
}

interface ISchedule {
    day_of_week?: number,
    start_at?: string,
    end_at?: string,
    lunch_start_at?: string,
    lunch_end_at?: string,
    is_working_day?: boolean,
    is_day_and_night?: boolean,
    without_breaks?: boolean
}

interface CompanyCardProps {
    companyId: number;
    companyTitle: string;
    isFavorite: boolean;
    favoritesCount: number;
    companyTags: Tag[];
    companyOwn: boolean;
    companyStatus: boolean;
    companyImage?: IFile;
    schedule?: ISchedule;
}

const CompanyCard = ({
    companyId,
    companyTitle,
    isFavorite,
    favoritesCount,
    companyTags,
    companyOwn,
    companyStatus,
    companyImage,
    schedule
}: CompanyCardProps) => {
    const [showMenu, setShowMenu] = useState(false);
    const [isWorking, setIsWorking] = useState(false);
    const [atLunch, setAtLunch] = useState(false);
    const [isClosed, setIsClosed] = useState(true);
    const imageUrl = environment.imageUrl;

    useEffect(() => {
        calculateWorkingDay();
    }, [schedule])

    const eventsClick = (e: MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
    }

    const updateCompanyStatus = () => {

    }

    const toggleFavoriteCard = () => {

    }

    const calculateWorkingDay = () => {
        if (!schedule || !schedule.is_working_day) return;

        const companyStartWork = new Date();
        const companyFinishWork = new Date();
        const lunchStartTime = new Date();
        const lunchEndTime = new Date();
        const realTime = new Date();

        let [hour, min] = schedule.start_at!.split(':');
        companyStartWork.setHours(+hour, +min, 0, 0);

        [hour, min] = schedule.end_at!.split(':');
        companyFinishWork.setHours(+hour, +min, 0, 0);

        if (schedule.lunch_start_at) {
            const [h, m] = schedule.lunch_start_at.split(':');
            lunchStartTime.setHours(+h, +m, 0, 0);
        }

        if (schedule.lunch_end_at) {
            const [h, m] = schedule.lunch_end_at.split(':');
            lunchEndTime.setHours(+h, +m, 0, 0);
        }

        if (realTime.getHours() > 4 && companyFinishWork.getHours() < 4) {
            companyFinishWork.setDate(companyFinishWork.getDate() + 1);
        } else if (
            realTime.getHours() < 4 && companyStartWork.getHours() > 4 && companyFinishWork.getHours() < 4 && realTime.getHours() < companyFinishWork.getHours()
        ) {
            companyStartWork.setDate(companyStartWork.getDate() - 1)
        }

        const working = (realTime >= companyStartWork && realTime < companyFinishWork) || !!schedule.is_day_and_night;

        const lunch = schedule.lunch_start_at && schedule.lunch_end_at ? realTime >= lunchStartTime && realTime < lunchEndTime : false;

        setIsWorking(working);
        setAtLunch(lunch);
        setIsClosed(!(working || lunch));
    }

    return (
        <NavLink
            to={`/m/${companyId}`}
            className="flex h-full cursor-pointer flex-col gap-1.5 rounded-[18px] bg-white p-3.75 max-sm:flex-row max-sm:max-h-36 max-sm:px-2.5 max-sm:py-2.75">
            {/* IMAGE */}
            <div className="relative h-44.75 w-full max-sm:max-w-46.25 max-sm:h-full">
                {companyImage && (
                    <img className="h-44.75 w-full rounded-2xl border border-[#D0D0D0] object-cover"
                        src={`${imageUrl}/${companyImage.file_name}`}
                        alt={companyTitle} />
                )}

                {/* STATUS ICON */}
                {!companyOwn ? (
                    <div className={`absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full 
                                    ${isWorking ? 'bg-[#00D7AC]' : atLunch ? 'bg-[#FFDC3F]' : isClosed ? 'bg-[#FF8282]' : ''}`}>
                        <FaRegClock className="pi pi-clock text-sm text-white" />
                    </div>
                ) : (
                    /* OWNER MENU */
                    <div className="absolute right-2 top-2">
                        <div className="relative flex justify-end">
                            <i className="pi pi-ellipsis-v rounded-full bg-white p-1.5 duration-200"
                                onClick={(e) => {
                                    eventsClick(e)
                                    setShowMenu(!showMenu)
                                }} />

                            {showMenu && (
                                <ul className="absolute right-0 top-7.5 z-100 flex w-max flex-col overflow-auto rounded-2xl bg-(--body-bg-color) shadow-xl"
                                    onClick={(e) => e.stopPropagation()}>
                                    <li className="cursor-pointer px-3.25 py-2.5 font-semibold text-(--text-color) hover:bg-white/30 duration-200"
                                        onClick={eventsClick}>
                                        <NavLink to={`/m/${companyId}`}>Просмотр</NavLink>
                                    </li>

                                    <li className="cursor-pointer border-y border-white px-3.25 py-2.5 font-semibold text-(--text-color) hover:bg-white/30 duration-200"
                                        onClick={eventsClick}>
                                        <NavLink to={`/u/a-c/${companyId}`}>Редактирование</NavLink>
                                    </li>

                                    <li className="cursor-pointer px-3.25 py-2.5 font-semibold text-(--text-color) hover:bg-white/30 duration-200"
                                        onClick={(e) => {
                                            eventsClick(e)
                                            updateCompanyStatus()
                                        }}>
                                        {companyStatus ? 'Скрыть' : 'Показать'}
                                    </li>
                                </ul>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* CONTENT */}
            <div className="flex h-full w-full flex-col justify-between gap-3 max-sm:gap-1.5">
                <div className="flex flex-col gap-1.5">
                    <h3 className="line-clamp-2 text-[24px] font-bold text-(--bg-color) max-sm:text-[20px]">
                        {companyTitle}
                    </h3>

                    <div className={`flex flex-wrap gap-1.5 overflow-hidden ${companyTitle.length <= 15 ? 'max-h-14' : 'max-h-6.25'}`}>
                        {companyTags.map((tag, index) => (
                            <div key={index} className="flex max-h-6.25 items-center justify-center rounded-xl bg-[#F0F0F0CC]
                                                        px-2.5 py-1.25 text-[13px]">
                                <span className="line-clamp-1">{tag.tag_name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAVORITES */}
                {favoritesCount >= 0 && (
                    <div className="flex items-center gap-1.25"
                        onClick={(e) => {
                            eventsClick(e)
                            toggleFavoriteCard()
                        }}>
                        {!isFavorite ? (
                            <FaRegHeart className={`text-xl text-[#FF7676]`} />
                        ) : (
                            <FaHeart className={`text-xl text-[#FF7676]`} />
                        )}
                        <span className="text-[18px] text-[#FF7676]">
                            {favoritesCount}
                        </span>
                    </div>
                )}
            </div>
        </NavLink>
    )
}

export default CompanyCard