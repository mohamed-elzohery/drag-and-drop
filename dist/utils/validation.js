export function validateValue(validator) {
    var isValid = true;
    if (validator.required) {
        isValid = isValid && validator.value.toString().length !== 0;
    }
    if ('maxLength' in validator && validator.maxLength !== undefined) {
        isValid = isValid && validator.value.toString().length < validator.maxLength;
    }
    if ('minLength' in validator && validator.minLength !== undefined) {
        isValid = isValid && validator.value.toString().length > validator.minLength;
    }
    if ('max' in validator && validator.max !== undefined) {
        isValid = isValid && validator.value < validator.max;
    }
    if ('min' in validator && validator.min !== undefined) {
        isValid = isValid && validator.value > validator.min;
    }
    return isValid;
}
