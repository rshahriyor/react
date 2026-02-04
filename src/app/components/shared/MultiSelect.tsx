import { useRef, useState } from 'react';
import { useClickOutside } from '../../core/hooks/click-outside';

export type MultiSelectOption = {
    name: string;
    id?: number;
    value?: string;
};

type MultiSelectKey = 'name' | 'id' | 'value';

type Props = {
    options: MultiSelectOption[];
    value: any[];
    onChange: (value: any[]) => void;
    optionLabel?: MultiSelectKey;
    optionValue?: MultiSelectKey;
    showFilter?: boolean;
};

const MultiSelect = ({
    options,
    value,
    onChange,
    optionLabel = 'name',
    optionValue = 'id',
    showFilter
}: Props) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOptions = options.filter(o =>
        value?.includes(o[optionValue])
    );

    const filteredOptions = options.filter(option =>
        String(option[optionLabel] ?? '')
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const toggleOption = (val: any) => {
        const safeValue = Array.isArray(value) ? value : [];
        if (safeValue.includes(val)) {
            onChange(safeValue.filter(v => v !== val));
        } else {
            onChange([...safeValue, val]);
        }
    };

    useClickOutside((containerRef), () => {
        setMenuVisible(false);
    })

    return (
        <div className="relative" ref={containerRef}>
            <div className="liquid-glass-input cursor-pointer flex overflow-hidden gap-1 relative items-center"
                onClick={() => setMenuVisible(v => !v)}>
                <div className="flex gap-x-1">
                    {selectedOptions.length ? (
                        selectedOptions.map(option => (
                            <span key={String(option[optionValue])}
                                className="text-(--text-color)">
                                {option[optionLabel]},
                            </span>
                        ))
                    ) : (
                        <span className="text-(--text-color)/80">
                            Выберите теги...
                        </span>
                    )}
                </div>

                <i className={`pi pi-angle-down text-2xl absolute right-2.5 duration-300 ${menuVisible ? 'rotate-180' : ''}`} />
            </div>

            {menuVisible && (
                <div className="dropdown-menu absolute w-full bg-white z-10 shadow-lg rounded-2xl overflow-auto">
                    {showFilter && (
                        <div className="flex py-3.75 px-5 gap-3.75 border-b border-[#f1efef]">
                            <div className="relative w-full">
                                <input type="text"
                                    className="w-full bg-(--body-bg-color) outline-none h-12 px-5 rounded-2xl"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)} />
                                <i className="pi pi-search absolute right-2.5 top-1/2 -translate-y-1/2" />
                            </div>
                        </div>
                    )}

                    <ul className="list-none p-0 m-0 max-h-65 overflow-y-auto">
                        {filteredOptions.map(option => {
                            const isSelected = value?.includes(option[optionValue]);

                            return (
                                <div key={String(option[optionValue])}
                                    className={`flex items-center pt-2.5 pb-2 pr-3 pl-5 cursor-pointer gap-2
                                        border-b border-(--body-bg-color)
                                        transition duration-300 hover:bg-(--body-bg-color)/60
                                        ${isSelected ? 'bg-(--body-bg-color)' : ''}`}
                                    onClick={() => toggleOption(option[optionValue])}>

                                    <input type="checkbox" checked={isSelected} className='custom-checkbox' readOnly />

                                    <span className="font-medium text-(--text-color)">
                                        {option[optionLabel]}
                                    </span>
                                </div>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MultiSelect;