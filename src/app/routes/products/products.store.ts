import {
  Store,
  createActionGroup,
  createFeature,
  createReducer,
  createSelector,
  emptyProps,
  on,
  props,
} from '@ngrx/store';

import { inject } from '@angular/core';

export type Product = {
  id: string;
  name: string;
  price: number;
};

export interface ProductsState {
  products: Product[];
}
export const initialState: ProductsState = {
  products: [
    {
      id: '1',
      name: 'Product 1',
      price: 100,
    },
    {
      id: '2',
      name: 'Product 2',
      price: 200,
    },
  ],
};
export const productsActions = createActionGroup({
  source: 'Products',
  events: {
    loadProducts: emptyProps(),
    loadProductsSuccess: props<{ products: Product[] }>(),
    loadProductsFailure: props<{ error: string }>(),
    buyProduct: props<{ name: string }>(),
  },
});

export const productsFeature = createFeature({
  name: 'products',
  reducer: createReducer(
    initialState,
    on(productsActions.loadProductsSuccess, (state, action) => {
      return {
        ...state,
        products: action.products,
      };
    })
  ),
});

export function injectProductsFeature() {
  const store = inject(Store);

  return {
    loadProducts: () => store.dispatch(productsActions.loadProducts()),
    products: store.selectSignal(productsFeature.selectProducts),
  };
}
