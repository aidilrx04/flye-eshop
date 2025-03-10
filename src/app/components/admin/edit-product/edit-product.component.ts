import {
  Component,
  computed,
  effect,
  inject,
  Input,
  signal,
} from '@angular/core';
import { ProductCardComponent } from '../../core/product-card/product-card.component';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ProductModel } from '../../../models/product.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ImageFileModel } from '../../../models/image-file.model';
import { ProductService } from '../../../services/product.service';
import { AsyncPipe, Location } from '@angular/common';

interface MixExistImageFile {
  file?: File;
  url: string;
  type: 'NEW' | 'EXISTING';
}

@Component({
  selector: 'app-edit-product',
  imports: [ProductCardComponent, ReactiveFormsModule, AsyncPipe],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css',
})
export class EditProductComponent {
  constructor(
    private productService: ProductService,
    private location: Location,
  ) {
    effect(() => {
      // if (typeof this.productPreview === 'undefined') return;
      // update product preview images
      const images = this.images();
      this.productPreview.image_urls = images.map((image) => image.url);

      if (this.productPreview.image_urls.length === 0)
        this.productPreview.image_urls.push(this.imagePlaceholder);
      console.log(images);
    });
  }
  private form = inject(FormBuilder);

  // product$! = this.productSubject.asObservable();
  product$!: Observable<ProductModel>;

  productGroup = this.form.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    tagline: ['', Validators.required],
  });

  images = signal<MixExistImageFile[]>([]);
  removedImages = signal<string[]>([]);

  imagePlaceholder = 'https://placehold.co/400x400?text=Thumbnail+Here';

  productPreview!: ProductModel;

  originalThumbnail!: string;

  ngOnInit() {
    this.productGroup.valueChanges.subscribe((v) => {
      this.productPreview = {
        ...this.productPreview,
        name: v.name ?? this.productPreview.name,
        price: Number(v.price) ?? this.productPreview.price,
        description: v.description ?? this.productPreview.description,
        tagline: v.tagline ?? this.productPreview.tagline,
      };
    });

    this.product$.subscribe((v) => {
      this.productGroup.setValue({
        name: v.name,
        description: v.description,
        price: v.price.toString(),
        tagline: v.tagline,
      });

      this.productPreview = v;
      this.images.update((images) =>
        v.image_urls.map((url) => ({
          type: 'EXISTING',
          url: url,
        })),
      );

      this.originalThumbnail = v.image_urls[0];
    });
  }

  @Input()
  set productId(productId: number) {
    this.product$ = this.productService.getProduct(productId);
  }

  removeImage(index: number) {
    const images = this.images();
    const imageFile = images[index];

    if (imageFile.type === 'EXISTING') {
      this.removedImages.update((v) => [...v, imageFile.url]);
      this.images.update((images) => [
        ...images.filter((imageFile, i) => i !== index),
      ]);

      return;
    }

    this.images.update((images) => images.filter((img, i) => i !== index));
  }
  setAsThumbnail(index: number) {
    const images = this.images();
    const imageFile = images[index];

    this.images.update((images) => [
      imageFile,
      ...images.filter((image, i) => i !== index),
    ]);
  }

  fileChange(e: Event) {
    const input = e.target as HTMLInputElement;

    if (input.files === null || input.files.length === 0) return;

    const file = input.files[0];
    this.images.update((images) => [
      ...images,
      {
        file: file,
        url: URL.createObjectURL(file),
        type: 'NEW',
      },
    ]);
  }

  goBack() {
    this.location.back();
  }

  onSubmit() {
    if (this.productGroup.invalid) {
      alert('Please complete the form');
      return;
    }

    const { name, price, description, tagline } = this.productGroup.value;
    const images = this.images();
    const removedImages = this.removedImages();
    let newImages = images
      .filter((image) => image.type === 'NEW')
      .map((image) => image.file!);
    let newThumbnail: File | undefined = undefined;
    let setThumbnail: string | undefined = undefined;
    if (images[0].url !== this.originalThumbnail) {
      newThumbnail = images[0].type === 'NEW' ? images[0].file! : undefined;
      setThumbnail = images[0].type === 'EXISTING' ? images[0].url : undefined;

      if (newThumbnail) {
        // remove from new images
        newImages = newImages.filter((images) => images !== newThumbnail);
      }
    }

    console.log('new images', newImages);
    console.log('removed images', removedImages);

    this.productService
      .updateProduct(this.productPreview.id, {
        name: name!,
        price: Number(price),
        description: description!,
        tagline: tagline!,
        newImages: newImages,
        removedImages: removedImages,
        newThumbnail,
        setThumbnail,
      })
      .subscribe({
        next: (value) => {
          console.log('product updated');
          console.log(value);
          // window.location.reload();
        },
        error: (err) => {
          console.log('Failed to update product');
          console.error(err);
        },
      });
  }
}
