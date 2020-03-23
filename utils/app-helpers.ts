import { environment } from 'src/environments/environment';

/**
 * @description Generate a storage key by prefixing the provided key with the application unique key
 * @param value [[string]]
 */
export function storageEntry(value: string): string {
  return `${environment.applicationUniqueID ? environment.applicationUniqueID : 'App_By_Sedana&Drew'}_${value}`;
}

/**
 * @description Generate a unique big integer as filename
 */
export function randomfilename() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
