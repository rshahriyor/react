import type { ISchedule } from "./schedule.model";

export interface ICompanyForm {
  name: string;
  category_id: number | null;
  phone_number: string;
  region_id: number | null;
  city_id: number | null;
  address: string;
  longitude: string;
  latitude: string;
  is_active: boolean;
  file_ids?: number[] | null;
  schedules: ISchedule[];
  social_media: {
    social_media_id?: number;
    account_url?: string;
  }[];
  lunch_start_at: string;
  lunch_end_at: string;
  desc?: string;
}