import { TestBed } from '@angular/core/testing';
import { OrderFeedback, Feedback } from './order-feedback';

describe('OrderFeedback (Signal Forms)', () => {
  async function setup() {
    TestBed.configureTestingModule({ imports: [OrderFeedback] });
    const fixture = TestBed.createComponent(OrderFeedback);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    const set = async (sel: string, v: string) => {
      const input = el.querySelector(sel) as HTMLInputElement;
      input.value = v;
      input.dispatchEvent(new Event('input'));
      await fixture.whenStable();
    };
    return { fixture, el, set };
  }

  it('is valid with defaults', async () => {
    const { el } = await setup();
    expect((el.querySelector('button') as HTMLButtonElement).disabled).toBe(false);
  });

  it('requires an explanation for low ratings (cross-field validation)', async () => {
    const { el, set } = await setup();
    await set('input[type=number]', '1');
    expect(el.textContent).toContain('Please tell us what went wrong');
    expect((el.querySelector('button') as HTMLButtonElement).disabled).toBe(true);

    await set('textarea', 'Food arrived cold');
    expect(el.textContent).not.toContain('Please tell us what went wrong');
  });

  it('rejects rating > 5', async () => {
    const { el, set } = await setup();
    await set('input[type=number]', '7');
    expect(el.textContent).toContain('Maximum 5 stars');
  });

  it('emits the model on submit', async () => {
    const { fixture, el, set } = await setup();
    const sent: Feedback[] = [];
    fixture.componentInstance.sent.subscribe((f) => sent.push(f));
    await set('textarea', 'Great!');
    (el.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
    expect(sent).toEqual([{ rating: 5, comment: 'Great!', tip: 0 }]);
  });
});
