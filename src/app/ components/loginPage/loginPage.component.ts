import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatInputModule, RouterOutlet, MatButtonModule, FormsModule],
  templateUrl: './loginPage.component.html',
})
export class LoginPageComponent {
  title = 'frond-end';
  helloMessage = 'Hello World';
  username = '';
  password = '';

  onSubmit(form: NgForm) {
    console.log(form.value.username, form.value.password);
  }
}
