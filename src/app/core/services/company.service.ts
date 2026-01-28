import { environment } from "../../../environments/environment";
import type { ICompaniesResponseForMainPage, ICompany } from "../models/Company";
import type { IFilterRequest } from "../models/filter.model";
import type { IResponse } from "../models/response.model";

const API_URL = `${environment.apiUrl}/companies`;

export function getCompanies(): Promise<IResponse<ICompaniesResponseForMainPage[]>> {
    return fetch(`${API_URL}/for_main_page`).then(response => response.json());
}

export function getCompaniesByFilter(filter: IFilterRequest): Promise<IResponse<ICompany[]>> {
    let params = new URLSearchParams();

    if (filter.category_ids.length > 0) {
        params.set('category_ids', filter.category_ids.join(','));
    }

    if (filter.tag_ids.length > 0) {
        params.set('tag_ids', filter.tag_ids.join(','));
    }

    if (filter.region_ids.length > 0) {
        params.set('region_ids', filter.region_ids.join(','));
    }

    if (filter.city_ids.length > 0) {
        params.set('city_ids', filter.city_ids.join(','));
    }

    if (filter.is_favorite) {
        params.set('is_favorite', 'true');
    }

    return fetch(`${API_URL}/by_filter?${params.toString()}`).then(response => response.json());
}