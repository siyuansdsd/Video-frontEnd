import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  selector: 'app-verify-email',
  templateUrl: './emailVerify.component.html',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
})
export class EmailVerifyComponent implements AfterViewInit {
  verificationStatus = '';
  countdown = 5;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    const emailToken = this.route.snapshot.paramMap.get('token');
    if (emailToken) {
      this.verifyEmail(emailToken);
    } else {
      this.verificationStatus = 'Invalid token';
      this.isLoading = false;
    }
  }

  verifyEmail(token: string) {
    this.http
      .get(`http://localhost:3456/api/v1/auth/email/${token}`)
      .subscribe({
        next: () => {
          this.verificationStatus = 'Email verified';
          this.isLoading = false;
          this.startCountdown();
        },
        error: () => {
          this.verificationStatus = 'Verification failed';
          this.isLoading = false;
        },
      });
  }

  startCountdown() {
    const interval = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        clearInterval(interval);
        this.router.navigate(['/login']);
      }
    }, 1000);
  }

  retry() {
    this.isLoading = true;
    this.verificationStatus = '';
    this.countdown = 5;
    const emailToken = this.route.snapshot.paramMap.get('token');
    if (emailToken) {
      this.verifyEmail(emailToken);
    } else {
      this.verificationStatus = 'Invalid token';
      this.isLoading = false;
    }
  }
}
