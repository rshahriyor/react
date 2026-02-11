import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface FilterProps {
    id: number,
    label: string,
    filterRequestType: 'category_ids' | 'tag_ids' | 'region_ids' | 'city_ids',
}

const Filter = ({ id, label, filterRequestType }: FilterProps) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [checked, setChecked] = useState(false);
    const getSearchParams = () => searchParams.get(filterRequestType)?.split(',').map(Number) ?? [];

    useEffect(() => {
        const values = getSearchParams();
        setChecked(values.includes(id));
    }, [searchParams, filterRequestType, id]);

    const sendFilter = () => {
        const current = getSearchParams();
        const updated = current.includes(id) ? current.filter(v => v !== id) : [...current, id];
        const nextParams = new URLSearchParams(searchParams);

        if (updated.length > 0) {
            nextParams.set(filterRequestType, updated.join(','));
        } else {
            nextParams.delete(filterRequestType);
        }
        setSearchParams(nextParams);
    };

    return (
        <section className="max-w-70 w-full">
            <label className="flex items-center gap-4.25 cursor-pointer py-1.25 px-2 hover:bg-white duration-200 rounded-md">
                <input checked={checked} onChange={sendFilter} type="checkbox" className="custom-checkbox" />{label}
            </label>
        </section>
    )
}

export default Filter;