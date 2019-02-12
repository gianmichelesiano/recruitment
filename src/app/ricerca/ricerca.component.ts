import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MyDataService } from '../services/mydataservice';
import { Tipologia } from '../services/tipologia';
import { Categoria } from '../services/categoria';
import { Regione } from '../services/regioni';
import { Provincia } from '../services/provincia';
import {AppSettings} from '../appSettings';
import {MatSnackBar} from '@angular/material';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { map } from 'rxjs/operators';

import {ApiService} from '../api.service';
import { environment } from '../../environments/environment';

import { AngularFireDatabase } from '@angular/fire/database';

  


@Component({
  selector: 'app-ricerca',
  templateUrl: './ricerca.component.html',
  styleUrls: ['./ricerca.component.css']
})
export class RicercaComponent implements OnInit {

  formRicerca: boolean;
  nuovaRicerca: boolean
  moduloVisibile: boolean = true;
  positions: Observable<any[]>;

  constructor(public AP: ApiService, public db: AngularFireDatabase) {  }

  ngOnInit() {
    this.formRicerca = true
    this.nuovaRicerca = false
  }

  onSubmit(formData) {

    if(formData.valid){
      this.AP.searchPosition(formData.value.term);
      const promise = this.db.list(formData.value.term).remove();
      promise
        .then(_ => console.log('success'))
        .catch(err => console.log(err, 'Not possile to delete from firebase!'));

      this.positions = this.db.list(formData.value.term).valueChanges();
    }
    
    this.formRicerca  = false
    this.nuovaRicerca = true
  }

  newRicerca(){
    this.formRicerca  = true
    this.nuovaRicerca = false
  }
}
