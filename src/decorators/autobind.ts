    export function autoBind(_: any, _2: string, descriptor: PropertyDescriptor){
        const originalMethod = descriptor.value;
        const adjustedDescriptor: PropertyDescriptor = {
            configurable: true,
            get(){
                const fn = originalMethod.bind(this);
                return fn;
            }
        }
    
        return adjustedDescriptor;
    }