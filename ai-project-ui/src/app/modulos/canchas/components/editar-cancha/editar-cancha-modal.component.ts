import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from "@angular/core";
import { AppButtonComponent } from '../../../../components/buttons/button.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CanchaDto } from "../../models/models";
import { CanchasService } from "../../canchas.service";
import { ButtonWithId } from "../../../../components/buttons/button.interfaces";

@Component({
    selector: 'app-editar-cancha-modal',
    templateUrl: './editar-cancha-modal.component.html',
    styleUrl: './editar-cancha-modal.component.scss',
    standalone: true,
    imports: [AppButtonComponent, CommonModule, FormsModule],
})
export class EditarCanchaModalComponent implements OnChanges {
  @Input() show = false;
  @Input() cancha: CanchaDto | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{ id: number, tipoSuelo: number }>();
  @Output() cancel = new EventEmitter<void>();

  form = { id: null as number | null, tipoSuelo: null as number | null };
  tipoSuelos = [
    { value: 1, label: 'Polvo de Ladrillo' },
    { value: 2, label: 'Hormigón' },
    { value: 3, label: 'Césped' },
  ];

  protected closeModalButton: ButtonWithId = {
    id: 'close',
    label: '',
    icon: 'fa fa-times',
    kind: 'secondary',
    type: 'button'
  };

  constructor(private readonly service: CanchasService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['cancha'] && this.cancha) {
      this.form = { id: this.cancha.id, tipoSuelo: this.cancha.tipoSuelo };
    }
  }

  onClose() { this.close.emit(); }
  onCancel() { this.cancel.emit(); }
  onSave(formRef: any) {
    if (this.form.id && this.form.tipoSuelo) {
      this.save.emit({ id: this.form.id, tipoSuelo: this.form.tipoSuelo });
    }
  }
}