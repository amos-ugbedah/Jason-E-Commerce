// src/components/jason/lodash.js
import _ from "lodash";

export const capitalize = (str) => _.capitalize(str);
export const sortByKey = (arr, key) => _.sortBy(arr, key);
export const uniqueArray = (arr) => _.uniq(arr);
export const deepClone = (obj) => _.cloneDeep(obj);
