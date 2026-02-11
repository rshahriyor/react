import type { IResponse } from "../models/response.model";
import { api } from "./api.service";

export function login({ username, password }: { username: string, password: string }): Promise<IResponse<{ token: string }>> {
    return api.request<IResponse<{ token: string }>>(
        'login',
        {
            method: 'POST',
            body: {
                username,
                password
            }
        }
    );
}