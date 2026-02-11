import type { IResponse } from "../models/response.model";
import { api } from "./api.service";

export function getCategories(): Promise<IResponse<{id: number, name: string, icon: string}[]>> {
    return api.request<IResponse<{id: number, name: string, icon: string}[]>>('categories');
}

export function getTags(): Promise<IResponse<{id: number, name: string}[]>> {
    return api.request<IResponse<{id: number, name: string}[]>>('tags');
}

export function getTagsByCategory(category_id: number): Promise<IResponse<{id: number, name: string}[]>> {
    return api.request<IResponse<{id: number, name: string}[]>>('tags/by_category', {
        queryParams: category_id ? { category_id: category_id.toString() } : {}
    });
}

export function getRegions(): Promise<IResponse<{id: number, name: string}[]>> {
    return api.request<IResponse<{id: number, name: string}[]>>('regions');
}

export function getCities(): Promise<IResponse<{id: number, name: string}[]>> {
    return api.request<IResponse<{id: number, name: string}[]>>('cities');
}