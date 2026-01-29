import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import { getCategories } from "../../core/services/dictionary.service";
import type { IResponse } from "../../core/models/response.model";
import { NavLink } from "react-router-dom";

const Menu = ({ currentPage }: {currentPage: string}) => {
  const { data: categories } = useQuery<IResponse<{ id: number, name: string }[]>>({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 30 * 60 * 1000
  });
  const [categoryListCount, setCategoryListCount] = useState(5);
  const [isFull, setIsFull] = useState(false);

  const toggleFull = () => {
    if (isFull) {
      setCategoryListCount(5);
    } else {
      setCategoryListCount(20);
    }
    setIsFull(!isFull);
  }

  return (
    <aside className="max-w-70 max-h-162.5 overflow-auto rounded-[18px] z-1000">
      <div className="flex flex-col w-full max-h-162.5 overflow-auto">
        <button className="group flex items-center gap-2 w-full min-h-12.5
             px-4 py-3 text-left break-all
             text-[16px] font-semibold bg-(--bg-color) text-white cursor-pointer">
          {currentPage}
        </button>
        {categories?.data.slice(0, categoryListCount).map((category) => (
          <NavLink to={`/m-i?category_ids=${category.id}`} key={category.id} className="group flex items-center gap-2 w-full min-h-12.5
             bg-white border-b border-[#EAEAEA]
             px-4 py-3 text-left break-all
             text-[16px] font-semibold text-black
             transition duration-200
             hover:bg-(--bg-color)/80 hover:text-white cursor-pointer">
            {category.name}
          </NavLink>
        ))}
        <button onClick={toggleFull} className="flex items-center gap-2 w-full min-h-12.5 bg-white border-b border-[#EAEAEA] px-4 py-3 text-left break-all text-[16px] font-semibold text-black transition duration-200 hover:bg-(--bg-color)/80 hover:text-white cursor-pointer show-more">
          <FaAngleDown className={`text-2xl duration-200 ${isFull && 'rotate-180'}`} />
          {isFull ? 'Меньше' : 'Еще'}
        </button>
      </div>
    </aside>
  )
}

export default Menu;