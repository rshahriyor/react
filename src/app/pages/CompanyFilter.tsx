import { useQuery } from "@tanstack/react-query";
import Filter from "../components/shared/Filter"
import { useState, type ChangeEvent } from "react"
import type { IResponse } from "../core/models/response.model";
import { getCategories, getCities, getRegions, getTags } from "../core/services/dictionary.service";
import { FaSearch } from "react-icons/fa";
import type { IFilterRequest } from "../core/models/filter.model";
import type { ICompany } from "../core/models/Company";
import { getCompaniesByFilter } from "../core/services/company.service";
import CompanyCard from "../components/shared/CompanyCard";

const CompanyFilter = () => {
  const { data: companies } = useQuery<IResponse<ICompany[]>>({
    queryKey: ['companies'],
    queryFn: () => getCompaniesByFilter(filterRequest)
  });

  const { data: categories } = useQuery<IResponse<{ id: number, name: string }[]>>({
    queryKey: ['categories'],
    queryFn: getCategories
  });

  const { data: tags } = useQuery<IResponse<{ id: number, name: string }[]>>({
    queryKey: ['tags'],
    queryFn: getTags
  });

  const { data: regions } = useQuery<IResponse<{ id: number, name: string }[]>>({
    queryKey: ['regions'],
    queryFn: getRegions
  });

  const { data: cities } = useQuery<IResponse<{ id: number, name: string }[]>>({
    queryKey: ['cities'],
    queryFn: getCities
  });

  const [filterRequest, setFilterRequest] = useState<IFilterRequest>({
    category_ids: [],
    tag_ids: [],
    region_ids: [],
    city_ids: [],
    is_favorite: false
  });

  const [showAllFilter, setShowAllFilter] = useState({
    companyCategory: false,
    companyTag: false,
    city: false,
    region: false
  });

  const loadFilterWithoutLimit = (filterType: 'company_categories' | 'company_tags' | 'regions' | 'cities') => {
    switch (filterType) {
      case 'company_categories':
        setShowAllFilter(prev => ({ ...prev, companyCategory: !prev.companyCategory }));
        break;
      case 'company_tags':
        setShowAllFilter(prev => ({ ...prev, companyTag: !prev.companyTag }));
        break;
      case 'regions':
        setShowAllFilter(prev => ({ ...prev, region: !prev.region }));
        break;
      case 'cities':
        setShowAllFilter(prev => ({ ...prev, city: !prev.city }));
        break;
    }
  };

  const toggleSelectAll = (event: ChangeEvent<HTMLInputElement>, filterRequestType: 'category_ids' | 'tag_ids' | 'region_ids' | 'city_ids') => {
    const isChecked = (event.target as HTMLInputElement).checked;
    switch (filterRequestType) {
      case 'category_ids':
        if (isChecked && categories?.data) {
          setFilterRequest(prev => ({ ...prev, category_ids: categories.data.map(category => category.id) }));
        } else {
          setFilterRequest(prev => ({ ...prev, category_ids: [] }));
        }
        break;
    }
  }


  return (
    <section className="flex gap-5">
      <aside className="max-w-70 w-full flex flex-col gap-5">
        <div className="flex items-center gap-2.5">
          <i className="pi pi-filter text-3xl text-(--text-color)"></i>
          <p className="my-0 font-semibold text-(--text-color) text-[32px]">Фильтры</p>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold">Категории</span>
          <div className="flex flex-col gap-1.5">
            <li className="flex items-center gap-4.25">
              <input onChange={(event) => toggleSelectAll(event, 'category_ids')} checked={!!categories?.data.length && filterRequest.category_ids.length === categories.data.length} type="checkbox" className="custom-checkbox" />
              <div className="relative max-w-50 w-full">
                <input type="text" className="max-w-50 h-10! liquid-glass-input" />
                <FaSearch className="absolute top-1/2 right-4.5 transform -translate-y-1/2 text-(--text-color)" />
              </div>
            </li>
            <div className="max-h-70 overflow-auto">
              {categories?.data.slice(0, showAllFilter.companyCategory ? categories.data.length : 5).map((category) => (
                <Filter key={category.id} id={category.id} label={category.name} filterRequestType="category_ids" />
              ))}
            </div>
            {categories?.data && categories.data.length > 5 && (
              <div onClick={() => loadFilterWithoutLimit('company_categories')} className="flex items-center gap-2.5">
                <span className="text-[#4A6FF1] font-medium text-[14px] cursor-pointer w-fit border border-[#CECECE] ml-9.25 px-3.75 py-1 rounded-lg transition duration-300 hover:bg-[#CECECE20]">{showAllFilter.companyCategory ? 'Скрыть' : 'Показать все'}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold">Теги</span>
          <div className="flex flex-col gap-1.5">
            <li className="flex items-center gap-4.25">
              <input onChange={(event) => toggleSelectAll(event, 'tag_ids')} checked={!!tags?.data.length && filterRequest.tag_ids.length === tags.data.length} type="checkbox" className="custom-checkbox" />
              <div className="relative max-w-50 w-full">
                <input type="text" className="max-w-50 h-10! liquid-glass-input" />
                <FaSearch className="absolute top-1/2 right-4.5 transform -translate-y-1/2 text-(--text-color)" />
              </div>
            </li>
            <div className="max-h-70 overflow-auto">
              {tags?.data.slice(0, showAllFilter.companyTag ? tags.data.length : 5).map((tag) => (
                <Filter key={tag.id} id={tag.id} label={tag.name} filterRequestType="tag_ids" />
              ))}
            </div>
            {tags?.data && tags.data.length > 5 && (
              <div onClick={() => loadFilterWithoutLimit('company_tags')} className="flex items-center gap-2.5">
                <span className="text-[#4A6FF1] font-medium text-[14px] cursor-pointer w-fit border border-[#CECECE] ml-9.25 px-3.75 py-1 rounded-lg transition duration-300 hover:bg-[#CECECE20]">{showAllFilter.companyTag ? 'Скрыть' : 'Показать все'}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold">Регионы</span>
          <div className="flex flex-col gap-1.5">
            <li className="flex items-center gap-4.25">
              <input onChange={(event) => toggleSelectAll(event, 'region_ids')} checked={!!regions?.data.length && filterRequest.region_ids.length === regions.data.length} type="checkbox" className="custom-checkbox" />
              <div className="relative max-w-50 w-full">
                <input type="text" className="max-w-50 h-10! liquid-glass-input" />
                <FaSearch className="absolute top-1/2 right-4.5 transform -translate-y-1/2 text-(--text-color)" />
              </div>
            </li>
            <div className="max-h-70 overflow-auto">
              {regions?.data.slice(0, showAllFilter.region ? regions.data.length : 5).map((rgn) => (
                <Filter key={rgn.id} id={rgn.id} label={rgn.name} filterRequestType="region_ids" />
              ))}
            </div>
            {regions?.data && regions.data.length > 5 && (
              <div onClick={() => loadFilterWithoutLimit('regions')} className="flex items-center gap-2.5">
                <span className="text-[#4A6FF1] font-medium text-[14px] cursor-pointer w-fit border border-[#CECECE] ml-9.25 px-3.75 py-1 rounded-lg transition duration-300 hover:bg-[#CECECE20]">{showAllFilter.region ? 'Скрыть' : 'Показать все'}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold">Города</span>
          <div className="flex flex-col gap-1.5">
            <li className="flex items-center gap-4.25">
              <input onChange={(event) => toggleSelectAll(event, 'city_ids')} checked={!!cities?.data.length && filterRequest.city_ids.length === cities.data.length} type="checkbox" className="custom-checkbox" />
              <div className="relative max-w-50 w-full">
                <input type="text" className="max-w-50 h-10! liquid-glass-input" />
                <FaSearch className="absolute top-1/2 right-4.5 transform -translate-y-1/2 text-(--text-color)" />
              </div>
            </li>
            <div className="max-h-70 overflow-auto">
              {cities?.data.slice(0, showAllFilter.city ? cities.data.length : 5).map((city) => (
                <Filter key={city.id} id={city.id} label={city.name} filterRequestType="city_ids" />
              ))}
            </div>
            {cities?.data && cities.data.length > 5 && (
              <div onClick={() => loadFilterWithoutLimit('cities')} className="flex items-center gap-2.5">
                <span className="text-[#4A6FF1] font-medium text-[14px] cursor-pointer w-fit border border-[#CECECE] ml-9.25 px-3.75 py-1 rounded-lg transition duration-300 hover:bg-[#CECECE20]">{showAllFilter.city ? 'Скрыть' : 'Показать все'}</span>
              </div>
            )}
          </div>
        </div>
      </aside>
      <div className="w-full flex flex-col gap-5">
        <p className="text-[32px] font-semibold m-0 text-(--text-color)">{filterRequest.is_favorite ? 'Избранные' : 'Результаты поиска'}</p>
        <div className="flex flex-wrap gap-5">
          {companies?.data.map((company) => (
            <div key={company.id} className="max-w-70 w-full">
              <CompanyCard companyId={company.id || 0} companyTitle={company.name || ''} companyOwn={false}
                companyTags={company.tags || []} companyImage={company.files?.[0]} companyStatus={company?.is_active || false}
                isFavorite={company.is_favorite || false} favoritesCount={company.favorites_count || 0} schedule={company.schedules?.[0]} />
            </div>
          ))}
          {!companies?.data.length && (
            <p className="text-[26px] font-medium m-0 text-[#52526190]">К сожалению нет данных</p>
          )}
        </div>
      </div>
    </section>
  )
}

export default CompanyFilter;