import { environment } from "../../../environments/environment";
import type { IResponse } from "../models/response.model";

const API_URL = `${environment.apiUrl}/login`;

export function login({username, password}: {username: string, password: string}): Promise<IResponse<{token: string}>> {
    return fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password})
    }).then(response => response.json());
}