import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

const RAW_RESPONSE_FLAG = '__rawResponse';

export const RawResponse = (): ClassDecorator & MethodDecorator => {
  return (_target: any, _propertyKey?: string | symbol, descriptor?: any) => {
    if (descriptor?.value) {
      descriptor.value[RAW_RESPONSE_FLAG] = true;
      return descriptor;
    }
    (_target as any)[RAW_RESPONSE_FLAG] = true;
  };
};

export function isRawResponse(target: any): boolean {
  return Boolean(target?.[RAW_RESPONSE_FLAG]);
}
