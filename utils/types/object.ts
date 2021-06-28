import { isDefined } from "./type-utils";

export const getObjectProperty = (value: object|any, key: string) => {
    if (!isDefined(value) || key === '') {
        return value;
    }
    return value[key];
};