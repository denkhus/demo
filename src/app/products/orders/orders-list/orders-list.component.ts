import { PortalModule } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { BehaviorSubject, combineLatest, filter, first, switchMap } from 'rxjs';
import { ColumnDefinition } from 'src/app/shared/components/table/column-definition';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { TableService } from 'src/app/shared/components/table/table.service';
import { OrderDto } from 'src/app/shared/dto/orders/order.dto';
import { getParamQuery } from 'src/app/shared/rxjs/get-param-query';
import { getPageParams } from 'src/app/shared/rxjs/page-params';
import { getParamSort } from 'src/app/shared/rxjs/sort-params';
import { OrdresService } from 'src/app/shared/services/order.service';
import { ChangeStatusComponent } from '../change-status/change-status.component';
import { CanEditOrderDirective } from '../directives/can-edit.directive';
import { OrderNewComponent } from '../order-new/order-new.component';

@Component({
  standalone: true,
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TableService],
  imports: [
    FormsModule,
    LocalizeRouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    RouterLink,
    PortalModule,
    MatBottomSheetModule,
    TableComponent,
    OrderNewComponent,
    ChangeStatusComponent,
    CanEditOrderDirective,
  ],
})
export class OrdersListComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ViewChild('actions', { static: true }) actions!: TemplateRef<any>;
  public readonly pageSizeOptions = [5, 10, 25, 100];
  public data = signal<OrderDto[]>([]);
  public columnDefinitions = signal<ColumnDefinition[]>([]);
  public query = signal('');

  private destroyRef = inject(DestroyRef);
  private _bottomSheet = inject(MatBottomSheet);
  private reload = signal(false);
  private reload$ = new BehaviorSubject(false);
  public tableService = inject(TableService);

  constructor(
    private orderService: OrdresService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    effect(() => {
      if (this.reload()) {
        this.orderService
          .list({
            page: this.tableService.pageIndex(),
            limit: this.tableService.pageSize(),
            sort: this.tableService.sortBy() as keyof OrderDto,
            order: this.tableService.sortDirection(),
            query: this.query(),
          })
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((products) => {
            this.data.set(products.items);
            this.reload.set(false);
            this.tableService.totalCount.set(products.totalCount);
          });
      }
    });
  }

  public ngOnInit(): void {
    this.reload$.next(true);
    this.columnDefinitions.set([
      {
        name: 'ID',
        dataKey: 'id',
        isSortable: true,
      } as ColumnDefinition,
      {
        name: 'Name',
        dataKey: 'customer',
        isSortable: true,
      } as ColumnDefinition,
      {
        name: 'Create Date',
        dataKey: 'createAt',
        isSortable: true,
      } as ColumnDefinition,
      {
        name: 'Update Date',
        dataKey: 'updateAt',
        isSortable: true,
      } as ColumnDefinition,
      {
        name: 'Status',
        dataKey: 'status',
        isSortable: true,
      } as ColumnDefinition,
      {
        name: 'Actions',
        dataKey: '',
        isSortable: false,
        templateRef: this.actions,
      } as ColumnDefinition,
    ]);
    combineLatest([
      this.reload$,
      this.route.queryParamMap.pipe(getPageParams()),
      this.route.queryParamMap.pipe(getParamQuery()),
      this.route.queryParamMap.pipe(getParamSort<OrderDto>()),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([rel, page, query, sort]) => {
        this.query.set(query);
        this.tableService.pageIndex.set(page.pageIndex || 1);
        this.tableService.pageSize.set(page.pageSize || 5);
        this.tableService.sortBy.set(sort.sortBy || 'id');
        this.tableService.sortDirection.set(sort.sortDirection || 'asc');
        this.reload.set(rel);
      });
  }

  public onQueryChange(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.setFiltersToRoute({
      query: query ? encodeURIComponent(query) : null,
      pageIndex: null,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onCreate(event: Event): void {
    event.stopPropagation();
    this._bottomSheet
      .open<OrderNewComponent, OrderDto, OrderDto>(OrderNewComponent)
      .afterDismissed()
      .pipe(
        first(),
        filter((res) => !!res),
        switchMap((res) => {
          return this.orderService.create(res!).pipe(first());
        }),
      )
      .subscribe(() => {
        this.reload$.next(true);
      });
  }

  public onChangeStatus(event: Event, data: OrderDto): void {
    this._bottomSheet
      .open<ChangeStatusComponent, OrderDto, OrderDto>(ChangeStatusComponent, { data: { ...data } })
      .afterDismissed()
      .pipe(
        first(),
        switchMap((res) => {
          return this.orderService.patch(data.id!, res as Partial<OrderDto>).pipe(first());
        }),
      )
      .subscribe(() => {
        this.reload$.next(true);
      });
  }

  public trackByCustomerId(_: number, target: OrderDto): string | number {
    return target.id!;
  }

  private setFiltersToRoute(queryParams?: Params | null): void {
    this.router.navigate([], {
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
