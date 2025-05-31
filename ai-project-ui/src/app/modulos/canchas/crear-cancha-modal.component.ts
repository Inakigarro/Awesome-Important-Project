import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppButtonComponent } from '../../components/buttons/button.component';

@Component({
  selector: 'app-crear-cancha-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, AppButtonComponent],
  templateUrl: './crear-cancha-modal.component.html',
  styleUrls: ['./crear-cancha-modal.component.scss']
})
export class CrearCanchaModalComponent {
  @Input() show = false;
  @Input() tipoSuelos: { value: number; label: string }[] = [];
  @Input() form = { tipoSuelo: null as number | null };
  @Output() close = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<{ tipoSuelo: number }>();

  onClose() {
    this.close.emit();
  }

  onCancel() {
    this.cancel.emit();
  }

  onSave(formRef: any) {
    if (this.form.tipoSuelo) {
      this.save.emit({ tipoSuelo: this.form.tipoSuelo });
    }
  }
}
