import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';

/** Challenge 2: <li *appRepeat="3; let i = index">Item {{ i }}</li> */
@Directive({ selector: '[appRepeat]' })
export class RepeatDirective {
  private readonly tpl = inject(TemplateRef<{ $implicit: number; index: number }>);
  private readonly vcr = inject(ViewContainerRef);
  readonly appRepeat = input.required<number>();

  constructor() {
    effect(() => {
      this.vcr.clear();
      for (let i = 0; i < this.appRepeat(); i++) {
        this.vcr.createEmbeddedView(this.tpl, { $implicit: i, index: i });
      }
    });
  }

  static ngTemplateContextGuard(_d: RepeatDirective, ctx: unknown): ctx is { $implicit: number; index: number } {
    return true;
  }
}
