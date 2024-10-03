import { CommonModule, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { delay, switchMap } from 'rxjs';
import { DataSource } from 'src/app/shared/classes/data-source';
import { ProductDto } from 'src/app/shared/dto/products/product.dto';
import { filterNumber } from 'src/app/shared/rxjs/filter-number';
import { getParamId } from 'src/app/shared/rxjs/get-param-id';
import { setInitialIfNotNumber } from 'src/app/shared/rxjs/set-initial-if-not-number';
import { ProductsService } from 'src/app/shared/services/product.service';

@Component({
  standalone: true,
  selector: 'app-product-details',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UpperCasePipe, MatCardModule, MatIconModule, MatButtonModule, CommonModule],
})
export class ProductDetailsComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  public dataSource = new DataSource<ProductDto>({} as ProductDto);

  constructor(
    private productService: ProductsService,
    private route: ActivatedRoute,
  ) {}

  public ngOnInit(): void {
    this.route.paramMap
      .pipe(
        delay(500),
        getParamId(),
        setInitialIfNotNumber(this.dataSource),
        filterNumber(),
        switchMap((id) => this.productService.detail(Number(id))),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (post) => {
          this.dataSource.setData(post);
        },
      });
  }
}
