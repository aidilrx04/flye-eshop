import { CommonModule, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  ContentChild,
  HostListener,
  input,
  signal,
  TemplateRef,
} from '@angular/core';

@Component({
  selector: 'app-carousel',
  imports: [NgTemplateOutlet, CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css',
})
export class CarouselComponent {
  values = input.required<any[]>();
  itemPerPage = signal(3);
  page = signal(0);
  totalPage = computed(() =>
    Math.ceil(this.values().length / this.itemPerPage()),
  );
  totalPageData = computed(() => new Array(this.totalPage()).fill(null));

  pageData = computed(() => {
    const startIndex = this.page() * this.itemPerPage();
    const endIndex = startIndex + this.itemPerPage();

    const window = this.values().slice(startIndex, endIndex);

    const shouldFill = this.itemPerPage() - window.length;

    const filledWindow = [...window, ...new Array(shouldFill)];
    return filledWindow;
  });

  @ContentChild('itemTemplate', { read: TemplateRef }) template:
    | TemplateRef<any>
    | undefined;

  pageConstraints = {
    0: 1,
    640: 2,
    964: 3,
  };

  ngOnInit() {
    for (const entry of Object.entries(this.pageConstraints)) {
      if (window.screen.width > Number(entry[0])) {
        this.itemPerPage.set(entry[1]);
      }
    }
  }

  ngOnChanges() {}

  nextPage() {
    this.page.update((page) => {
      if (page + 1 > this.totalPage() - 1) return 0;

      return page + 1;
    });
  }

  prevPage() {
    this.page.update((page) => {
      if (page - 1 < 0) return this.totalPage() - 1;

      return page - 1;
    });
  }

  setPage(page: number) {
    this.page.set(page);
  }

  @HostListener('window:resize', ['$event'])
  private onResize(e: Event) {
    for (const entry of Object.entries(this.pageConstraints)) {
      console.log(window.screen.width);
      if (window.screen.width > Number(entry[0])) {
        this.itemPerPage.set(entry[1]);
      }
    }
  }
}
