import type {BarcodeSODetailLine} from "@/src/types.ts";

export type DetailRecord = Record<string, BarcodeSODetailLine>;
export type SalesOrderProviderStatus = 'idle' | 'loading' | 'generating' | 'rejected';
