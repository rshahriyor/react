import { environment } from "../../../environments/environment";
import type { IResponse } from "../models/response.model";

const API_URL = `${environment.apiUrl}`;

export function getCategories(): Promise<IResponse<{id: number, name: string, icon: string}[]>> {
    return fetch(`${API_URL}/categories`).then(response => response.json());
}

export function getTags(): Promise<IResponse<{id: number, name: string}[]>> {
    return fetch(`${API_URL}/tags`).then(response => response.json());
}

export function getRegions(): Promise<IResponse<{id: number, name: string}[]>> {
    return fetch(`${API_URL}/regions`).then(response => response.json());
}

export function getCities(): Promise<IResponse<{id: number, name: string}[]>> {
    return fetch(`${API_URL}/cities`).then(response => response.json());
}