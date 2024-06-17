import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { VideoService } from '../../../services/video/video.service';
import { AlertService } from '../../../services/alert/alert.service';

@Component({
  standalone: true,
  selector: 'app-video-upload',
  templateUrl: './videoUpload.component.html',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
})
export class VideoUploadComponent {
  videoSrc: string | ArrayBuffer | null = null;
  @ViewChild('fileInput') fileInput!: ElementRef;
  uploadForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private videoService: VideoService,
    private alertService: AlertService
  ) {
    this.uploadForm = this.fb.group({
      title: [''],
      description: [''],
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) this.videoSrc = e.target.result;
        this.uploadForm.patchValue({ title: file.name });
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  async uploadVideo() {
    const formData = this.uploadForm.value;
    const video = this.fileInput.nativeElement.files?.[0];
    const title = formData.title;
    const description = formData.description;
    (await this.videoService.uploadVideo(video, title, description)).subscribe({
      next: () => {
        this.alertService.showSuccess('Video uploaded successfully');
      },
      error: (err) => {
        this.alertService.showError(err.error.message);
      },
    });
  }
}
