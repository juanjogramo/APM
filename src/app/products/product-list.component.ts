import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { IProduct } from "./product";
import { ProductService } from "./product.service";

@Component({
    selector: 'pm-products',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css']
})

export class ProductListComponent implements OnInit, OnDestroy {
    pageTitle: string = "Product List!";
    imageWidth: number = 50;
    imageMargin: number = 2;
    showImage: boolean = false;
    errorMessage: string = '';
    sub!: Subscription;
    private _listFilter: string = '';
    
    get listFilter(): string {
        return this._listFilter
    }

    set listFilter(value: string) {
        this._listFilter = value;
        console.log('In Setter: ', value);
        this.filteredProducts = this.perfomFilter(value);
    }
    
    filteredProducts: IProduct[] = [];
    products: IProduct[] = [];

    constructor(private productService: ProductService) {}

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    ngOnInit(): void {
        this.sub = this.productService.getProduct().subscribe({
            next: products => {
                this.products = products;
                this.filteredProducts = this.products;
            },
            error: err => this.errorMessage = err
        });
    }

    perfomFilter(filteredBy: string): IProduct[] {
        filteredBy = filteredBy.toLocaleLowerCase();
        return this.products
                    .filter((product: IProduct) => 
                        product.productName
                            .toLocaleLowerCase()
                            .includes(filteredBy)
                    );
    }

    toggleImage() {
        this.showImage = !this.showImage;
    }

    onRatingClicked(message: string): void {
        this.pageTitle = 'Product List: ' + message
    }
}