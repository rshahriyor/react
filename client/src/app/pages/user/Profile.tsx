import { useMutation, useQuery } from "@tanstack/react-query";
import { getProfile, updateProfile } from "../../core/services/profile.service";
import z from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  gender_id: z.string(),
  phone_number: z.string(),
  username: z.string()
});

type ProfileForm = z.infer<typeof schema>;

const Profile = () => {
  const [editing, setEditing] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['user-profile'],
    queryFn: getProfile
  });

  const { register, handleSubmit, reset, formState} = useForm<ProfileForm>({
    resolver: zodResolver(schema)
  });

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (res) => {
      if (res.status.code === 0) {
        setEditing(false);
        alert('Профиль успешно обновлен');
      }
    }
  })

  useEffect(() => {
    if (!user?.data) return;
    reset({
      username: user.data.username,
      first_name: user.data.first_name,
      last_name: user.data.last_name,
      phone_number: user.data.phone_number.toString(),
      gender_id: user.data.gender_id.toString()
    });
  }, [user?.data, reset]);

  const onSubmit: SubmitHandler<ProfileForm> = (data) => {
    if (!editing) return setEditing(true);
    mutation.mutate(data);
  }

  const cancelEdit = () => {
    setEditing(false);
    reset();
  }

  return (
    <div className="max-w-145 w-full">
      <div className="flex items-center gap-2.5 h-12.5 mb-3.5 justify-center sm:justify-start">
        <i className="pi pi-user text-[34px] text-(--text-color)"></i>
        <h1 className="text-[28px] font-semibold text-(--text-color) m-0">Мой профиль</h1>
      </div>

      <div className="w-full px-7.5 py-3.75 rounded-[18px] border-2 border-white">
        <div className="flex justify-center items-center gap-15 sm:gap-7.5">
          <div className="w-33.75 h-33.75 rounded-full bg-[#F8F8F8] border border-[#E7E7E7] flex items-center justify-center">
            <i className="pi pi-user text-[70px] text-(--text-color)"></i>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6.25 mt-6">
          <div className="flex flex-col gap-1.25">
            <label className="text-[20px] font-semibold text-(--text-color)">Имя пользователя</label>
            <input {...register("username")} readOnly={!editing} className="liquid-glass-input" />
          </div>

          <div className="flex flex-col gap-1.25">
            <label className="text-[20px] font-semibold text-(--text-color)">Имя</label>
            <input {...register("first_name")} readOnly={!editing} className="liquid-glass-input" />
          </div>

          <div className="flex flex-col gap-1.25">
            <label className="text-[20px] font-semibold text-(--text-color)">Фамилия</label>
            <input {...register("last_name")} readOnly={!editing} className="liquid-glass-input" />
          </div>

          <div className="flex flex-col gap-1.25">
            <label className="text-[20px] font-semibold text-(--text-color)">Телефон</label>
            <div className="flex items-center gap-3">
              <div className="liquid-glass-input flex items-center justify-center font-medium w-fit!">
                +992
              </div>
              <input {...register('phone_number')} readOnly={!editing} placeholder="(XX) XXX-XX-XX" className="liquid-glass-input" />
            </div>
          </div>

          <div className="flex flex-col gap-1.25">
            <span className="text-[20px] font-semibold text-(--text-color)">Пол</span>
            <div className="flex gap-6">
              <label className="flex items-center liquid-glass-input cursor-pointer">
                <input type="radio" {...register("gender_id")} value='1' disabled={!editing}
                  className="appearance-none w-5 h-5 rounded-full border-3 border-white mr-2.5 checked:border-4 checked:border-(--bg-color) duration-200" />
                Мужской
              </label>

              <label className="flex items-center liquid-glass-input cursor-pointer">
                <input type="radio" {...register("gender_id")} value='2' disabled={!editing}
                  className="appearance-none w-5 h-5 rounded-full border-3 border-white mr-2.5 checked:border-4 checked:border-(--bg-color) duration-200" />
                Женский
              </label>
            </div>
          </div>

          <div className="flex gap-6">
            <button type="submit" disabled={!formState.isValid}
              className="cursor-pointer h-12.5 w-full rounded-2xl text-[20px] bg-(--bg-color) text-white disabled:bg-(--bg-color)/90 disabled:cursor-not-allowed">
              {editing ? "Сохранить" : "Редактировать"}
            </button>

            {editing && (
              <button type="button" onClick={cancelEdit} className="cursor-pointer h-12.5 w-full rounded-2xl text-[20px] bg-white">
                Отменить
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile;