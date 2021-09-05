export const readAsDataURL = (content: Blob | File) => {
  return new Promise<string | undefined>((resolve, reject) => {
    if (content) {
      const reader = new FileReader();
      reader.onload = async (e: ProgressEvent<FileReader>) => {
        return resolve(e.target?.result as string | undefined);
      };
      reader.readAsDataURL(content);
    } else {
      reject("Content must not be undefined...");
    }
  });
};

export const readAsArrayBuffer = async (content: Blob | File) => {
  if (content instanceof Blob) {
    return await content.arrayBuffer();
  }
  return new Promise<ArrayBuffer | undefined>((resolve, reject) => {
    if (content) {
      const reader = new FileReader();
      reader.onload = async (e: ProgressEvent<FileReader>) => {
        return resolve(e.target?.result as ArrayBuffer | undefined);
      };
      reader.readAsArrayBuffer(content);
    } else {
      reject("Content must not be undefined...");
    }
  });
};

export const readAsBinaryString = async (content: Blob | File) => {
  if (content instanceof Blob) {
    return await content.text();
  }
  return new Promise<string | undefined>((resolve, reject) => {
    if (content) {
      const reader = new FileReader();
      reader.onload = async (e: ProgressEvent<FileReader>) => {
        return resolve(e.target?.result as string | undefined);
      };
      reader.readAsBinaryString(content);
    } else {
      reject("Content must not be undefined...");
    }
  });
};
