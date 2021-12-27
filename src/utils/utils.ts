import _ from 'lodash';

export function recursiveMergeArrayBy(array: Array<unknown>, attribute: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return _.uniqWith(array, (pre: any, cur: any) => {
    if (pre[attribute] === cur[attribute]) {
      const mergedOptions = cur.options.concat(pre.options);
      cur.options = recursiveMergeArrayBy(mergedOptions, attribute);
      return true;
    }
    return false;
  });
}
