import { Link } from "react-router-dom";
import MainBanner from "../assets/main-banner.png";
import RightSideImage from "../assets/right-side-main-image.svg";
import { useQuery } from "@tanstack/react-query";
import { getCompanies } from "../core/services/company.service";
import { FaArrowRight } from "react-icons/fa";
import type { ICompaniesResponseForMainPage } from "../core/models/Company";
import type { IResponse } from "../core/models/response.model";

interface TitleTempProps {
  name: string;
  id: number;
}

const Home = () => {
  const { data: companies } = useQuery<IResponse<ICompaniesResponseForMainPage[]>>({
    queryKey: ['companies'],
    queryFn: getCompanies,
  });

  return (
    <>
      <div className="flex gap-5">
        <div className="max-w-70 w-full">
        </div>
        <div className="max-w-145 w-full cursor-pointer">
          <img src={MainBanner} alt="main_banner" className="w-full h-full max-h-87.5 rounded-[18px]" />
        </div>
        <div className="max-w-70 w-full cursor-pointer">
          <img src={RightSideImage} alt="second_main_banner" className="w-full rounded-[18px]" />
        </div>
      </div >

      {companies?.data && companies.data?.map((category: { category_name: string; category_id: number; companies: any[] }) => (
        category.companies?.length > 0 && (
          <div className="mt-2.5">
            <TitleTemp key={category.category_id} name={category.category_name || ''} id={category.category_id || 0} />
          </div>
        )
      ))}
    </>
  )
}

const TitleTemp: React.FC<TitleTempProps> = ({ name, id }) => {
  return (
    <div className="flex justify-between items-center">
      <div className="gap-3.5 flex items-center">
        <p className="text-[35px] font-bold m-0 text-(--text-color)">{name}</p>
      </div>
      <Link to={`/m-i/?category_ids=${id}`}
        className="flex justify-center items-center cursor-pointer gap-1.75 max-w-25 w-full h-11.5 py-2.5 px-2.75 rounded-[18px] bg-white border border-[#ECEEEF] duration-300">
        <span className="view-all-label">Еще</span>
        <FaArrowRight />
      </Link >
    </div >
  );
};

export default Home;