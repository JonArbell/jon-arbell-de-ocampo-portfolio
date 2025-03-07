import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactMeService } from '../../service/contact-me/contact-me.service';

@Component({
  selector: 'app-contact-me',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './contact-me.component.html'
})
export class ContactMeComponent {

  constructor(
    private contactMe : ContactMeService
  ) {}

  contactMeForm : FormGroup = new FormGroup ({
    fullName : new FormControl("",[Validators.required,Validators.minLength(5)]),
    email : new FormControl("",[Validators.required,Validators.email]),
    message : new FormControl("",[Validators.required,Validators.minLength(10),Validators.maxLength(500)])
  });

  public hasErrors(): boolean {
    return (this.contactMeForm.controls['fullName'].touched && !!this.contactMeForm.controls['fullName'].errors) ||
    (this.contactMeForm.controls['email'].touched && !!this.contactMeForm.controls['email'].errors) ||
    (this.contactMeForm.controls['message'].touched && !!this.contactMeForm.controls['message'].errors);
  }
  

  isSubmit : boolean = false;

  hostedUrl : string = "https://jon-arbell-de-ocampo-portfolio-backend.onrender.com/api/email-inquiry";
  localUrl : string = "http://localhost:8080/api/email-inquiry";

  onSubmit() : void {

    if(this.contactMeForm.valid){
      const contactMeValue = this.contactMeForm.value;

      this.contactMe.sendEmail(contactMeValue)
      .subscribe({
        next : (result : any) =>{
          this.isSubmit = true;

          setTimeout(()=>{

            const message = document.querySelector("#final-message");

            if(message){
              message.innerHTML = 'Your message is on its way! Thank you for reaching out.';
              message.classList.add('text-blue-800');
            }
            setTimeout(()=>{
              if(message){
                message.classList.add('opacity-0');
              }
              
            },4000);
            
          },50);

          setTimeout(()=>{
            this.isSubmit = false;
          },4125);

          console.log(result);

        },
        error : (err :any)=>{

          this.isSubmit = true;

          setTimeout(()=>{

            const message = document.querySelector("#final-message");
            const test = 'Oops! Something went wrong while sending your message. Please check your internet connection or try again later.';
            if(message){

              if(err.key !== 'exception')
                message.innerHTML = `${err.json().error}`;
              else 
                message.innerHTML = test;

              message.classList.add('text-orange-700');
            }
            setTimeout(()=>{
              if(message){
                message.classList.add('opacity-0');
              }
              
            },4000);
            
          },50);

          setTimeout(()=>{
            this.isSubmit = false;
          },4125);

          console.error(err);
        },
        complete : ()=>{
          console.log('Request completed');
        }
      });

      this.contactMeForm.reset();
    }
  }
}
