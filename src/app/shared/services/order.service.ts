import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { OrderDto } from '../dto/orders/order.dto';
import { Pagination } from '../dto/pagination.dto';
import { ListParams } from './list-params';

@Injectable({
  providedIn: 'root',
})
export class OrdresService {
  private readonly apiUrl = 'http://localhost:3000/orders';

  constructor(private http: HttpClient) {}

  public list(input: ListParams<OrderDto>): Observable<Pagination<OrderDto>> {
    const params = [`_limit=${input.limit}`, `_sort=${input.sort}`, `_order=${input.order}`];

    if (input.page > 0) {
      params.push(`_page=${input.page}`);
    }

    if (input.query) {
      params.push(`title_like=${input.query}`);
    }

    return this.http
      .get<OrderDto[]>(`${this.apiUrl}/?${params.join('&')}`, {
        observe: 'response',
      })
      .pipe(
        map((res) => {
          return {
            totalCount: Number(res.headers.get('x-total-count')) || 0,
            items: res.body || [],
          };
        }),
      );
  }

  public detail(id: number): Observable<OrderDto> {
    return this.http.get<OrderDto>(`${this.apiUrl}/${id}`);
  }

  public create(createCustomerRequest: OrderDto): Observable<OrderDto> {
    return this.http.post<OrderDto>(`${this.apiUrl}/`, createCustomerRequest);
  }

  public patch(id: number, body: Partial<OrderDto>): Observable<OrderDto> {
    return this.http.patch<OrderDto>(`${this.apiUrl}/${id}`, body);
  }
}
