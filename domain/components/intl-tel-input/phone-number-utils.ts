export class PhoneNumberUtils {
  public static sanitize(n: string) {
    if (n.startsWith('00')) {
      return`+${n.slice(2)}`;
    } else if (n.startsWith('+')) {
      return n;
    } else {
      return `+${n}`;
    }
  }
}
