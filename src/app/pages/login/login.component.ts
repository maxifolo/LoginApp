import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { switchAll } from 'rxjs/Operators';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userlogin: UserModel;
  remindme = false;
  constructor(private auth: AuthService, private router: Router) {
    this.userlogin = new UserModel();
  }

  ngOnInit() {
    if (localStorage.getItem('email')) {
      this.userlogin.email = localStorage.getItem('email');
      this.remindme = true;
    }
  }
  login(form: NgForm) {
    if (form.invalid) { return; }

    Swal.fire({
      allowOutsideClick: false,
      text: 'Espere por favor...',
      icon: 'info'
    });
    Swal.showLoading();

    this.auth.login(this.userlogin).subscribe(response => {
      console.log(response);
      Swal.close();
      if (this.remindme) {
        localStorage.setItem('email', this.userlogin.email);
      }
      this.router.navigateByUrl('/home');
    }, err => {
      console.log(err.error.error.message);
      Swal.fire({
        text: err.error.error.message,
        icon: 'error',
        titleText: 'Error al Autenticar'
      });
    });
  }
}
