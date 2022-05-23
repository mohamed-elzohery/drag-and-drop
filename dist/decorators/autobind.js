export function autoBind(_, _2, descriptor) {
    var originalMethod = descriptor.value;
    var adjustedDescriptor = {
        configurable: true,
        get: function () {
            var fn = originalMethod.bind(this);
            return fn;
        }
    };
    return adjustedDescriptor;
}
