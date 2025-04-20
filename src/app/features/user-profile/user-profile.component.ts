import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user = {
    name: '',
    email: ''
  };

  message = '';
  messageClass = '';
  loading = false;
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUserProfile();
  }

  fetchUserProfile(): void {
    this.loading = true;
    this.http.get<{name: string, email: string}>(`${this.apiUrl}/user-profile`, {
      withCredentials: true
    }).subscribe({
      next: (data) => {
        this.user = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching user profile', error);
        this.message = 'Failed to load user profile';
        this.messageClass = 'error';
        this.loading = false;
      }
    });
  }

  updateProfile(): void {
    this.loading = true;
    this.message = '';

    // The CSRF token will be automatically added by our interceptor
    this.http.post<{success: boolean, message: string}>(
      `${this.apiUrl}/update-profile`,
      this.user,
      { withCredentials: true }
    ).subscribe({
      next: (response) => {
        this.message = response.message;
        this.messageClass = 'success';
        this.loading = false;
      },
      error: (error) => {
        this.message = error.error?.message || 'Failed to update profile';
        this.messageClass = 'error';
        this.loading = false;
      }
    });
  }
}
