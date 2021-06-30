import { isDefined } from "./type-utils";

export const getObjectProperty = (value: object|any, key: string) => {
    if (!isDefined(value)) {
        return value;
    }
    if (key === '') {
        return undefined;
    }
    return value[key];
};

export const setObjectProperty = (source: object|any, key: string, value?: any) => {
    if (key === '') {
        return source;
    }
    if (!isDefined(key)) {
        return source;
    }

    if (!isDefined(source)) {
        return source;
    }
    return value[key] = value || undefined;
};