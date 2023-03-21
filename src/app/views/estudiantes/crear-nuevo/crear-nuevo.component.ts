import {Component} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

@Component({
  selector: 'app-crear-nuevo',
  templateUrl: './crear-nuevo.component.html',
  styleUrls: ['./crear-nuevo.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
  ],
})
export class CrearNuevoComponent {
  firstFormGroup = this._formBuilder.group({
    id: ['', Validators.required],
    nombre1: ['', Validators.required],
    nombre2: ['', Validators.required],
    apellido1: ['', Validators.required],
    apellido2: ['', Validators.required],
    tel: ['', Validators.required],

  });
  secondFormGroup = this._formBuilder.group({
    id: ['', Validators.required],
    secondCtrl: ['', Validators.required],

  });

  constructor(private _formBuilder: FormBuilder) {}
}

