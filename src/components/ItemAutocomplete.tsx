import React, {
    type ChangeEvent,
    type InputHTMLAttributes,
    startTransition,
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react';
import {fetchItemLookup} from "../api/item";
import AutoComplete from "./AutoComplete";
import type {SearchItem} from "chums-types";
import {useDebounceValue} from "usehooks-ts";

const SageItemAutocomplete = AutoComplete<SearchItem>;

export interface ItemAutocompleteProps extends InputHTMLAttributes<HTMLInputElement> {
    itemCode: string;
    onChange: (ev: ChangeEvent<HTMLInputElement>) => void;
    onSelectItem: (item?: SearchItem) => void;
    children?: React.ReactNode;
}

const ItemAutocomplete = ({itemCode, onChange, onSelectItem, children, ...props}: ItemAutocompleteProps) => {
    const [value, setValue] = useState(itemCode);
    const [debouncedValue, setDebouncedValue] = useDebounceValue(itemCode, 350);
    const [results, setResults] = useState<SearchItem[]>([]);
    const [loading, setLoading] = useState(false);
    const timerRef = useRef<number|null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const loadItemSearch = useCallback((value: string) => {
        if (loading) {
            return;
        }
        setLoading(true);
        fetchItemLookup(value)
            .then(results => {
                setResults(results);
                setLoading(false);
                const [item] = results.filter(item => item.ItemCode === value);
                onSelectItem(item || null);
            })
            .catch((err: unknown) => {
                setLoading(false);
                if (err instanceof Error) {
                    console.log(err.message)
                }
            });

    }, [loading, onSelectItem]);

    // const id = useId();
    useEffect(() => {
        startTransition(() => {
            setValue(debouncedValue);
            const [item] = results.filter(item => item.ItemCode === debouncedValue);
            onSelectItem(item || null);
            loadItemSearch(debouncedValue)
        })
    }, [debouncedValue, results, onSelectItem, loadItemSearch])

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                window.clearTimeout(timerRef.current);
            }
        }
    }, [timerRef]);

    useEffect(() => {
        setDebouncedValue(value);
    }, [value, setDebouncedValue]);

    useEffect(() => {
        startTransition(() => {
            if (value.length < 2) {
                setResults([]);
                return;
            }
            if (timerRef.current) {
                window.clearTimeout(timerRef.current);
            }
            timerRef.current = window.setTimeout(() => loadItemSearch(value), 350);
        })
    }, [loadItemSearch, value]);

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        setValue(ev.target.value);
        onChange(ev);
    }

    const recordChangeHandler = (item?: SearchItem) => {
        setValue(item?.ItemCode ?? '')
        onSelectItem(item);
    }

    const itemFilter = (value: string) => (row: SearchItem) => row.ItemCode.startsWith(value) || row.ItemCodeDesc.toLowerCase().includes(value.toLowerCase());

    const renderItem = (row: SearchItem) => <div><strong className="me-3">{row.ItemCode}</strong> {row.ItemCodeDesc}
    </div>

    return (
        <div className="input-group input-group-sm" ref={containerRef}>
            <span className="input-group-text">
                <span className="bi-search"/>
            </span>
            <SageItemAutocomplete containerRef={containerRef} {...props}
                                  value={value} data={results} onChange={changeHandler}
                                  onChangeRecord={recordChangeHandler}
                                  renderItem={renderItem}
                                  itemKey={row => row.ItemCode} filter={itemFilter}/>
            {children}
        </div>
    )
}
export default ItemAutocomplete
