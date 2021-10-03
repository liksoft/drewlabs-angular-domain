
export const getJSObjectPropertyValue = (
  item: any,
  field: string,
  deepPropertySeperator: string = '.'
) => {
  if (
    !(typeof field !== 'undefined' && field !== null && field !== undefined)
  ) {
    return field;
  }
  if (field.indexOf(deepPropertySeperator || '.') !== -1) {
    const innerFields = field.split(
      deepPropertySeperator || '.'
    );
    let currentObj = item;
    for (const v of innerFields) {
      if (isObject(currentObj) && currentObj[v]) {
        currentObj = currentObj[v];
      } else {
        currentObj = null;
        break;
      }
    }
    return currentObj;
  } else {
    return item[field];
  }
};

const isObject = (item: any): boolean => {
  return item && typeof item === 'object' && !Array.isArray(item);
};
