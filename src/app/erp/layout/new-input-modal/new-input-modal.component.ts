import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../../service/modal/modal.service';

@Component({
  selector: 'app-new-input-modal',
  templateUrl: './new-input-modal.component.html',
  styleUrl: './new-input-modal.component.css'
})
export class NewInputModalComponent {
 @Input() initialData: any;
  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
    constructor(private modalService: ModalService) {}

  goToProveedor() {
    this.modalService.changeView('proveedor');
  }
 
}
