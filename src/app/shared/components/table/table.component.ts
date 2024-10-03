import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Params, Router, RouterLink } from '@angular/router';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { ColumnDefinition } from './column-definition';
import { DataPropertyGetterPipe } from './data-property-getter.pipe';

@Component({
  standalone: true,
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    DataPropertyGetterPipe,
    CommonModule,
  ],
})
export class TableComponent<T> implements OnInit, AfterViewInit {
  public tableDataSource = new MatTableDataSource<T>([]);
  @ViewChild(MatPaginator, { static: false }) matPaginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) matSort!: MatSort;
  @Input() public readonly pageSizeOptions = [5, 10, 25, 100];
  displayedColumns: string[] = [];
  @Input() isPageable = false;
  @Input() isSortable = false;
  @Input() pageSize = 5;
  @Input() pageIndex = 1;
  @Input() totalCount = 0;
  @Input()
  sortBy!: string;
  @Input() sortDirection: 'asc' | 'desc' = 'asc';
  @Input() isFilterable = false;
  @Input() tableColumns: ColumnDefinition[] = [];
  @Input() rowActionIcon: string = '';
  @Input() defaultPageSize = this.pageSizeOptions[1];

  @Input() set tableData(data: T[]) {
    this.setTableDataSource(data);
  }

  @Output() sort: EventEmitter<Sort> = new EventEmitter();
  private router = inject(Router);

  ngOnInit(): void {
    this.displayedColumns = this.tableColumns.map((tableColumn: ColumnDefinition) => tableColumn.name);
  }

  ngAfterViewInit(): void {
    this.tableDataSource.paginator = this.matPaginator;
  }

  setTableDataSource(data: T[]) {
    this.tableDataSource = new MatTableDataSource<T>(data);
    this.tableDataSource.paginator = this.matPaginator;
    this.tableDataSource.sort = this.matSort;
  }

  sortTable(sortParameters: Sort) {
    sortParameters.active = this.tableColumns.find((column) => column.name === sortParameters.active)!.dataKey;
    this.sort.emit(sortParameters);
  }

  public onPageChange(event: PageEvent): void {
    let pageIndex = null;
    if (event.pageSize === this.pageSize) {
      pageIndex = event.pageIndex + 1 > 1 ? event.pageIndex + 1 : null;
    }
    this.setFiltersToRoute({
      pageIndex,
      pageSize: event.pageSize,
    });
  }

  private setFiltersToRoute(queryParams?: Params | null): void {
    this.router.navigate([], {
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
  public onSortChange(event: Sort): void {
    this.setFiltersToRoute({
      sortBy: event.active,
      sortDirection: event.direction,
      pageIndex: null,
    });
  }
}
