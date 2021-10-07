export const getReadInterval = (fps: number = 30) => {
  const start = Date.now();
  const _fps = 5000 / fps;
  const time = (Date.now() - start);
  const interval = _fps - time;
  return interval;
};
