import type { ICompanyForm } from "../models/company-form.model";
import type { ICompaniesResponseForMainPage, ICompany } from "../models/company.model";
import type { IFilterRequest } from "../models/filter.model";
import type { IResponse } from "../models/response.model";
import { api } from "./api.service";

export function getCompanies(): Promise<IResponse<ICompaniesResponseForMainPage[]>> {
    return api.request<IResponse<ICompaniesResponseForMainPage[]>>('companies/for_main_page');
}

export function getCompaniesByFilter(filter: IFilterRequest): Promise<IResponse<ICompany[]>> {
    return api.request<IResponse<ICompany[]>>(
        'companies/by_filter',
        {
            queryParams: {
                category_ids: filter.category_ids?.length
                    ? filter.category_ids.join(',')
                    : undefined,

                tag_ids: filter.tag_ids?.length
                    ? filter.tag_ids.join(',')
                    : undefined,

                region_ids: filter.region_ids?.length
                    ? filter.region_ids.join(',')
                    : undefined,

                city_ids: filter.city_ids?.length
                    ? filter.city_ids.join(',')
                    : undefined,

                is_favorite: filter.is_favorite ? 'true' : undefined,
            }
        }
    );
}

export function getCompany(companyId: number): Promise<IResponse<ICompany>> {
    return api.request<IResponse<ICompany>>(`companies/${companyId}`);
}

export function getMyCompanies(): Promise<IResponse<ICompany[]>> {
    return api.request<IResponse<ICompany[]>>('companies/own');
}

export function postCompany(company: ICompanyForm): Promise<IResponse<ICompany>> {
    return api.request<IResponse<ICompany>>('companies', {
        method: 'POST',
        body: company
    })
}

export function putCompany(companyId: number, company: ICompanyForm): Promise<IResponse<ICompany>> {
    return api.request<IResponse<ICompany>>(`companies/${companyId}`, {
        method: 'PUT',
        body: company
    })
}

export function toggleCompanyFavorite(companyId: number, body: {}): Promise<IResponse<{message: string}>> {
    return api.request<IResponse<{message: string}>>(`companies/toggle_favorite/${companyId}`, {
        method: 'POST',
        body: body
    });
}