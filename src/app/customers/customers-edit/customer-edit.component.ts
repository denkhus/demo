import { CommonModule, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CustomerDto } from 'src/app/shared/dto/customers/customer.dto';

@Component({
  standalone: true,
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrl: './customer-edit.component.scss',
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
  ],
})
export class CustomerEditComponent {
  public formGroup: FormGroup;

  constructor(
    private bottomSheetRef: MatBottomSheetRef<CustomerEditComponent>,
    private fb: FormBuilder,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: CustomerDto,
  ) {
    this.formGroup = data
      ? this.fb.group({
          id: fb.control(data.id),
          name: fb.control(data.name),
          lastName: fb.control(data.lastName),
          address: fb.control(data.address),
        })
      : this.fb.group({
          id: fb.control(undefined),
          name: fb.control(''),
          lastName: fb.control(''),
          address: fb.control(''),
        });
  }

  onSubmit(): void {
    this.bottomSheetRef.dismiss(this.formGroup.value as CustomerDto);
  }
}
