import {
    type ChangeEvent,
    type LabelHTMLAttributes,
    type ReactNode,
    useCallback,
    useEffect,
    useRef,
    useState,
    useTransition
} from 'react';
import type {SearchItem} from "chums-types";
import {Spinner} from "react-bootstrap";
import {Autocomplete, type AutocompleteInputProps, type AutocompleteRootProps} from "@base-ui/react/autocomplete";
import classes from "@/components/autocomplete.module.css";
import {fetchItemLookup} from "@/api/item.ts";

export interface ItemAutocompleteProps extends AutocompleteRootProps<SearchItem> {
    slotProps?: {
        label?: string;
        labelProps?: LabelHTMLAttributes<HTMLLabelElement>;
        inputProps?: AutocompleteInputProps;
    }
    item: string | null;
    onChange?: (ev: ChangeEvent<HTMLInputElement>) => void;
    onSelectItem: (item?: SearchItem | null) => void;
    children?: ReactNode;
}

const ItemAutocomplete = ({
                              slotProps,
                              item,
                              onSelectItem,
                              ...rootProps
                          }: ItemAutocompleteProps) => {
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<SearchItem[]>([]);
    const abortControllerRef = useRef<AbortController | null>(null);
    const [isPending, startTransition] = useTransition();
    const {contains} = Autocomplete.useFilter();
    const [open, setOpen] = useState<boolean>(false);

    const searchChangedHandler = useCallback((nextValue: string) => {
        setInputValue(nextValue);
        const controller = new AbortController();
        abortControllerRef.current?.abort('New search');
        abortControllerRef.current = controller;
        if (nextValue === '') {
            setResults([]);
            setError(null);
            return;
        }
        startTransition(async () => {
            setError(null);
            const _results = await fetchItemLookup(nextValue);
            const results = _results.filter(item => contains(item.ItemCode, nextValue) || contains(item.ItemCodeDesc, nextValue));
            if (controller.signal.aborted) {
                return;
            }
            startTransition(() => {
                setResults(results);
            })
        })
    }, [contains])

    useEffect(() => {
        startTransition(() => {
            setInputValue(item ?? '');
        })
    }, [item, setInputValue]);

    function getStatus(): ReactNode | null {
        if (isPending) {
            return (
                <>
                    <Spinner animation="border" size="sm" role="status"/>
                    Searching...
                </>
            )
        }
        if (error) {
            return (
                <span className="text-danger">{error}</span>
            )
        }
        if (inputValue === '') {
            return null;
        }
        if (results.length === 0) {
            return (
                <span className="text-muted">No results found</span>
            )
        }

        return `${results.length} items found`;
    }

    const acStatus = getStatus();

    return (
        <Autocomplete.Root open={open} onOpenChange={(open) => setOpen(open)}
                           value={inputValue}
                           onValueChange={searchChangedHandler}
                           items={results}
                           itemToStringValue={item => item.ItemCode} filter={null} {...rootProps}>
            <Autocomplete.InputGroup className="input-group input-group-sm">
                {slotProps?.label && (<label className="input-group-text"
                                             htmlFor={slotProps.labelProps?.htmlFor}>{slotProps.label}</label>)}
                <Autocomplete.Input className="form-control" placeholder="Item Code" {...slotProps?.inputProps}/>
                <Autocomplete.Trigger className="btn btn-outline-secondary">
                    <span className={open ? "bi-chevron-up" : 'bi-chevron-down'}/>
                </Autocomplete.Trigger>
            </Autocomplete.InputGroup>
            <Autocomplete.Portal hidden={!acStatus} className={classes.Portal}>
                <Autocomplete.Positioner sideOffset={4} align="start" className={classes.Positioner}>
                    <Autocomplete.Popup aria-busy={isPending || undefined} className={classes.Popup}>
                        <div className="bg-body p-1 border rounded">
                            <Autocomplete.Status>
                                {acStatus && <div className="text-secondary">{acStatus}</div>}
                            </Autocomplete.Status>
                            <Autocomplete.List className={classes.List}>
                                {(item: SearchItem) => (
                                    <Autocomplete.Item key={item?.ItemCode} value={item}
                                                       onClick={() => {
                                                           onSelectItem(item);
                                                           setOpen(false);
                                                       }}
                                                       className={classes.Item}>
                                        <div className="d-flex align-items-center=" style={{gap: '3rem'}}>
                                            <div className="flex-grow-1">
                                                <div className="fw-bold">{item.ItemCode}</div>
                                            </div>
                                            <div className="flex-shrink-0">
                                                {item.ItemCodeDesc}
                                            </div>
                                        </div>
                                    </Autocomplete.Item>

                                )}
                            </Autocomplete.List>
                        </div>
                    </Autocomplete.Popup>
                </Autocomplete.Positioner>
            </Autocomplete.Portal>
        </Autocomplete.Root>
    )
}
export default ItemAutocomplete
