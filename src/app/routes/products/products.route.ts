import { Component, OnInit } from '@angular/core';

import { NgFor } from '@angular/common';
import { injectProductsFeature } from './products.store';

@Component({
  selector: 'app-products',
  standalone: true,
  template: `
    <ul>
      <li *ngFor="let product of productsFeature.products()">
        {{ product.name }} - {{ product.price }}
      </li>
    </ul>
  `,
  imports: [NgFor],
})
export default class ProductsRoute {
  readonly productsFeature = injectProductsFeature();
}
