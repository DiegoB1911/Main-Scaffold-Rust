import { isEmptyObject } from "@/helpers/isEmptyObject";
import type { AnyObject } from "@/types/types";

export const sanitizeObject = <T extends AnyObject>(
  obj: T,
  noEmptyObj = false,
) => {
  return Object.keys(obj).reduce((res, param) => {
    const paramValue = obj[param];

    const emptyObj = noEmptyObj && isEmptyObject(paramValue);

    if (paramValue && !emptyObj) {
      // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
      return { ...res, [param]: paramValue };
    }

    return res;
  }, {} as T);
};
