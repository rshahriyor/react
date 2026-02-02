import type { IFile } from "../models/company.model";
import type { IResponse } from "../models/response.model";
import { api } from "./api.service";

type UploadPayload = {
  formData: FormData;
  index: number;
  preview: string
};

export function uploadFile(file: UploadPayload): Promise<IResponse<IFile>> {
  return api.request<IResponse<IFile>>('files/upload',
    {
        method: 'POST',
        body: file.formData
    }
  )
}