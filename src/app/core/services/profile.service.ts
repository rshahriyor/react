import type { IResponse } from "../models/response.model";
import type { IUser } from "../models/user.model";
import { api } from "./api.service";

export function getProfile(): Promise<IResponse<IUser>> {
    return api.request<IResponse<IUser>>('users/own');
}

export function updateProfile(body: IUser): Promise<IResponse<IUser>> {
    return api.request<IResponse<IUser>>('users/own', {
        method: 'PUT',
        body
    });
}