import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl ,FormBuilder ,Validators, AbstractControl, ValidatorFn  } from '@angular/forms';

import { Customer } from './customer';

function ratingRange(min: number, max: number): ValidatorFn{
  return (c: AbstractControl): { [key: string]: boolean} | null => {
    if(c.value !==null && (isNaN(c.value) || c.value < min || c.value > max))  {
      return {'range': true};
    }
     return null
    }
}

function emailMatcher  (c: AbstractControl): { [key: string]: boolean} | null  {
    const emailControl = c.get('email');
    const confirmControl = c.get('confirmemail');

    if(emailControl.pristine || confirmControl.pristine){

      return null;
    }

    if(emailControl.value === confirmControl.value){

      return null;
    }

    return {'match': true}

}




@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customer = new Customer();
  customerForm: FormGroup;
  emailMessage: string;

  private validationMessages = {
    required: 'Please enter your email address',
    email: 'Please enter a valid email address'
  }



  constructor(private fb:FormBuilder) { }

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName:  ['',[Validators.required, Validators.maxLength(50)]],
      emailGroup: this.fb.group({
        email: ['',[Validators.required, Validators.email]],
        confirmemail: ['',[Validators.required]]
      },{validators: emailMatcher}),
      sendCatalog: false,
      phone:'',
      notification:'email',
      rating: [null, ratingRange(1,8)]
    })

    this.customerForm.get('notification').valueChanges.subscribe(
      value => this.setNotification(value)
    );


    const emailControl = this.customerForm.get('emailGroup.email');
    emailControl.valueChanges.subscribe(
      value=> this.setMessage(emailControl)
    )


    // this.customerForm.setValue({
    //   firstName: 'shivam',
    //   lastName: 'gupta',
    //   email: 'shivamgupta000@gmail.com',
    //   sendCatalog: false
    // })
  }

  save(): void {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }

  setMessage(c: AbstractControl): void {
    this.emailMessage = '';
    if((c.touched || c.dirty) && c.errors){
      this.emailMessage = Object.keys(c.errors).map(
        key=>this.validationMessages[key]).join('');
    }
  }


  setNotification(notifyVia: string){
    const phoneControl = this.customerForm.get('phone');
    if(notifyVia === "text"){
      phoneControl.setValidators(Validators.required)
    }
    else
    phoneControl.clearValidators();

    phoneControl.updateValueAndValidity();
  }
}
