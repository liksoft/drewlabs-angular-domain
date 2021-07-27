export class Canvas {

  public static readAsDataURL = (canvas: HTMLCanvasElement) => canvas.toDataURL();

  public static readBlob = (canvas: HTMLCanvasElement) => new Promise<Blob | undefined>((resolve, _) => canvas.toBlob((blob) => resolve(blob || undefined)));

  public static getImageData = (canvas: HTMLCanvasElement) => canvas.getContext('2d')?.getImageData(0, 0, canvas?.width, canvas?.height);
}