import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
//import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';
import { SnackbarService } from '../snackbar.service';
import { UserService } from '../user.service';
import jwtDecode from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hide = true;
  loginForm:any = FormGroup;
  responseMessage:any;
  userRole:any;
  token:any;
  tokenPayload:any;
  
  constructor(private formBuilder:FormBuilder,
      private router:Router,
      private userService:UserService,
      private snackbarService:SnackbarService,
      public dialogRef:MatDialogRef<LoginComponent>,
      //private ngxService:NgxUiLoaderService,
    ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email:[null , Validators.required , Validators.pattern(GlobalConstants.emailRegex)],
      password:[null , Validators.required]
    })
  }


  handleSubmit(){
    //this.ngxService.start();
    var formDate = this.loginForm.value;
    var data = {
      email: formDate.email,
      password: formDate.password  
    }

    this.userService.login(data).subscribe((response:any)=>{
      debugger;
      //this.ngxService.stop();
      this.dialogRef.close();
      localStorage.setItem('token' , response.token);
      this.token = response.token;
      this.tokenPayload = jwtDecode(this.token);
      this.userRole = this.tokenPayload?.role;

      //alert("Successfully Login");
      if(this.userRole=='admin')
      this.router.navigate(['/cafe/dashboard']);
      else
      this.router.navigate(['/cafe/order']);

    },(error: { error: { message: any; }; })=>{
      //this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      alert(this.responseMessage +" " +GlobalConstants.error);
      this.snackbarService.openSnackBar(this.responseMessage , GlobalConstants.error);
    })

  }
}
