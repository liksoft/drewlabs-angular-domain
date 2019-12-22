import { environment } from 'src/environments/environment';

/**
 * @description Generate a storage key by prefixing the provided key with the application unique key
 * @param value [[string]]
 */
export function storageEntry(value: string): string {
  return `${environment.applicationUniqueID ? environment.applicationUniqueID : 'App_By_Sedana&Drew'}_${value}`;
}
