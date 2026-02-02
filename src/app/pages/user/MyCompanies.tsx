import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import type { ICompany } from "../../core/models/Company";
import type { IResponse } from "../../core/models/response.model";
import { getMyCompanies } from "../../core/services/company.service";
import CompanyCard from "../../components/shared/CompanyCard";

const MyCompanies = () => {
  const { data: companies } = useQuery<IResponse<ICompany[]>>({
    queryKey: ['my_companies'],
    queryFn: getMyCompanies,
    staleTime: 60 * 1000
  });
  
  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-center justify-between h-12.5">
        <p className="my-0 text-(--text-color) text-[28px] font-semibold">Мои заведения</p>
        <Link to={'../c-f'} type="button" className="cursor-pointer bg-(--bg-color) border-0 max-w-70 w-full h-12.5 rounded-[18px] text-white text-[18px] font-bold transition-all duration-300 text-center flex items-center justify-center">
          + Добавить заведения
        </Link>
      </div>

      <div className="w-full">
        <div className="flex flex-wrap gap-5">
          {companies?.data.map((company) => (
            <div key={company.id} className="max-w-70 w-full">
              <CompanyCard companyId={company.id || 0} companyTitle={company.name || ''} companyOwn={true}
                companyTags={company.tags || []} companyImage={company.files?.[0]} companyStatus={company?.is_active}
                isFavorite={company.is_favorite || false} favoritesCount={company.favorites_count || 0} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MyCompanies;