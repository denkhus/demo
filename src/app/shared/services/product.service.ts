import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Pagination } from '../dto/pagination.dto';
import { ProductDto } from '../dto/products/product.dto';
import { ListParams } from './list-params';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  public list(input: ListParams<ProductDto>): Observable<Pagination<ProductDto>> {
    const params = [`_limit=${input.limit}`, `_sort=${input.sort}`, `_order=${input.order}`];

    if (input.page > 0) {
      params.push(`_page=${input.page}`);
    }

    if (input.query) {
      params.push(`title_like=${input.query}`);
    }

    return this.http
      .get<ProductDto[]>(`${this.apiUrl}/products?${params.join('&')}`, {
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

  public detail(id: number): Observable<ProductDto> {
    return this.http.get<ProductDto>(`${this.apiUrl}/products/${id}`);
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`);
  }

  public patch(id: number, body: Partial<ProductDto>): Observable<ProductDto> {
    return this.http.patch<ProductDto>(`${this.apiUrl}/products/${id}`, body);
  }

  public create(createCustomerRequest: ProductDto): Observable<ProductDto> {
    return this.http.post<ProductDto>(`${this.apiUrl}/products`, createCustomerRequest);
  }
}
