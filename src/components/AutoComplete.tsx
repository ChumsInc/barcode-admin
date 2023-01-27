import React, {
    ChangeEvent,
    CSSProperties,
    InputHTMLAttributes,
    KeyboardEvent,
    ReactNode,
    useEffect,
    useState,
} from 'react';
import useClickOutside from "../hooks/click-outside";
import {usePopper} from "react-popper";
import classNames from "classnames";

export interface AutoCompleteProps<T = any> extends InputHTMLAttributes<HTMLInputElement> {
    containerRef: React.RefObject<HTMLDivElement>;
    value: string;
    data: T[];
    onChange: (ev: ChangeEvent<HTMLInputElement>) => void;
    onChangeRecord: (value: T | undefined) => void;
    renderItem: (value: T) => ReactNode;
    itemKey: (value: T) => string | number;
    helpText?: string | null;
    itemStyle?: CSSProperties;
    filter: (value: string) => (element: T) => boolean;
}


export default function AutoComplete<T = any>({
                                                  containerRef,
                                                  value,
                                                  data,
                                                  onChange,
                                                  onChangeRecord,
                                                  renderItem,
                                                  itemKey,
                                                  helpText,
                                                  itemStyle,
                                                  filter,
                                                  readOnly,
                                                  disabled,
                                                  ...props
                                              }: AutoCompleteProps<T>) {
    const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);
    const [inputElement, setInputElement] = useState<HTMLInputElement | null>(null);
    const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
    const [values, setValues] = useState<T[]>(data.slice(0, 50));
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(-1);
    const [minWidth, setMinWidth] = useState<string>('100px');
    const {styles, attributes} = usePopper(inputElement, popperElement, {
        placement: 'bottom-end',
        modifiers: [{name: 'arrow', options: {element: arrowElement}}],
    });

    useClickOutside(containerRef, () => setOpen(false));

    useEffect(() => {
        setMinWidth(`${(inputElement?.offsetWidth ?? 100)}px`)
    }, [inputElement?.offsetWidth])

    useEffect(() => {
        const values = data.filter(filter(value));
        setValues(values);
        setIndex(value === '' ? -1 : 0);
    }, [value]);

    useEffect(() => {
        setValues(data.filter(filter(value)));
    }, [data]);

    useEffect(() => {
        containerRef.current
            ?.querySelector('li.list-group-item.active')
            ?.scrollIntoView(false);
    }, [index])


    const inputHandler = (ev: KeyboardEvent<HTMLInputElement>) => {
        if (readOnly || disabled) {
            return;
        }
        const len = values.length;
        switch (ev.key) {
        case 'Escape':
            setOpen(false);
            ev.preventDefault();
            ev.stopPropagation();
            return;
        case 'ArrowDown':
            ev.preventDefault();
            setOpen(true);
            setIndex((index + 1) % len);
            return;
        case 'ArrowUp':
            ev.preventDefault();
            setOpen(true);
            setIndex((index - 1 + len) % len);
            return;
        case 'PageDown':
            ev.preventDefault();
            setOpen(true);
            setIndex(Math.min(index + 10, len - 1));
            return;
        case 'PageUp':
            ev.preventDefault();
            setOpen(true);
            setIndex(Math.max(index - 10, 0));
            return;

        case 'Enter':
            const current = values[index];
            if (!open) {
                return;
            }
            ev.preventDefault();
            setOpen(false);
            return onChangeRecord(current);
        }
        if (!open) {
            setOpen(true);
        }
    }

    const clickHandler = (value: T) => {
        onChangeRecord(value);
        setOpen(false);
    }

    const focusHandler = () => {
        if (readOnly || disabled || !values.length) {
            return;
        }
        setOpen(true);
    }
    return (
        <>
            <input type="search"
                   autoComplete="off" readOnly={readOnly} disabled={disabled}
                   className="form-control form-control-sm" value={value} onChange={onChange}
                   onKeyDown={inputHandler} ref={setInputElement} onFocus={focusHandler} onBlur={() => setOpen(false)} {...props}/>
            <small className="text-muted overflow-hidden">{helpText ?? null}</small>
            {open && (
                <div ref={setPopperElement} style={{
                    height: 'auto',
                    width: 'max-content',
                    minWidth: minWidth,
                    maxHeight: '75vh',
                    overflow: 'auto',
                    zIndex: 1000,
                    ...styles.popper,
                }} {...attributes.popper} >
                    <div ref={setArrowElement} style={styles.arrow}/>
                    <ul className={classNames('autocomplete list-group fade', {show: open})}>
                        {values
                            .map((value, i) => (
                                <li key={itemKey(value)}
                                    className={classNames('list-group-item', {active: index === i})}
                                    style={itemStyle} onClick={() => clickHandler(value)}>
                                    {renderItem(value)}
                                </li>
                            ))}
                    </ul>
                </div>
            )}
        </>
    )
}
