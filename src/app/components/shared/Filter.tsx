import { useState } from "react";

interface FilterProps {
    id: number,
    label: string,
    filterRequestType: 'category_ids' | 'tag_ids' | 'region_ids' | 'city_ids',
}

const Filter = ({ id, label, filterRequestType }: FilterProps) => {
    const [checked, setChecked] = useState<boolean>(false);

    const sendFilter = () => {
        setChecked(!checked);
    }

    return (
        <section className="max-w-70 w-full">
            <label className="flex items-center mt-1.25 gap-4.25 cursor-pointer">
                <input checked={checked} onChange={sendFilter} type="checkbox" className="custom-checkbox" />{label}
            </label>
        </section>
    )
}

export default Filter