import type {NestedPaths, SortFunction, SortProps} from "chums-types";

export interface SortOptions<T> extends SortProps<T> {
    defaultField: keyof T;
    caseInsensitive?: boolean;
    valueModifiers?: Record<string, (arg: T) => number | string>
}

export const sortFactory = <T extends object>(props: SortOptions<T>): SortFunction<T> => {
    const ascending = props.ascending;
    const field = props.field;
    const defaultField = props.defaultField;
    const caseInsensitive = props.caseInsensitive ?? false;
    const valueModifiers = props.valueModifiers ?? {} as Record<NestedPaths<T>, (arg: T) => number | string>;
    return (a: T, b: T): number => {
        const sortMod = ascending ? 1 : -1;
        let valA: unknown;
        let valB: unknown;

        if (typeof field === 'string' && field.includes('.')) {
            valA = getDeepValue(a, field);
            valB = getDeepValue(b, field);
        } else {
            const flatKey = field as keyof T;
            valA = a[flatKey];
            valB = b[flatKey];
        }
        if (valA === valB) {
            valA = a[defaultField];
            valB = b[defaultField];
        }

        if (typeof valueModifiers[field as string] === 'function') {
            const modifier = valueModifiers[field as string];
            valA = modifier(a);
            valB = modifier(b);
        }

        if (valA === valB) {
            return 0;
        }

        if (typeof valA === 'undefined' || valA === null) {
            return 1 * sortMod;
        }
        if (typeof valB === 'undefined' || valB === null) {
            return -1 * sortMod;
        }
        if (typeof valA === 'boolean' && typeof valB === 'boolean') {
            return (valA ? 1 : 0) - (valB ? 1 : 0) * sortMod;
        }

        if (typeof valA === 'string' && typeof valB === 'string') {
            if (caseInsensitive) {
                return valA.toLowerCase().localeCompare(valB.toLowerCase()) * sortMod;
            }
            return valA.localeCompare(valB) * sortMod;
        }

        if (valA instanceof Date && valB instanceof Date) {
            return (valA.valueOf() - valB.valueOf()) * sortMod;
        }

        if (typeof valA === 'number' && typeof valB === 'number') {
            return (valA - valB) * sortMod;
        }

        return String(valA).localeCompare(String(valB)) * sortMod;
    }
}

/**
 * Type-safe deep value extractor that avoids top-level 'any' variables
 */
function getDeepValue(obj: unknown, path: string): unknown {
    if (!obj || typeof obj !== 'object') return undefined;

    return path.split('.').reduce<unknown>((acc, part) => {
        if (acc && typeof acc === 'object' && part in acc) {
            return (acc as Record<string, unknown>)[part];
        }
        return undefined;
    }, obj);
}
