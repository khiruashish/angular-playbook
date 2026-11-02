import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Indian PIN code: 6 digits, first digit 1-9. */
export const pincodeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const v = String(control.value ?? '');
  if (!v) return null; // let `required` report emptiness
  return /^[1-9]\d{5}$/.test(v) ? null : { pincode: { actual: v } };
};
