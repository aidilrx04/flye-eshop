import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProductComponent } from './create-product.component';
import { ProductService } from '../../../services/product.service';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('CreateProductComponent', () => {
  let component: CreateProductComponent;
  let fixture: ComponentFixture<CreateProductComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;

  beforeEach(async () => {
    mockProductService = jasmine.createSpyObj('ProductService', [
      'createProduct',
    ]);

    await TestBed.configureTestingModule({
      imports: [CreateProductComponent],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        provideRouter([]),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProductComponent);
    component = fixture.componentInstance;

    mockProductService.createProduct.and.returnValue(
      of({ success: true } as any),
    );

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default product preview values', () => {
    expect(component.productPreview.name).toBe('Name');
    expect(component.productPreview.image_urls).toContain(
      component.imagePlaceholder,
    );
    expect(component.productPreview.price).toBe(0.0);
  });

  it('should update product preview when form values change', () => {
    component.productGroup.controls.name.setValue('Test Product');
    component.productGroup.controls.price.setValue('50');
    component.productGroup.controls.description.setValue('A great product');
    component.productGroup.controls.tagline.setValue('Best in class');

    expect(component.productPreview.name).toBe('Test Product');
    expect(component.productPreview.price).toBe(50);
    expect(component.productPreview.description).toBe('A great product');
    expect(component.productPreview.tagline).toBe('Best in class');
  });

  it('should alert if no images are added when submitting', () => {
    spyOn(window, 'alert');
    component.onSubmit();
    expect(window.alert).toHaveBeenCalledWith('insert at least one image');
  });

  it('should alert if form is invalid when submitting', () => {
    spyOn(window, 'alert');
    component.images.set([{ url: 'test.jpg', file: new File([], 'test.jpg') }]);
    component.onSubmit();
    expect(window.alert).toHaveBeenCalledWith('please fill all the input');
  });

  it('should call createProduct() with correct data', () => {
    spyOn(window, 'alert');
    component.images.set([{ url: 'test.jpg', file: new File([], 'test.jpg') }]);

    component.productGroup.setValue({
      name: 'New Product',
      price: '100',
      description: 'Test Description',
      tagline: 'Tagline Here',
    });

    component.onSubmit();

    expect(mockProductService.createProduct).toHaveBeenCalledWith(
      'New Product',
      100,
      'Test Description',
      'Tagline Here',
      jasmine.any(Array),
    );
  });

  it('should add an image on file change', () => {
    const mockFile = new File([], 'test.jpg');
    const event = {
      target: { files: [mockFile] },
    } as unknown as Event;

    component.fileChange(event);
    expect(component.images().length).toBe(1);
    expect(component.images()[0].file).toBe(mockFile);
  });

  it('should remove an image correctly', () => {
    component.images.set([{ url: 'test.jpg', file: new File([], 'test.jpg') }]);
    component.removeImage(0);
    expect(component.images().length).toBe(0);
  });

  it('should set an image as the thumbnail', () => {
    component.images.set([
      { url: 'img1.jpg', file: new File([], 'img1.jpg') },
      { url: 'img2.jpg', file: new File([], 'img2.jpg') },
    ]);

    component.setAsThumbnail(1);

    expect(component.images()[0].url).toBe('img2.jpg');
    expect(component.images()[1].url).toBe('img1.jpg');
  });
});
