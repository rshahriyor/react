import { useForm } from "react-hook-form";
import Dropdown from "../../components/shared/Dropdown";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getCities, getRegions } from "../../core/services/dictionary.service";

const CompanyForm = () => {
  const { register, watch, handleSubmit, setValue } =
    useForm({
      defaultValues: {
        name: '',
        category_id: null,
        phone_number: '',
        region_id: null,
        city_id: null,
        address: '',
        longitude: '',
        latitude: '',
        desc: '',
        is_active: true,
        schedules: [],
        social_media: []
      }
    });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
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

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <section className="w-full max-w-145 flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <i className="pi pi-building text-[28px] text-(--text-color)" />
        <p className="text-[28px] font-semibold text-(--text-color)">
          Добавлении заведения
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
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

        <label className="flex flex-col gap-1">
          <span className="w-fit relative text-lg mb-0.75 required font-semibold text-(--text-color)">Телефон</span>
          <div className="flex gap-5">
            <div className="liquid-glass-input flex justify-center items-center w-fit!">+992</div>
            <input className="liquid-glass-input" placeholder="(XX) XXX-XX-XX"
              {...register('phone_number')} />
          </div>
        </label>

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
          <span className="w-fit relative text-lg mb-0.75 required font-semibold text-(--text-color)">Статус</span>
          <Dropdown options={[{ name: 'Скрыть', value: false }, { name: 'Показать', value: true }]}
            value={watch('is_active')}
            onChange={v => setValue('is_active', v)}
            optionLabel="name"
            optionValue="value"
            showFilter />
        </div>

        <label className="flex flex-col gap-1">
          <span className="w-fit relative text-lg mb-0.75 required font-semibold text-(--text-color)">Описание</span>
          <textarea className="liquid-glass-input min-h-37.5 pt-2.5 resize-y"
            {...register('desc')} />
        </label>

        <div className="flex gap-5">
          <button type="submit" className="h-12 rounded-2xl bg-(--bg-color) text-white w-full cursor-pointer">
            Добавить
          </button>

          <button type="button" className="h-12 rounded-2xl bg-white w-full cursor-pointer">
            Отмена
          </button>
        </div>
      </form>
    </section>
  );
}

export default CompanyForm;