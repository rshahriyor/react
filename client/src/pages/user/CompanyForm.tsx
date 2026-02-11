import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import Dropdown from "../../shared/ui/Dropdown";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCategories, getCities, getRegions, getTagsByCategory } from "../../core/services/dictionary.service";
import type { ICompanyForm } from "../../core/models/company-form.model";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ISchedule } from "../../core/models/schedule.model";
import { useEffect, useRef, useState } from "react";
import { uploadFile } from "../../core/services/files.service";
import MultiSelect from "../../shared/ui/MultiSelect";
import { getCompany, postCompany, putCompany } from "../../core/services/company.service";
import { Link, useNavigate, useParams } from "react-router-dom";
import { environment } from "../../env/environment";
import { WEEK_DAYS } from "../../shared/utils/constants";
import { getTimeSlots } from "../../shared/utils/helper";


const imageUrl = environment.imageUrl;
const weekDays = WEEK_DAYS;
const socialMediaList = [
  { id: 1, name: "Instagram" },
  { id: 2, name: "Facebook" },
  { id: 3, name: "Telegram" },
  { id: 4, name: "WhatsApp" },
];
const timeSlots = getTimeSlots();
const socialMediaOptions = socialMediaList.map((sm) => ({ id: sm.id, name: sm.name }));
const scheduleStartTimeSlots = [{ name: 'Выходной', value: 'Выходной' }, { name: 'Круглосуточно', value: 'Круглосуточно' }, ...timeSlots];
const lunchTimeSlots = [{ name: 'Без перерыва', value: 'Без перерыва' }, ...timeSlots];

const schema = z.object({
  name: z.string(),
  category_id: z.number(),
  tag_id: z.array(z.number()),
  phone_number: z.string(),
  region_id: z.number(),
  city_id: z.number(),
  address: z.string(),
  longitude: z.string(),
  latitude: z.string(),
  desc: z.string().optional(),
  is_active: z.boolean(),
  file_ids: z.array(z.number()).optional(),
  schedules: z.array(z.object({
    start_at: z.string(),
    end_at: z.string()
  })),
  social_media: z.array(z.object({
    social_media_id: z.number().optional(),
    account_url: z.string().optional()
  })),
  lunch_start_at: z.string(),
  lunch_end_at: z.string()
});

type CompanyFormData = z.infer<typeof schema>;

const company_schedule = (schedules: ISchedule[], lunch_start_at: string, lunch_end_at: string) => {
  return schedules.map((value, index: number) => {
    const is_working_day = value.start_at !== 'Выходной';
    const is_day_and_night = value.start_at === 'Круглосуточно';
    const without_breaks = lunch_start_at === 'Без перерыва';

    let start_at = value.start_at;
    let end_at = value.end_at;

    if (!is_working_day || is_day_and_night) {
      start_at = '00:00';
      end_at = '23:59';
    }

    return {
      day_of_week: index + 1,
      start_at,
      end_at,
      is_working_day,
      is_day_and_night,
      without_breaks,
      lunch_start_at: without_breaks ? '' : lunch_start_at,
      lunch_end_at: without_breaks ? '' : lunch_end_at
    };
  });
}

const CompanyForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { control, register, watch, handleSubmit, setValue, reset } =
    useForm<CompanyFormData>({
      resolver: zodResolver(schema),
      defaultValues: {
        schedules: weekDays.map(() => ({
          start_at: '08:00',
          end_at: '17:00'
        })),
        social_media: socialMediaList.map(() => ({})),
        lunch_start_at: '12:00',
        lunch_end_at: '13:00',
        is_active: true
      }
    });

  const { fields: socialMediaFields } = useFieldArray({
    control,
    name: 'social_media'
  });

  const { fields: scheduleFields } = useFieldArray({
    control,
    name: 'schedules'
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });

  const { data: tags } = useQuery({
    queryKey: ['tags', watch('category_id')],
    queryFn: () => getTagsByCategory(watch('category_id')),
    enabled: !!watch('category_id'),
  });

  const { data: regions } = useQuery({
    queryKey: ['regions'],
    queryFn: getRegions
  });

  const { data: cities } = useQuery({
    queryKey: ['cities', watch('region_id')],
    queryFn: getCities,
    enabled: !!watch('region_id')
  });

  const { data: company } = useQuery({
    queryKey: ['company', id],
    queryFn: () => getCompany(Number(id)),
    enabled: !!id,
  });

  useEffect(() => {
    getCompanyById();
  }, [company]);

  const fileInputsRef = useRef<HTMLInputElement[]>([]);
  const [imageList, setImageList] = useState(
    Array.from({ length: 6 }).map(() => ({
      id: Math.random(),
      url: ''
    }))
  );

  const companyMutation = useMutation({
    mutationFn: postCompany,
    onSuccess: (res) => {
      if (res.status.code === 0) {
        navigate('/u/m-c');
      }
    }
  });

  const putCompanyMutation = useMutation({
    mutationFn: (data: ICompanyForm) => {
      return putCompany(Number(id), data);
    },
    onSuccess: (res) => {
      if (res.status.code === 0) {
        navigate('/u/m-c');
      }
    }
  });

  const onSubmit: SubmitHandler<ICompanyForm> = (data) => {
    const social_media = data.social_media.filter((sm) => sm.social_media_id && sm.account_url);
    const file_ids = imageList.filter(img => img.url).map(img => img.id);
    const { lunch_start_at, lunch_end_at, ...payload } = data;

    payload.social_media = social_media;
    payload.schedules = company_schedule(data.schedules, lunch_start_at ?? '', lunch_end_at ?? '');
    payload.file_ids = file_ids;

    if (id) {
      putCompanyMutation.mutate(payload);
    } else {
      companyMutation.mutate(payload);
    }
    console.log(payload);
  };

  const fileMutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: (res, variables) => {
      const { index, preview } = variables;
      if (res.status.code === 0) {
        setImageList(prevState => prevState.map((img, i) => i === index ? { id: res.data.id!, url: preview as string } : img));
      }
    }
  });

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const formData = new FormData();
      formData.append('files', file);

      fileMutation.mutate({
        formData, index, preview: reader.result as string
      });
    };

    reader.readAsDataURL(file);
  };

  const triggerFileInput = (index: number) => {
    fileInputsRef.current[index]?.click();
  };

  function getCompanyById(): void {
    if (!company?.data) return;

    const companyData = company.data;

    reset({
      name: companyData.name,
      category_id: companyData.category_id,
      tag_id: companyData.tags?.map(t => t.tag_id) ?? [],
      phone_number: companyData.phone_number,
      region_id: companyData.region_id,
      city_id: companyData.city_id,
      address: companyData.address,
      latitude: companyData.latitude,
      longitude: companyData.longitude,
      desc: companyData.desc,
      is_active: companyData.is_active,

      lunch_start_at: companyData.schedules?.[0].lunch_start_at || 'Без перерыва',
      lunch_end_at: companyData.schedules?.[0].lunch_end_at || '',

      schedules: companyData.schedules.map(s => ({
        start_at: s.is_day_and_night
          ? 'Круглосуточно'
          : s.is_working_day
            ? s.start_at
            : 'Выходной',
        end_at: s.end_at,
      })),

      social_media: socialMediaList.map(sm => {
        const found = companyData.social_media.find(
          s => s.social_media_id === sm.id
        );

        return found
          ? {
            social_media_id: found.social_media_id,
            account_url: found.account_url,
          }
          : {};
      }),
    });

    const filledImages = companyData.files.map(file => ({
      id: file.id!,
      url: `${imageUrl}/${file.file_name!}`,
    }));

    const emptyImages = Array.from({
      length: 6 - filledImages.length,
    }).map(() => ({
      id: Math.random(),
      url: '',
    }));

    setImageList([...filledImages, ...emptyImages]);
  }

  return (
    <section className="w-full max-w-145 flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <i className="pi pi-building text-[28px] text-(--text-color)" />
        <p className="text-[28px] font-semibold text-(--text-color)">
          {id ? 'Редактирование заведения' : 'Добавлении заведения'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit, (errors) => console.log(errors))} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="w-fit relative text-lg mb-0.75 required font-semibold text-(--text-color)">Введите название</span>
          <input className="liquid-glass-input"
            {...register('name')} />
        </label>

        <div className="flex flex-col gap-1">
          <span className="w-fit relative text-lg mb-0.75 required font-semibold text-(--text-color)">Категории</span>
          <Dropdown options={categories?.data || []}
            value={watch('category_id')}
            onChange={v => setValue('category_id', v)}
            optionLabel="name"
            optionValue="id"
            showFilter />
        </div>

        {watch('category_id') && (
          <div className="flex flex-col gap-1">
            <span className="w-fit relative text-lg mb-0.75 required font-semibold text-(--text-color)">Теги</span>
            <MultiSelect options={tags?.data || []}
              value={watch('tag_id')}
              onChange={v => setValue('tag_id', v)}
              optionLabel="name"
              optionValue="id"
              showFilter />
          </div>
        )}

        <label className="flex flex-col gap-1">
          <span className="w-fit relative text-lg mb-0.75 required font-semibold text-(--text-color)">Укажите номер телефона</span>
          <div className="flex gap-5">
            <div className="liquid-glass-input flex justify-center items-center w-fit!">+992</div>
            <input className="liquid-glass-input" placeholder="(XX) XXX-XX-XX"
              {...register('phone_number')} />
          </div>
        </label>

        <div className="flex flex-col gap-1">
          <span className="w-fit relative text-lg mb-0.75 required font-semibold text-(--text-color)">Загрузите фотографии</span>
          <div className="flex flex-wrap gap-5">
            {imageList.map((img, index) => (
              <div key={img.id} className="relative">
                {img.url && (
                  <div className="flex justify-center items-center cursor-pointer absolute -top-2 -right-2 bg-red-500 w-7 h-7 rounded-full"
                    onClick={() => ('')}>
                    <i className="pi pi-minus text-white" />
                  </div>
                )}

                <div className={`w-45 h-27.5 bg-white rounded-2xl ${!img.url && 'cursor-pointer'} flex justify-center items-center overflow-hidden`}
                  onClick={() => !img.url && triggerFileInput(index)}>
                  {img.url ? (
                    <img src={img.url} className="w-full h-full object-cover" />
                  ) : (
                    <i className="pi pi-plus" />
                  )}

                  <input type="file" hidden ref={(el) => { fileInputsRef.current[index] = el! }}
                    onChange={e => onFileSelected(e, index)} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="w-fit relative text-lg mb-0.75 required font-semibold text-(--text-color)">Укажите график работы</span>
          {scheduleFields.map((field, index) => {
            const startAt = watch(`schedules.${index}.start_at`);

            return (
              <div key={field.id} className="flex items-center justify-between gap-12.5 mb-2.5">
                <span className="text-lg">{weekDays[index]}:</span>

                <div className="flex gap-1 max-w-93.75 w-full">
                  <div className="w-full">
                    <Dropdown options={scheduleStartTimeSlots}
                      value={startAt}
                      optionLabel='name'
                      optionValue="value"
                      optionIcon
                      onChange={v =>
                        setValue(`schedules.${index}.start_at`, v)
                      }
                    />
                  </div>

                  {!['Круглосуточно', 'Выходной'].includes(startAt) && (
                    <div className="w-full">
                      <Dropdown options={timeSlots}
                        optionLabel="name"
                        optionValue="value"
                        optionIcon
                        value={watch(`schedules.${index}.end_at`)}
                        onChange={v =>
                          setValue(`schedules.${index}.end_at`, v)
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div className="flex items-center justify-between gap-12.5 mb-2.5">
            <span className="text-lg">Обед:</span>
            <div className="flex gap-1 max-w-93.75 w-full">
              <div className="w-full">
                <Dropdown options={lunchTimeSlots}
                  optionLabel="name"
                  optionValue="value"
                  optionIcon
                  value={watch('lunch_start_at')}
                  onChange={v => setValue('lunch_start_at', v)}
                />
              </div>

              {watch('lunch_start_at') !== 'Без перерыва' && (
                <div className="w-full">
                  <Dropdown options={timeSlots}
                    optionLabel="name"
                    optionValue="value"
                    optionIcon
                    value={watch('lunch_end_at')}
                    onChange={v => setValue('lunch_end_at', v)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="w-fit relative text-lg mb-0.75 required font-semibold text-(--text-color)">Регион</span>
          <Dropdown options={regions?.data || []}
            value={watch('region_id')}
            onChange={v => setValue('region_id', v)}
            optionLabel="name"
            optionValue="id"
            showFilter />
        </div>

        {watch('region_id') && (
          <div className="flex flex-col gap-1">
            <span className="w-fit relative text-lg mb-0.75 required font-semibold text-(--text-color)">Город</span>
            <Dropdown options={cities?.data || []}
              value={watch('city_id')}
              onChange={v => setValue('city_id', v)}
              optionLabel="name"
              optionValue="id"
              showFilter />
          </div>
        )}

        <label className="flex flex-col gap-1">
          <span className="w-fit relative text-lg mb-0.75 required font-semibold text-(--text-color)">Адрес</span>
          <input className="liquid-glass-input"
            {...register('address')} />
        </label>

        <label className="flex flex-col gap-1">
          <span className="w-fit relative text-lg mb-0.75 required font-semibold text-(--text-color)">Широта</span>
          <input className="liquid-glass-input"
            {...register('latitude')} />
        </label>

        <label className="flex flex-col gap-1">
          <span className="w-fit relative text-lg mb-0.75 required font-semibold text-(--text-color)">Долгота</span>
          <input className="liquid-glass-input"
            {...register('longitude')} />
        </label>

        <div className="flex flex-col gap-1">
          <span className="w-fit relative text-lg mb-0.75 required font-semibold text-(--text-color)">Социальные сети и мессенджеры</span>
          <div className="flex flex-col gap-3">
            {socialMediaFields.map((field, index) => (
              <div key={field.id} className="flex gap-5">
                <div className="w-full">
                  <Dropdown options={socialMediaOptions}
                    optionLabel="name"
                    optionValue="id"
                    value={watch(`social_media.${index}.social_media_id`)}
                    onChange={v =>
                      setValue(`social_media.${index}.social_media_id`, v)
                    } />
                </div>
                <input className="liquid-glass-input"
                  {...register(`social_media.${index}.account_url`)} />
              </div>
            ))}
          </div>
        </div>


        <div className="flex flex-col gap-1">
          <span className="w-fit relative text-lg mb-0.75 required font-semibold text-(--text-color)">Статус</span>
          <Dropdown options={[{ name: 'Скрыть', type: false }, { name: 'Показать', type: true }]}
            value={watch('is_active')}
            onChange={v => setValue('is_active', v)}
            optionLabel="name"
            optionValue="type"
            showFilter />
        </div>

        <label className="flex flex-col gap-1">
          <span className="w-fit relative text-lg mb-0.75 required font-semibold text-(--text-color)">Описание</span>
          <textarea className="liquid-glass-input min-h-37.5 pt-2.5 resize-y"
            {...register('desc')} />
        </label>

        <div className="flex gap-5">
          <button type="submit" className="h-12 rounded-2xl bg-(--bg-color) text-white w-full cursor-pointer">
            {id ? 'Редактировать' : 'Добавить'}
          </button>

          <button type="button" className="h-12 rounded-2xl bg-white w-full cursor-pointer">
            <Link to='/u/m-c'>
              Отмена
            </Link>
          </button>
        </div>
      </form>
    </section>
  );
}

export default CompanyForm;