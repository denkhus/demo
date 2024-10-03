import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Status } from 'src/app/shared/dto/orders/order.dto';

@Directive({
  standalone: true,
  selector: '[appCanEditOrder]',
})
export class CanEditOrderDirective {
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
  ) {}

  @Input() set appCanEditOrder(status: Status) {
    if (status === Status.Completed || status === Status.Cancelled) {
      this.viewContainer.clear();
    } else {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
