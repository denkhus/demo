import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CustomerDto } from '../dto/customers/customer.dto';
import { Pagination } from '../dto/pagination.dto';
import { ListParams } from './list-params';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  private readonly apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  public list(input: ListParams<CustomerDto>): Observable<Pagination<CustomerDto>> {
    const params = [`_limit=${input.limit}`, `_sort=${input.sort}`, `_order=${input.order}`];

    if (input.page > 0) {
      params.push(`_page=${input.page}`);
    }

    if (input.query) {
      params.push(`title_like=${input.query}`);
    }

    return this.http
      .get<CustomerDto[]>(`${this.apiUrl}/customers?${params.join('&')}`, {
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

  public detail(id: number): Observable<CustomerDto> {
    return this.http.get<CustomerDto>(`${this.apiUrl}/customers/${id}`);
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/customers/${id}`);
  }

  public patch(id: number, body: Partial<CustomerDto>): Observable<CustomerDto> {
    return this.http.patch<CustomerDto>(`${this.apiUrl}/customers/${id}`, body);
  }

  public create(createCustomerRequest: CustomerDto): Observable<CustomerDto> {
    return this.http.post<CustomerDto>(`${this.apiUrl}/customers`, createCustomerRequest);
  }
}
