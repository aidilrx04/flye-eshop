import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ProductModel } from '../../../models/product.model';
import { ProductCardComponent } from '../../core/product-card/product-card.component';
import { ProductService } from '../../../services/product.service';

interface ImageFile {
  file: File;
  url: string;
}

@Component({
  selector: 'app-create-product',
  imports: [ReactiveFormsModule, ProductCardComponent],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css',
})
export class CreateProductComponent {
  private form = inject(FormBuilder);

  productGroup = this.form.group({
    name: [''],
    price: [''],
    description: [''],
    tagline: [''],
  });

  images = signal<ImageFile[]>([]);

  imagePlaceholder = 'https://placehold.co/400x400?text=Thumbnail+Here';
  productPreview: ProductModel = {
    created_at: new Date(),
    updated_at: new Date(),
    description: '',
    id: -1,
    name: 'Name',
    image_urls: [this.imagePlaceholder],
    price: 0.0,
    rating: 5,
    tagline: '',
  };

  constructor(private productService: ProductService) {
    effect(() => {
      // update product preview images
      const images = this.images();
      this.productPreview.image_urls = images.map((image) => image.url);

      if (this.productPreview.image_urls.length === 0)
        this.productPreview.image_urls.push(this.imagePlaceholder);
      console.log(images);
    });
  }

  ngOnInit() {
    this.productGroup.valueChanges.subscribe((val) => {
      this.productPreview = {
        ...this.productPreview,
        name: val.name ?? '',
        price: Number(val.price) ?? '',
        description: val.description ?? '',
        tagline: val.tagline ?? '',
      };
    });
  }

  onSubmit() {
    if (this.images().length === 0) {
      alert('insert at least one image');
      return;
    }

    if (this.productGroup.invalid) {
      alert('please fill all the input');
      return;
    }

    const { name, price, description, tagline } = this.productGroup.value;

    this.productService
      .createProduct(
        name!,
        Number(price),
        description!,
        tagline!,
        this.images().map((i) => i.file),
      )
      .subscribe({
        next: (value) => {
          console.log(value);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  fileChange(e: Event) {
    const input = e.target as HTMLInputElement;

    if (input.files === null) return;

    const url = URL.createObjectURL(input.files[0]);
    this.images.update((images) => [
      ...images,
      {
        url: url,
        file: input.files![0],
      },
    ]);
  }
}
