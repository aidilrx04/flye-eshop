import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProductComponent } from './edit-product.component';
import { ProductService } from '../../../services/product.service';
import { ProductModel } from '../../../models/product.model';
import { of } from 'rxjs';
import { ProductCategory } from '../../../enums/product-category';
import { provideRouter } from '@angular/router';

describe('EditProductComponent', () => {
  let component: EditProductComponent;
  let fixture: ComponentFixture<EditProductComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockLocation: jasmine.SpyObj<Location>;

  beforeEach(async () => {
    mockProductService = jasmine.createSpyObj('ProductService', [
      'getProduct',
      'updateProduct',
    ]);
    mockLocation = jasmine.createSpyObj('Location', ['back']);

    await TestBed.configureTestingModule({
      imports: [EditProductComponent],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: Location, useValue: mockLocation },
        provideRouter([]),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProductComponent);
    component = fixture.componentInstance;

    const mockProduct: ProductModel = {
      id: 1,
      name: 'Sample Product',
      price: 100.0,
      description: 'A sample description',
      tagline: 'Best in market',
      image_urls: ['https://example.com/image.jpg'],
      created_at: new Date(),
      updated_at: new Date(),
      sum_rating: 5,
      rating: {
        total_rating: 10,
        total_star: 50,
      },
      category: ProductCategory.MEN,
    };

    mockProductService.getProduct.and.returnValue(of(mockProduct));
    mockProductService.updateProduct.and.returnValue(
      of({ success: true } as any),
    );

    component.productId = mockProduct.id;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct product values', () => {
    component.product$.subscribe((product) => {
      expect(product.name).toBe('Sample Product');
      expect(product.price).toBe(100.0);
      expect(product.description).toBe('A sample description');
    });

    expect(component.productPreview.name).toBe('Sample Product');
    expect(component.productPreview.image_urls).toContain(
      'https://example.com/image.jpg',
    );
  });

  it('should update the product preview when form values change', () => {
    component.productGroup.controls.name.setValue('Updated Product');
    component.productGroup.controls.price.setValue('150');
    component.productGroup.controls.description.setValue('Updated description');
    component.productGroup.controls.tagline.setValue('Top Seller');

    expect(component.productPreview.name).toBe('Updated Product');
    expect(component.productPreview.price).toBe(150);
    expect(component.productPreview.description).toBe('Updated description');
    expect(component.productPreview.tagline).toBe('Top Seller');
  });

  it('should remove images and track removed ones', () => {
    component.removeImage(0);
    expect(component.removedImages().length).toBe(1);
    expect(component.images().length).toBe(0);
  });

  it('should set an image as the thumbnail', () => {
    component.images.set([
      { url: 'img1.jpg', type: 'EXISTING' },
      { url: 'img2.jpg', type: 'EXISTING' },
    ]);

    component.setAsThumbnail(1);

    expect(component.images()[0].url).toBe('img2.jpg');
    expect(component.images()[1].url).toBe('img1.jpg');
  });

  it('should add a new image from file input', () => {
    const mockFile = new File([], 'test.jpg');
    const event = {
      target: { files: [mockFile] },
    } as unknown as Event;

    component.fileChange(event);
    expect(component.images().length).toBe(2);
    expect(component.images()[1].file).toBe(mockFile);
  });

  it('should alert and prevent submission if the form is invalid', () => {
    spyOn(window, 'alert');
    component.productGroup.controls.name.setValue('');
    component.onSubmit();
    expect(window.alert).toHaveBeenCalledWith('Please complete the form');
  });

  it('should call updateProduct() with correct data', () => {
    spyOn(window, 'alert');
    component.images.set([
      { url: 'new.jpg', file: new File([], 'new.jpg'), type: 'NEW' },
    ]);

    component.productGroup.setValue({
      name: 'Updated Product',
      price: '200',
      description: 'Updated Description',
      tagline: 'New Tagline',
    });

    component.onSubmit();

    expect(mockProductService.updateProduct).toHaveBeenCalledWith(1, {
      name: 'Updated Product',
      price: 200,
      description: 'Updated Description',
      tagline: 'New Tagline',
      newImages: [],
      removedImages: [],
      newThumbnail: jasmine.any(File),
      setThumbnail: undefined,
    });
  });
});
