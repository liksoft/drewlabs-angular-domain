export interface AuthorizationInterface {
    id: number;
    label: string;
    displayLabel: string;
}

export interface AuthorizationGroupInterface {
    id: number;
    label: string;
    displayLabel: string;

    authorizations?: AuthorizationInterface[];
}