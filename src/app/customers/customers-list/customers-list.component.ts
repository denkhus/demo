import { PortalModule } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import { CustomerDto } from 'src/app/shared/dto/customers/customer.dto';
import { getParamQuery } from 'src/app/shared/rxjs/get-param-query';
import { getPageParams } from 'src/app/shared/rxjs/page-params';
import { getParamSort } from 'src/app/shared/rxjs/sort-params';
import { CustomersService } from 'src/app/shared/services/customers.service';
import { CustomerEditComponent } from '../customers-edit/customer-edit.component';

@Component({
  standalone: true,
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrl: './customers-list.component.scss',
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
  ],
})
export class CustomersListComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ViewChild('actions', { static: true }) actions!: TemplateRef<any>;
  public readonly displayedColumns: string[] = ['id', 'name', 'lastName', 'address', 'actions'];
  public readonly displayedColumnsExpanded = [...this.displayedColumns, 'expand'];
  public readonly pageSizeOptions = [5, 10, 25, 100];
  public data = signal<CustomerDto[]>([]);
  public totalCount = signal(0);
  public tableService = inject(TableService);
  public columnDefinitions = signal<ColumnDefinition[]>([]);

  public expandedElement: CustomerDto | null = null;
  private destroyRef = inject(DestroyRef);
  private _bottomSheet = inject(MatBottomSheet);
  private reload = signal(false);
  private reload$ = new BehaviorSubject(false);

  constructor(
    private customersService: CustomersService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    effect(() => {
      if (this.reload()) {
        this.customersService
          .list({
            page: this.tableService.pageIndex(),
            limit: this.tableService.pageSize(),
            sort: this.tableService.sortBy() as keyof CustomerDto,
            order: this.tableService.sortDirection(),
            query: this.tableService.query(),
          })
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((customers) => {
            this.data.set(customers.items);
            this.reload.set(false);
            this.totalCount.set(customers.totalCount);
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
        dataKey: 'name',
        isSortable: true,
      } as ColumnDefinition,
      {
        name: 'Last Name',
        dataKey: 'lastName',
        isSortable: true,
      } as ColumnDefinition,
      {
        name: 'Address',
        dataKey: 'address',
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
      this.route.queryParamMap.pipe(getParamSort<CustomerDto>()),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([rel, page, query, sort]) => {
        this.tableService.query.set(query);
        this.tableService.pageIndex.set(page.pageIndex || 1);
        this.tableService.pageSize.set(page.pageSize || 5);
        this.tableService.sortBy.set(sort.sortBy || 'id');
        this.tableService.sortDirection.set(sort.sortDirection || 'asc');
        this.reload.set(rel);
      });
  }

  onCreate(event: Event): void {
    event.stopPropagation();
    this._bottomSheet
      .open<CustomerEditComponent, CustomerDto, CustomerDto>(CustomerEditComponent)
      .afterDismissed()
      .pipe(
        first(),
        filter((res) => !!res),
        switchMap((res) => {
          return this.customersService.create(res!).pipe(first());
        }),
      )
      .subscribe(() => {
        this.reload$.next(true);
      });
  }

  onDelete(id: number): void {
    this.customersService
      .delete(id)
      .pipe(first())
      .subscribe(() => this.reload$.next(true));
  }

  onEdit(event: Event, data: CustomerDto): void {
    event.stopPropagation();
    this._bottomSheet
      .open<CustomerEditComponent, CustomerDto, CustomerDto>(CustomerEditComponent, { data: { ...data } })
      .afterDismissed()
      .pipe(
        first(),
        switchMap((res) => {
          return this.customersService.patch(data.id!, res as Partial<CustomerDto>).pipe(first());
        }),
      )
      .subscribe(() => {
        this.reload$.next(true);
      });
  }

  onDetail(event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/id']);
  }

  public onDeleted(id: number): void {
    this.data.update((value) => value.filter((i) => i.id !== id));
  }

  public trackByCustomerId(_: number, target: CustomerDto): string | number {
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
