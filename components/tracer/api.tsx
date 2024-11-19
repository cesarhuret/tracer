import { JsonFragment } from 'ethers';
import { json } from 'stream/consumers';

export type AddressInfo = {
    label: string;
    functions: Record<string, JsonFragment>;
    events: Record<string, JsonFragment>;
    errors: Record<string, JsonFragment>;
};
export type TraceEntryCall = {
    path: string;
    type: 'call';
    variant: 'call' | 'callcode' | 'staticcall' | 'delegatecall' | 'create' | 'create2' | 'selfdestruct';
    gas: number;
    isPrecompile: boolean;
    from: string;
    to: string;
    input: string;
    output: string;
    gasUsed: number;
    value: string;
    status: number;

    codehash: string;

    calls: TraceEntry[];
};
export type TraceEntryLog = {
    path: string;
    type: 'log';
    topics: string[];
    data: string;
};
export type TraceEntrySload = {
    path: string;
    type: 'sload';
    slot: string;
    value: string;
};
export type TraceEntrySstore = {
    path: string;
    type: 'sstore';
    slot: string;
    oldValue: string;
    newValue: string;
};
export type TraceEntry = TraceEntryCall | TraceEntryLog | TraceEntrySload | TraceEntrySstore;
export type TraceResponse = {
    chain: string;
    txhash: string;
    preimages: Record<string, string>;
    addresses: Record<string, Record<string, AddressInfo>>;
    entrypoint: TraceEntryCall;
};

export type StorageResponse = {
    allStructs: any[];
    arrays: any[];
    structs: any[];
    slots: Record<string, any>;
};

export function apiEndpoint(): string {
    return process.env.NEXT_PUBLIC_API_HOST || "";
}

export type APIResponseError = {
    ok: false;
    error: string;
};
export type APIResponseSuccess<T> = {
    ok: true;
    result: T;
};
export type APIResponse<T> = APIResponseError | APIResponseSuccess<T>;
export const doApiRequest = async <T,>(path: string, init?: RequestInit): Promise<T> => {
    return fetch(`${apiEndpoint()}${path}`, init)
        .then((res) => res.json())
        .then((json) => json as APIResponse<T>)
        .then((resp) => {
            if (!resp.ok) {
                throw new Error(resp.error);
            }
            return resp.result;
        });
};

export const doTraceRequest = async (chain: string, txhash: string): Promise<TraceResponse> => {
    try {
        const body = {
            "method": "debug_traceTransaction",
            "params": [
              txhash,
              {
                "tracer": "callTracer"
              }
            ],
            "id": 1,
            "jsonrpc": "2.0"
          }

        return fetch(apiEndpoint(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            redirect: 'follow'
          })
        .then((res) => res.json())
        .then((json) => {

            var i = 0;

            const processEntry = (entry: any, path: string): TraceEntryCall => {
                i++;
                const myPath = (path != "" && (path + ".")) + i.toString();
                if (entry.calls) {
                    entry.calls = entry.calls?.map((call: any) => processEntry(call, myPath));
                }
                return { ...entry, type: 'call', variant: entry.type.toLowerCase(), path: myPath } as TraceEntryCall;
            };

            const traceResponse: TraceResponse = {
                chain,
                txhash,
                preimages: {},
                addresses: {},
                entrypoint: processEntry(json.result, "") as TraceEntryCall,
            };

            return traceResponse;
        })
    } catch (e) {
        throw new Error(`Failed to fetch trace: ${e}`);
    }
};

