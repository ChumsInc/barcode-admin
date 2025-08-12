import  {type ChangeEvent, useId} from 'react';
import classNames from "classnames";

const StickerToggleButton = ({checked, onChange, icon, title, disabled}:{
    checked?: boolean;
    onChange: (ev:ChangeEvent<HTMLInputElement>) => void;
    icon: string;
    title?: string;
    disabled?: boolean;
}) => {
    const id = useId();
    return (
        <>
            <input type="checkbox" className="btn-check" id={id} autoComplete="off"
                   checked={checked} onChange={onChange} disabled={disabled}/>
            <label className={classNames('btn btn-sm', {
                'btn-outline-secondary': !checked,
                'btn-secondary': checked
            })} htmlFor={id} aria-label={title} title={title}>
                <span className={classNames('mx-3', icon)}/>
            </label>
        </>
    )
}

export default StickerToggleButton;
