import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCompany } from "../core/services/company.service";
import Menu from "../shared/ui/Menu";
import { environment } from "../env/environment";
import Map from "../shared/assets/map.svg";
import { formatPhone } from "../core/pipes/formatPhone";
import { dayOfWeek } from "../core/pipes/day-of-week";
import Instagram from "../shared/assets/social/instagram.svg";
import Telegram from "../shared/assets/social/telegram.svg";
import Facebook from "../shared/assets/social/facebook.svg";
import WhatsApp from "../shared/assets/social/whatsapp.svg";
import { useMemo, useState } from "react";
import type { WheelEvent } from "react";

const socialMediaIconsById: Record<number, { url: string, icon: string }> = {
  1: { url: 'https://instagram.com', icon: Instagram },
  2: { url: 'https://t.me', icon: Telegram },
  3: { url: 'https://wa.me', icon: WhatsApp },
  4: { url: 'https://facebook.com', icon: Facebook }
};

const mapSocialMediaWithIcons = (socialMedia: any[] = []) => {
  return socialMedia.map(sm => ({
    ...sm,
    icon: socialMediaIconsById[sm.social_media_id]?.icon,
    url: socialMediaIconsById[sm.social_media_id]?.url
  }))
}

const CompanyDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: company } = useQuery({
    queryKey: ['company-detail', id],
    queryFn: () => getCompany(Number(id)),
    enabled: !!id,
    select: (res) => ({
      ...res.data,
      social_media: mapSocialMediaWithIcons(res.data.social_media)
    }),
    staleTime: 30 * 60 * 1000
  });

  const imageUrl = environment.imageUrl;

  const [selectedImageId, setSelectedImageId] = useState<number | null>(null)
  const [expandedImageSrc, setExpandedImageSrc] = useState('');
  const [expandImage, setExpandImage] = useState(false);
  const [expandImageIndex, setExpandImageIndex] = useState(0);
  const [isMainImageScrolling, setIsMainImageScrolling] = useState(false);

  const mainImagePath = useMemo(() => {
    const files = company?.files ?? []
    const selectedId = selectedImageId

    if (files.length === 0) return null

    const file = selectedId
      ? files.find(img => img.id === selectedId)
      : files[0]

    return file?.file_name ?? null
  }, [company?.files, selectedImageId]);

  const expandImageToView = (imagePath: string | null) => {
    setExpandedImageSrc(`${imageUrl}/${imagePath}`);
    setExpandImage(true);
    document.body.style.overflow = 'hidden';
  }

  const onMainImageScroll = (event: WheelEvent) => {
    if (isMainImageScrolling) return;

    setIsMainImageScrolling(true);

    if (event.deltaY < 0) {
      moveImageLeft();
    } else {
      moveImageRight();
    }

    setTimeout(() => setIsMainImageScrolling(false), 300);
  }

  const swapMainImage = (imageId: number | null, index: number) => {
    setSelectedImageId(imageId)
    setExpandImageIndex(index);
  }

  const closeExpandedImage = () => {
    document.body.style.overflow = 'auto';
    setExpandImage(false);
  }

  const changeExpandedImage = (evt: React.MouseEvent<HTMLImageElement>) => {
    evt.stopPropagation();

    const { clientWidth } = evt.currentTarget;
    const middle = clientWidth / 2;
  
    const isLeft = evt.nativeEvent.offsetX < middle;
  
    if (isLeft) {
      moveImageLeft();
    } else {
      moveImageRight();
    }
  };

  function moveImageLeft() {
    const images = company?.files || [];
    setExpandImageIndex(prevIndex => {
      const nextIndex = prevIndex === 0 ? images.length - 1 : prevIndex - 1;

      setExpandedImageSrc(`${imageUrl}/${images[nextIndex].file_name}`);

      return nextIndex;
    });
    setSelectedImageId(images[expandImageIndex].id ?? null);
  }

  function moveImageRight() {
    const images = company?.files || [];
    setExpandImageIndex(prevIndex => {
      const nextIndex = prevIndex + 1 < images.length ? prevIndex + 1 : 0;

      setExpandedImageSrc(`${imageUrl}/${images[nextIndex].file_name}`);

      return nextIndex;
    });
    setSelectedImageId(images[expandImageIndex].id ?? null);
  }

  return (
    <>
      <div className="border border-x-0 border-(--text-color)/40 w-full py-2 mb-5">
        <p className="text-center text-5xl text-(--text-color) font-bold leading-[normal]">{company?.name}</p>
      </div>
      <div className="flex gap-5">
        <div className="max-w-70 w-full">
          <Menu currentPage="Информация" />
        </div>
        <div className="max-w-145 w-full">
          <div className="flex flex-col gap-4">

            <div className="flex items-center gap-1.25 h-12.5 pl-2.5">
              <i className="pi pi-exclamation-circle text-[27px]"></i>
              <h1 className="text-[28px] text-(--text-color) font-semibold m-0">
                Информация
              </h1>
            </div>

            <div className="relative max-h-82.5">
              <img src={`${imageUrl}/${mainImagePath}`} onClick={() => expandImageToView(mainImagePath)} onWheel={onMainImageScroll}
                className="cursor-pointer border border-[#D0D0D0] bg-[#F3F3F3] object-cover max-w-145 w-full h-82.5 rounded-[15px]" />

              <div className="absolute top-3 w-full px-2.5 flex justify-end items-center">
                {/* <div className="flex items-center gap-1 rounded-full p-1.5">
                  <div className="flex items-center justify-center">
                    <FaRegClock className="text-white text-sm" />
                  </div>
                  <span className="text-[17px] text-white leading-none">
                      {{ workingStatusLabel }}
                    </span>
                </div> */}

                <button onClick={() => expandImageToView(mainImagePath)} className="flex justify-center items-center bg-white/70 p-2 rounded-[10px]
                       transition-transform duration-300 hover:scale-110 cursor-pointer">
                  <i className="pi pi-expand text-lg"></i>
                </button>
              </div>
            </div>

            <div className="flex gap-6 overflow-x-auto">
              {company?.files?.map((image, index) => (
                <img onClick={() => swapMainImage(image.id || null, index)} key={index} src={`${imageUrl}/${image.file_name}`} className="cursor-pointer border border-[#D0D0D0] bg-[#F3F3F3] object-cover min-w-45 max-w-45 h-25.25 rounded-[15px]" />
              ))}
            </div>

            <div className="bg-white p-3.75 rounded-[18px]">
              <p className="text-[27px] text-(--text-color) font-semibold my-0">Теги:</p>
              <div className="flex flex-wrap gap-[10px_8px] mt-2.5">
                {company?.tags?.length && company.tags.map((tag) => (
                  <div key={tag.tag_id} className="text-[16px] bg-[#F0F0F0CC] rounded-full px-3 py-1.5">
                    {tag.tag_name}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-3.75 rounded-[18px]">
              <p className="text-[27px] text-(--text-color) font-semibold my-0">Контакты:</p>

              <div className="flex flex-wrap gap-6.25 justify-center mt-3">
                <a href={'tel:+992' + company?.phone_number}
                  className="flex items-center justify-center gap-3 bg-[#5B42FF] text-white font-semibold text-[19px] h-12 max-w-65.5 w-full rounded-2xl">
                  <i className="pi pi-phone"></i>
                  +992 {formatPhone(company?.phone_number)}
                </a>
              </div>
            </div >

            <div className="bg-white p-3.75 rounded-[18px]">
              <p className="text-[27px] text-(--text-color) font-semibold my-0">Адрес:</p>

              <div className="bg-[#F3F3F3] rounded-2xl mt-4 text-[18px]">
                <span className="block p-[8px_10px] break-all">
                  {`${company?.region_name}, ${company?.city_name}, ${company?.address}`}
                </span>
              </div>

              <div className="relative mt-4">
                <img src={Map} className="w-full max-w-137.5 rounded-2xl" />
                <a href={'https://www.google.com/maps?q=' + company?.latitude + ',' + company?.longitude}
                  target="_blank" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                  bg-[#5B42FF] hover:bg-[#4f34fc]
                  text-white text-[19px] font-semibold
                  rounded-2xl w-full max-w-52.5
                                py-3 shadow transition text-center" >
                  Показать на карте
                </a>
              </div>
            </div>

            <div className="bg-white p-3.75 rounded-[18px]">
              <p className="text-[27px] text-(--text-color) font-semibold my-0">
                График работы:
              </p>

              <div className="flex flex-wrap gap-[14px_35px] mt-4.5">
                {company?.schedules?.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center max-w-64.25 w-full">
                    <span>{dayOfWeek(schedule?.day_of_week)}</span>
                    {schedule.is_day_and_night && (
                      <div className="bg-(--body-bg-color) rounded-2xl h-11 w-full max-w-32.5 flex items-center justify-center text-[15px]">
                        Круглосуточно
                      </div>
                    )}
                    {!schedule.is_working_day && (
                      <div className="bg-(--body-bg-color) rounded-2xl h-11 w-full max-w-32.5 flex items-center justify-center text-[15px]">
                        Выходной
                      </div>
                    )}
                    {!schedule.is_day_and_night && schedule.is_working_day && (
                      <div className="bg-(--body-bg-color) rounded-2xl h-11 w-full max-w-32.5 flex items-center justify-center text-[15px]">
                        {schedule?.start_at} - {schedule?.end_at}
                      </div>
                    )}
                  </div>
                ))}

                {company?.schedules?.length && (
                  <div className="flex justify-between items-center max-w-64.25 w-full">
                    <span>Обед:</span>
                    {company?.schedules[0]?.without_breaks ? (
                      <div className="bg-(--body-bg-color) rounded-2xl h-11 w-full max-w-32.5
                                          flex items-center justify-center text-[15px]">
                        Без перерыва
                      </div>

                    ) : (
                      <div className="bg-(--body-bg-color) rounded-2xl h-11 w-full max-w-32.5
                                flex items-center justify-center text-[15px]">
                        {company?.schedules[0]?.lunch_start_at}
                        -
                        {company?.schedules[0]?.lunch_end_at}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-3.75 rounded-[18px] flex flex-col gap-4">
              <p className="text-[27px] text-(--text-color) font-semibold my-0">Социальные сети:</p>
              <div className="flex flex-wrap justify-between gap-5">
                {company?.social_media?.map((sm, index) => (
                  <a key={index} href={`${sm.url}/${sm.account_url}`} target="_blank"
                    className="flex items-center cursor-pointer gap-3 border border-(--body-bg-color) rounded-[18px] p-[12px_16px] max-w-65.25 w-full min-h-11 transition hover:bg-(--body-bg-color)">
                    <img src={sm.icon} alt={sm.social_media_name} width="19" height="19" />
                    <span className="text-black/60 font-medium">
                      {sm.account_url}
                    </span>
                  </a>
                ))}
              </div>
            </div >

            <div className="bg-white p-3.75 rounded-[18px] flex flex-col gap-5.25">
              <p className="text-[27px] text-(--text-color) font-semibold my-0">Описание:</p>
              <span className="text-[22px] wrap-break-word">
                {company?.desc}
              </span>
            </div>
          </div >
        </div >
      </div >

      {expandImage && (
        <div onClick={closeExpandedImage} className="w-screen h-screen bg-[#000000de] fixed top-0 left-0 z-9999 flex justify-center items-center">
          <img src={expandedImageSrc} alt="expanded-image" className="w-fit h-[98vh] object-contain"
            onClick={(evt) => changeExpandedImage(evt)} onWheel={(evt) => onMainImageScroll(evt)} />
          <div onClick={closeExpandedImage} className="flex justify-center items-center h-7.75 w-7.75 absolute top-2.5 right-2.5 cursor-pointer bg-[#FFFFFFB2] rounded-xl border-0 transition-transform duration-300 hover:scale-110">
            <i className="pi pi-times text-(--text-color)"></i>
          </div>
        </div>
      )}
    </>
  );
};

export default CompanyDetail;