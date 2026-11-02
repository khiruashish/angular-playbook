import { FormControl } from '@angular/forms';
import { pincodeValidator } from './pincode.validator';

describe('pincodeValidator', () => {
  it.each(['560001', '110011'])('accepts %s', (v) => {
    expect(pincodeValidator(new FormControl(v))).toBeNull();
  });

  it.each(['012345', '12345', 'abcdef', '5600011'])('rejects %s', (v) => {
    expect(pincodeValidator(new FormControl(v))).toEqual({ pincode: { actual: v } });
  });

  it('ignores empty values (required handles that)', () => {
    expect(pincodeValidator(new FormControl(''))).toBeNull();
  });
});
