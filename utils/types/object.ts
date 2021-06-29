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