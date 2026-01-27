import { environment } from "../../../environments/environment";
import type { ICompaniesResponseForMainPage } from "../models/Company";
import type { IResponse } from "../models/response.model";

const API_URL = `${environment.apiUrl}/companies`;

export function getCompanies(): Promise<IResponse<ICompaniesResponseForMainPage[]>> {
    return fetch(`${API_URL}/for_main_page`).then(response => response.json());
}