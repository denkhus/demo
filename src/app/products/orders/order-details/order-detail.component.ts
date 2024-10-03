import { CommonModule, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { delay, switchMap } from 'rxjs';
import { DataSource } from 'src/app/shared/classes/data-source';
import { OrderDto } from 'src/app/shared/dto/orders/order.dto';
import { filterNumber } from 'src/app/shared/rxjs/filter-number';
import { getParamId } from 'src/app/shared/rxjs/get-param-id';
import { setInitialIfNotNumber } from 'src/app/shared/rxjs/set-initial-if-not-number';
import { OrdresService } from 'src/app/shared/services/order.service';

@Component({
  standalone: true,
  selector: 'app-order-details',
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UpperCasePipe, MatCardModule, MatIconModule, MatButtonModule, CommonModule],
})
export class OrderDetailsComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  public dataSource = new DataSource<OrderDto>({} as OrderDto);

  constructor(
    private orderService: OrdresService,
    private route: ActivatedRoute,
  ) {}

  public ngOnInit(): void {
    this.route.paramMap
      .pipe(
        delay(500),
        getParamId(),
        setInitialIfNotNumber(this.dataSource),
        filterNumber(),
        switchMap((id) => this.orderService.detail(Number(id))),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (order) => {
          this.dataSource.setData(order);
        },
      });
  }
}
