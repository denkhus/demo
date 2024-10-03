import { CommonModule, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ProductDto } from 'src/app/shared/dto/products/product.dto';

@Component({
  standalone: true,
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.scss',
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
export class ProductEditComponent {
  public formGroup: FormGroup;

  constructor(
    private bottomSheetRef: MatBottomSheetRef<ProductEditComponent>,
    private fb: FormBuilder,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: ProductDto,
  ) {
    this.formGroup = data
      ? this.fb.group({
          id: fb.control(data.id),
          name: fb.control(data.name),
          price: fb.control(data.price),
        })
      : this.fb.group({
          id: fb.control(undefined),
          name: fb.control(''),
          price: fb.control(''),
        });
  }

  onSubmit(): void {
    this.bottomSheetRef.dismiss(this.formGroup.value as ProductDto);
  }
}
