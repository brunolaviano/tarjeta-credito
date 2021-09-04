import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TarjetaService } from 'src/app/services/tarjeta.service';

@Component({
  selector: 'app-tarjeta-credito',
  templateUrl: './tarjeta-credito.component.html',
  styleUrls: ['./tarjeta-credito.component.css']
})
export class TarjetaCreditoComponent implements OnInit {
  listTarjetas: any[] = [];
  accion = 'Agregar';
  id : number | undefined;
  form: FormGroup;

  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private _tarjetaService: TarjetaService) {
    this.form = this.fb.group({
      titular: ['', Validators.required],
      numeroTarjeta: ['', [Validators.required, Validators.maxLength(16), Validators.minLength(16)]],
      fechaExpiracion: ['', [Validators.required, Validators.maxLength(5), Validators.minLength(5)]],
      cvv: ['', [Validators.required, Validators.maxLength(3), Validators.minLength(3)]]
    })
  }

  ngOnInit(): void {
    this.obtenerTarjeta();
  }

  obtenerTarjeta() {
    this._tarjetaService.getListTarjetas().subscribe( data => {
      console.log(data);
      this.listTarjetas = data;
    }, error => {
      console.log(error);
    })
  }

  guardarTarjeta() {
    const tarjeta: any = {
      titular: this.form.get('titular')?.value,
      numeroTarjeta: this.form.get('numeroTarjeta')?.value,
      fechaExpiracion: this.form.get('fechaExpiracion')?.value,
      cvv: this.form.get('cvv')?.value
    }

    if (this.id == undefined){
      //Agregamos una nueva tarjeta
      this._tarjetaService.saveTarjeta(tarjeta).subscribe(data => {
        this.toastr.success('La Tarjeta fue registrada con Exito', 'Tarjeta Registrada!');
        this.obtenerTarjeta();
        this.form.reset();
      }, error => {
        this.toastr.error('Opps.. ocurrio un Error', 'Error al Guardar Tarjeta');
        console.log(error);
      })
    }else{
      tarjeta.id = this.id;
      //Editamos una tarjeta
      this._tarjetaService.updateTarjeta(this.id, tarjeta).subscribe(data =>{
        this.form.reset();
        this.accion = 'Agregar';
        this.id = undefined;
        this.toastr.info('La Tarjeta fue actualizada con Exito', 'Tarjeta Actualizada');
        this.obtenerTarjeta();
      }, error => {
        this.toastr.error('Opps.. ocurrio un Error', 'Error al Actualizar Tarjeta');
        console.log(error);
      })
    }

  }

  eliminarTarjeta(id: number) {
    this._tarjetaService.deteleTarjeta(id).subscribe(data => {
      this.toastr.error('La Tarjeta fue eliminada con Exito', 'Tarjeta Eliminada!');
      this.obtenerTarjeta();
    }, error => {
      console.log(error);
    })
  }

  editarTarjeta(tarjeta: any){
    this.accion = 'Editar';
    this.id = tarjeta.id;

    this.form.patchValue({
      titular: tarjeta.titular,
      numeroTarjeta: tarjeta.numeroTarjeta,
      fechaExpiracion: tarjeta.fechaExpiracion,
      cvv: tarjeta.cvv
    })
  }



}
