import React, {ChangeEvent, useEffect, useId, useRef, useState} from 'react';
import {SearchCustomer} from "../types";
import {fetchCustomerLookup} from "../api/customer";
import {customerKey} from "../utils/customer";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import {FilledInputProps} from "@mui/material/FilledInput/FilledInput";


export interface CustomerAutocompleteProps extends FilledInputProps {
    customer: SearchCustomer | null;
    onChange?: (ev: ChangeEvent<HTMLInputElement>) => void;
    onSelectCustomer: (customer?: SearchCustomer | null) => void;
    children?: React.ReactNode;
}

const CustomerAutocomplete = ({
                                  customer,
                                  onChange,
                                  onSelectCustomer,
                                  children,
                                  ...inputProps
                              }: CustomerAutocompleteProps) => {
    const [value, setValue] = useState<SearchCustomer | null>(customer);
    const [hint, setHint] = useState<SearchCustomer | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [open, setOpen] = useState(false);


    const [results, setResults] = useState<readonly SearchCustomer[]>([]);
    const [loading, setLoading] = useState(false);
    const [tHandle, setTHandle] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const id = useId();

    useEffect(() => {
        setValue(customer);
        if (customer) {
            loadCustomerSearch(customerKey(customer))
                .catch(err => console.debug("loadCustomerSearch()", err.message));
        }
    }, [customer]);

    useEffect(() => {
        return () => {
            window.clearTimeout(tHandle);
        }
    }, [])

    useEffect(() => {
        if (inputValue.length < 2) {
            return;
        }
        window.clearTimeout(tHandle);
        const t = window.setTimeout(() => loadCustomerSearch(inputValue), 350);
        setTHandle(t);
    }, [inputValue]);


    const loadCustomerSearch = async (value: string) => {
        if (loading) {
            return;
        }
        setLoading(true);
        try {
            const results = await fetchCustomerLookup(value);
            setResults(results);
            const [hint] = results.filter(c => c.CustomerName.startsWith(value) || customerKey(c).startsWith(value));
            setHint(hint ?? null);
            setLoading(false);
        } catch (err: unknown) {
            setLoading(false);
            if (err instanceof Error) {
                console.debug("loadCustomerSearch()", err.message);
            }
        }
    }

    return (
        <Autocomplete open={open} onOpen={() => setOpen(true)} size="small"
                      onClose={() => setOpen(false)}
                      loading={loading}
                      isOptionEqualToValue={(option, value) => !!value && customerKey(option) === customerKey(value)}
                      value={value}
                      onKeyDown={(ev) => {
                          if (ev.key === 'Tab' && hint) {
                              setInputValue(customerKey(hint));
                              onSelectCustomer(hint);
                          }
                      }}
                      onChange={(ev: any, newValue: SearchCustomer | null) => {
                          setValue(newValue);
                          onSelectCustomer(newValue);
                      }}
                      onInputChange={(ev, newInputValue) => {
                          setInputValue(newInputValue);
                      }}
                      filterOptions={(x) => x}
                      getOptionLabel={(option) => typeof option === 'string' ? option : customerKey(option)}
                      renderInput={
                          (params) => <TextField {...params} variant="filled" sx={{width: '25rem'}}
                                                 label="Customer No" InputProps={{
                              ...inputProps,
                              ...params.InputProps,
                              endAdornment: (<>
                                  {loading ? <CircularProgress color="inherit" size="20"/> : null}
                                  {params.InputProps.endAdornment}
                              </>)
                          }}/>
                      }
                      renderOption={(props, option) => (
                          <Box component="li" {...props}
                               style={{display: 'flex', justifyContent: 'space-between', width: '100%', flexShrink: 0}}>
                              <Box><strong>{customerKey(option)}</strong></Box>
                              <Box sx={{ml: 2}}>{option.CustomerName}</Box>
                          </Box>
                      )}
                      options={results}/>
    )

}
export default CustomerAutocomplete
