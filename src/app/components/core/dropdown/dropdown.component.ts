import { CommonModule, NgComponentOutlet } from '@angular/common';
import { Component, ContentChild, TemplateRef } from '@angular/core';
import { OutletContext } from '@angular/router';

@Component({
  selector: 'app-dropdown',
  imports: [CommonModule, NgComponentOutlet],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',
})
export class DropdownComponent {
  @ContentChild('toggler') togglerTemplate!: TemplateRef<any>;
}
