import { useQuery } from "@tanstack/react-query";
import Filter from "../components/shared/Filter"
import { useEffect, useState, type ChangeEvent } from "react"
import type { IResponse } from "../core/models/response.model";
import { getCategories, getCities, getRegions, getTags } from "../core/services/dictionary.service";
import type { IFilterRequest } from "../core/models/filter.model";
import type { ICompany } from "../core/models/company.model";
import { getCompaniesByFilter } from "../core/services/company.service";
import CompanyCard from "../components/shared/CompanyCard";
import { useSearchParams } from "react-router-dom";

const CompanyFilter = () => {
  const staleTime = 30 * 60 * 1000;
  const [searchParams, setSearchParams] = useSearchParams();
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
  const [categorySearch, setCategorySearch] = useState('');
  const [tagSearch, setTagSearch] = useState('');
  const [regionSearch, setRegionSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');

  useEffect(() => {
    const categoryIds = searchParams.get('category_ids')?.split(',').map(Number) || [];
    const tagIds = searchParams.get('tag_ids')?.split(',').map(Number) || [];
    const regionIds = searchParams.get('region_ids')?.split(',').map(Number) || [];
    const cityIds = searchParams.get('city_ids')?.split(',').map(Number) || [];
    const isFavorite = searchParams.get('is_favorite') === 'true';

    setFilterRequest({
      category_ids: categoryIds,
      tag_ids: tagIds,
      region_ids: regionIds,
      city_ids: cityIds,
      is_favorite: isFavorite
    });
    console.log(categoryIds);

  }, [searchParams]);

  const { data: companies, isLoading } = useQuery<IResponse<ICompany[]>>({
    queryKey: ['companies_by_filter', filterRequest],
    queryFn: () => getCompaniesByFilter(filterRequest)
  });

  const { data: categories } = useQuery<IResponse<{ id: number, name: string }[]>>({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime
  });

  const { data: tags } = useQuery<IResponse<{ id: number, name: string }[]>>({
    queryKey: ['tags'],
    queryFn: getTags,
    staleTime
  });

  const { data: regions } = useQuery<IResponse<{ id: number, name: string }[]>>({
    queryKey: ['regions'],
    queryFn: getRegions,
    staleTime
  });

  const { data: cities } = useQuery<IResponse<{ id: number, name: string }[]>>({
    queryKey: ['cities'],
    queryFn: getCities,
    staleTime
  });

  const categoryFilteredOptions = categories?.data.filter(category => category.name.toLowerCase().includes(categorySearch.toLowerCase())) || [];
  const tagFilteredOptions = tags?.data.filter(tag => tag.name.toLowerCase().includes(tagSearch.toLowerCase())) || [];
  const regionFilteredOptions = regions?.data.filter(region => region.name.toLowerCase().includes(regionSearch.toLowerCase())) || [];
  const cityFilteredOptions = cities?.data.filter(city => city.name.toLowerCase().includes(citySearch.toLowerCase())) || [];

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

  const toggleSelectAll = (event: ChangeEvent<HTMLInputElement>, type: 'category_ids' | 'tag_ids' | 'region_ids' | 'city_ids') => {
    const isChecked = (event.target as HTMLInputElement).checked;
    const nextParams = new URLSearchParams(searchParams);
    if (isChecked) {
      const ids = getIdsByType(type);
      nextParams.set(type, ids.join(','));
    } else {
      nextParams.delete(type);
    }
    setSearchParams(nextParams);
  }

  function getIdsByType(type: 'category_ids' | 'tag_ids' | 'region_ids' | 'city_ids') {
    switch (type) {
      case 'category_ids':
        return categories?.data.map(category => category.id) || [];
      case 'tag_ids':
        return tags?.data.map(tag => tag.id) || [];
      case 'region_ids':
        return regions?.data.map(region => region.id) || [];
      case 'city_ids':
        return cities?.data.map(city => city.id) || [];
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
            <li className="flex items-center gap-4.25 px-2">
              <input onChange={(event) => toggleSelectAll(event, 'category_ids')} checked={!!categories?.data.length && filterRequest.category_ids.length === categories.data.length} type="checkbox" className="custom-checkbox" />
              <div className="relative max-w-50 w-full">
                <input value={categorySearch} onChange={(e) => setCategorySearch(e.target.value)} type="text" className="max-w-50 h-10! liquid-glass-input" />
                <i className="pi pi-search absolute top-1/2 right-4.5 transform -translate-y-1/2 text-(--text-color)"></i>
              </div>
            </li>
            <div className="max-h-70 overflow-auto">
              {categoryFilteredOptions?.slice(0, showAllFilter.companyCategory ? categoryFilteredOptions.length : 5).map((category) => (
                <Filter key={category.id} id={category.id} label={category.name} filterRequestType="category_ids" />
              ))}
            </div>
            {categoryFilteredOptions && categoryFilteredOptions.length > 5 && (
              <div onClick={() => loadFilterWithoutLimit('company_categories')} className="flex items-center gap-2.5">
                <span className="text-[#4A6FF1] font-medium text-[14px] cursor-pointer w-fit border border-[#CECECE] ml-9.25 px-3.75 py-1 rounded-lg transition duration-300 hover:bg-[#CECECE20]">{showAllFilter.companyCategory ? 'Скрыть' : 'Показать все'}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold">Теги</span>
          <div className="flex flex-col gap-1.5">
            <li className="flex items-center gap-4.25 px-2">
              <input onChange={(event) => toggleSelectAll(event, 'tag_ids')} checked={!!tags?.data.length && filterRequest.tag_ids.length === tags.data.length} type="checkbox" className="custom-checkbox" />
              <div className="relative max-w-50 w-full">
                <input value={tagSearch} onChange={(e) => setTagSearch(e.target.value)} type="text" className="max-w-50 h-10! liquid-glass-input" />
                <i className="pi pi-search absolute top-1/2 right-4.5 transform -translate-y-1/2 text-(--text-color)"></i>
              </div>
            </li>
            <div className="max-h-70 overflow-auto">
              {tagFilteredOptions.slice(0, showAllFilter.companyTag ? tagFilteredOptions.length : 5).map((tag) => (
                <Filter key={tag.id} id={tag.id} label={tag.name} filterRequestType="tag_ids" />
              ))}
            </div>
            {tagFilteredOptions && tagFilteredOptions.length > 5 && (
              <div onClick={() => loadFilterWithoutLimit('company_tags')} className="flex items-center gap-2.5">
                <span className="text-[#4A6FF1] font-medium text-[14px] cursor-pointer w-fit border border-[#CECECE] ml-9.25 px-3.75 py-1 rounded-lg transition duration-300 hover:bg-[#CECECE20]">{showAllFilter.companyTag ? 'Скрыть' : 'Показать все'}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold">Регионы</span>
          <div className="flex flex-col gap-1.5">
            <li className="flex items-center gap-4.25 px-2">
              <input onChange={(event) => toggleSelectAll(event, 'region_ids')} checked={!!regions?.data.length && filterRequest.region_ids.length === regions.data.length} type="checkbox" className="custom-checkbox" />
              <div className="relative max-w-50 w-full">
                <input value={regionSearch} onChange={(e) => setRegionSearch(e.target.value)} type="text" className="max-w-50 h-10! liquid-glass-input" />
                <i className="pi pi-search absolute top-1/2 right-4.5 transform -translate-y-1/2 text-(--text-color)"></i>
              </div>
            </li>
            <div className="max-h-70 overflow-auto">
              {regionFilteredOptions.slice(0, showAllFilter.region ? regionFilteredOptions.length : 5).map((rgn) => (
                <Filter key={rgn.id} id={rgn.id} label={rgn.name} filterRequestType="region_ids" />
              ))}
            </div>
            {regionFilteredOptions && regionFilteredOptions.length > 5 && (
              <div onClick={() => loadFilterWithoutLimit('regions')} className="flex items-center gap-2.5">
                <span className="text-[#4A6FF1] font-medium text-[14px] cursor-pointer w-fit border border-[#CECECE] ml-9.25 px-3.75 py-1 rounded-lg transition duration-300 hover:bg-[#CECECE20]">{showAllFilter.region ? 'Скрыть' : 'Показать все'}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold">Города</span>
          <div className="flex flex-col gap-1.5">
            <li className="flex items-center gap-4.25 px-2">
              <input onChange={(event) => toggleSelectAll(event, 'city_ids')} checked={!!cities?.data.length && filterRequest.city_ids.length === cities.data.length} type="checkbox" className="custom-checkbox" />
              <div className="relative max-w-50 w-full">
                <input value={citySearch} onChange={(e) => setCitySearch(e.target.value)} type="text" className="max-w-50 h-10! liquid-glass-input" />
                <i className="pi pi-search absolute top-1/2 right-4.5 transform -translate-y-1/2 text-(--text-color)"></i>
              </div>
            </li>
            <div className="max-h-70 overflow-auto">
              {cityFilteredOptions.slice(0, showAllFilter.city ? cityFilteredOptions.length : 5).map((city) => (
                <Filter key={city.id} id={city.id} label={city.name} filterRequestType="city_ids" />
              ))}
            </div>
            {cityFilteredOptions && cityFilteredOptions.length > 5 && (
              <div onClick={() => loadFilterWithoutLimit('cities')} className="flex items-center gap-2.5">
                <span className="text-[#4A6FF1] font-medium text-[14px] cursor-pointer w-fit border border-[#CECECE] ml-9.25 px-3.75 py-1 rounded-lg transition duration-300 hover:bg-[#CECECE20]">{showAllFilter.city ? 'Скрыть' : 'Показать все'}</span>
              </div>
            )}
          </div>
        </div>
      </aside>
      <div className="w-full flex flex-col gap-5">
        <p className="text-[32px] font-semibold m-0 text-(--text-color)">{filterRequest.is_favorite ? 'Избранные' : 'Результаты поиска'}</p>
        {!isLoading ? (
          <div className="flex flex-wrap gap-5">
            {companies?.data.map((company) => (
              <div key={company.id} className="max-w-70 w-full">
                <CompanyCard companyId={company.id || 0} companyTitle={company.name || ''} companyOwn={false}
                  companyTags={company.tags || []} companyImage={company.files?.[0]} isFavorite={company.is_favorite || false}
                  favoritesCount={company.favorites_count || 0} schedule={company.schedules?.[0]} />
              </div>
            ))}
            {!companies?.data.length && (
              <p className="text-[26px] font-medium m-0 text-[#52526190]">К сожалению нет данных</p>
            )}
          </div>
        ) : (
          <p className="text-[26px] font-medium m-0 text-[#52526190]">Loading...</p>
        )}
      </div>
    </section>
  )
}

export default CompanyFilter;