import { useRef, useState } from 'react';
import { useClickOutside } from '../../core/hooks/click-outside';

export type DropdownOption = {
    name: string;
    id?: number;
    value?: string;
    type?: boolean;
};

type DropdownKey = 'name' | 'id' | 'value' | 'type';

type Props = {
    options: DropdownOption[];
    value: any;
    onChange: (value: any) => void;
    optionLabel?: DropdownKey;
    optionValue?: DropdownKey;
    showFilter?: boolean;
    optionIcon?: boolean;
};

const Dropdown = ({
    options,
    value,
    onChange,
    optionLabel = 'name',
    optionValue = 'id',
    showFilter,
    optionIcon
}: Props) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(
        o => o[optionValue] === value
    );

    const filteredOptions = options.filter(option =>
        String(option[optionLabel] ?? '')
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    useClickOutside(containerRef, () => {
        setMenuVisible(false);
    });

    return (
        <div className="relative" ref={containerRef}>
            <div className="liquid-glass-input cursor-pointer flex relative justify-between items-center"
                onClick={() => setMenuVisible(v => !v)}>
                <span className="text-(--text-color) font-medium">
                    {selectedOption?.[optionLabel] ?? ''}
                </span>

                <i className={`pi pi-angle-down text-2xl absolute right-2.5 duration-300 ${menuVisible ? 'rotate-180' : ''}`} />
            </div>

            {menuVisible && (
                <div className="dropdown-menu absolute w-full bg-white z-10 shadow-lg rounded-2xl overflow-auto">
                    {showFilter && (
                        <div className="flex py-3.75 px-5 gap-3.75 border-b border-[#f1efef]">
                            <div className="relative w-full">
                                <input type="text"
                                    className="dropdown-search-input w-full bg-(--body-bg-color) outline-none h-12 px-5 rounded-2xl"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)} />
                                <i className="pi pi-search absolute right-2.5 top-1/2 -translate-y-1/2" />
                            </div>
                        </div>
                    )}

                    <ul className="list-none p-0 m-0 max-h-65 overflow-y-auto">
                        {filteredOptions.map((option, index) => (
                            <div key={index}
                                className={`flex items-center pt-2.5 pb-2 pr-1.25 pl-5 cursor-pointer gap-1.75 border-b border-(--body-bg-color)
                                            transition duration-300 hover:bg-(--body-bg-color)/60
                                            ${option[optionValue] === value ? 'bg-(--body-bg-color)' : ''}`}
                                onClick={() => {
                                    onChange(option[optionValue]);
                                    setMenuVisible(false);
                                }}>
                                {optionIcon && <i className="pi pi-clock" />}
                                <li className="text-(--text-color) font-medium">
                                    {option[optionLabel]}
                                </li>
                            </div>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Dropdown;