import { CommonModule, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { OrderDto, Status } from 'src/app/shared/dto/orders/order.dto';
import { ProductDto } from 'src/app/shared/dto/products/product.dto';

@Component({
  standalone: true,
  selector: 'app-chnge-status',
  templateUrl: './change-status.component.html',
  styleUrl: './change-status.component.scss',
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
export class ChangeStatusComponent {
  public formGroup: FormGroup;
  public statuses = [Status.Created, Status.Cancelled, Status.Completed, Status.InProgress];

  constructor(
    private bottomSheetRef: MatBottomSheetRef<ChangeStatusComponent>,
    private fb: FormBuilder,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: OrderDto,
  ) {
    this.formGroup = this.fb.group({
      id: fb.control(data.id),
      status: fb.control(data.status),
    });
  }

  onSubmit(): void {
    this.bottomSheetRef.dismiss(this.formGroup.value as ProductDto);
  }
}
