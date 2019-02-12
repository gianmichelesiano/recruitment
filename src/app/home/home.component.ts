import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireDatabase , AngularFireObject} from 'angularfire2/database';

import 'rxjs/add/observable/of';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private db: AngularFireDatabase, private router: Router) { }

  ngOnInit() {

      this.db.object('/').snapshotChanges().subscribe(action => {
        console.log(action.type);

        for (let key in action.payload.val()) {
            console.log(key)
            // Use `key` and `value`
        }
        console.log(action.payload.val())
      });
    
 }
}


