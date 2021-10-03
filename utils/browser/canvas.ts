export class Canvas {
  /**
   * @description Read the content of the Canvas Element as data URL string
   * @param canvas
   */
  public static readAsDataURL = (canvas: HTMLCanvasElement) => canvas.toDataURL();

  /**
   * @description Read the content of the Canvas Element as {@see Blob} object
   * @param canvas
   */
  public static readBlob = (canvas: HTMLCanvasElement) => new Promise<Blob | undefined>((resolve, _) => canvas.toBlob((blob) => resolve(blob || undefined)));

  /**
   * @description Get the image data {@see ImageData} object from the canvas element
   * @param canvas
   */
  public static getImageData = (canvas: HTMLCanvasElement) => canvas.getContext('2d')?.getImageData(0, 0, canvas?.width, canvas?.height);
}
