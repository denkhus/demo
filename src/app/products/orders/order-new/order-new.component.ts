import { CommonModule, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CustomerDto } from 'src/app/shared/dto/customers/customer.dto';
import { OrderDto, Status } from 'src/app/shared/dto/orders/order.dto';
import { ProductDto } from 'src/app/shared/dto/products/product.dto';
import { CustomersService } from 'src/app/shared/services/customers.service';
import { ProductsService } from 'src/app/shared/services/product.service';

@Component({
  standalone: true,
  selector: 'app-order-new',
  templateUrl: './order-new.component.html',
  styleUrl: './oreder-new.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UpperCasePipe,
    ReactiveFormsModule,
    MatFormField,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatOptionModule,
    MatSelectModule,
  ],
})
export class OrderNewComponent {
  public formGroup: FormGroup;
  public customers = signal<CustomerDto[]>([]);
  public products = signal<ProductDto[]>([]);
  private destroyRef = inject(DestroyRef);
  get ordersLines() {
    return this.formGroup.get('ordersLines') as FormArray;
  }

  constructor(
    private customerService: CustomersService,
    private productService: ProductsService,
    private bottomSheetRef: MatBottomSheetRef<OrderNewComponent>,
    private fb: FormBuilder,
  ) {
    this.productService
      .list({ limit: 1000, order: 'asc', page: 15, sort: 'id', query: '' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => this.products.set(res.items));
    this.customerService
      .list({ limit: 1000, order: 'asc', page: 15, sort: 'id', query: '' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => this.customers.set(res.items));
    this.formGroup = this.fb.group({
      customer: fb.control(null),
      createdAt: fb.control(''),
      status: fb.control(Status.Created),
      ordersLines: this.fb.array<FormGroup>([]),
    });
  }

  public addOrder(): void {
    this.ordersLines.push(
      this.fb.group({
        product: this.fb.control<string | null>(null),
        count: this.fb.control<number>(0),
        price: this.fb.control<number>(0),
      }),
    );
  }

  public removeOrder(index: number): void {
    this.ordersLines.removeAt(index);
  }

  onSubmit(): void {
    this.bottomSheetRef.dismiss(this.formGroup.value as OrderDto);
  }
}
