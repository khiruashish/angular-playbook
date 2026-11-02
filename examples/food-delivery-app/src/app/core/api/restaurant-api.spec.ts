import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { APP_ENV } from '../config';
import { environment } from '../../../environments/environment';
import { Restaurant } from '../models/models';
import { RestaurantApi } from './restaurant-api';

describe('RestaurantApi', () => {
  let api: RestaurantApi;
  let ctrl: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: APP_ENV, useValue: { ...environment, apiBaseUrl: '/api', useMockApi: false } },
      ],
    });
    api = TestBed.inject(RestaurantApi);
    ctrl = TestBed.inject(HttpTestingController);
  });

  afterEach(() => ctrl.verify());

  it('builds query params only for provided filters', () => {
    let result: Restaurant[] | undefined;
    api.search({ q: 'pizza', vegOnly: true, sort: 'rating' }).subscribe((r) => (result = r));

    const req = ctrl.expectOne((r) => r.url === '/api/restaurants');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('q')).toBe('pizza');
    expect(req.request.params.get('vegOnly')).toBe('true');
    expect(req.request.params.get('sort')).toBe('rating');
    req.flush([{ id: 'r3', name: 'Napoli' }]);

    expect(result?.[0].id).toBe('r3');
  });

  it('omits empty filters', () => {
    api.search({}).subscribe();
    const req = ctrl.expectOne('/api/restaurants');
    expect(req.request.params.keys()).toEqual([]);
    req.flush([]);
  });
});
