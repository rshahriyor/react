export interface ISchedule {
    day_of_week?: number,
    start_at?: string,
    end_at?: string,
    lunch_start_at?: string,
    lunch_end_at?: string,
    is_working_day?: boolean,
    is_day_and_night?: boolean,
    without_breaks?: boolean
}