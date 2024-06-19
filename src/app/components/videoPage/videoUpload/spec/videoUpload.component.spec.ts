import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { VideoUploadComponent } from '../videoUpload.component';
import { VideoService } from '../../../../services/video/video.service';
import { AlertService } from '../../../../services/alert/alert.service';
import { of } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('VideoUploadComponent', () => {
  let component: VideoUploadComponent;
  let fixture: ComponentFixture<VideoUploadComponent>;
  let videoService: jasmine.SpyObj<VideoService>;
  let alertService: jasmine.SpyObj<AlertService>;

  beforeEach(waitForAsync(() => {
    const videoServiceSpy = jasmine.createSpyObj('VideoService', [
      'uploadVideo',
    ]);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', [
      'showSuccess',
      'showError',
    ]);

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        VideoUploadComponent,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: VideoService, useValue: videoServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
      ],
    }).compileComponents();

    videoService = TestBed.inject(VideoService) as jasmine.SpyObj<VideoService>;
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select a file', (done) => {
    const file = new File([''], 'test.mp4', { type: 'video/mp4' });
    const event = { target: { files: [file] } } as unknown as Event;

    const mockFileReader = {
      result: 'data:video/mp4;base64,',
      readAsDataURL: function (this: FileReader) {
        if (this.onload) {
          this.onload({
            target: { result: this.result },
          } as ProgressEvent<FileReader>);
        }
      },
      onload: null as unknown as (
        this: FileReader,
        ev: ProgressEvent<FileReader>
      ) => unknown,
    } as Partial<FileReader> as FileReader;

    spyOn(window, 'FileReader').and.returnValue(mockFileReader);

    component.onFileSelected(event);

    setTimeout(() => {
      fixture.detectChanges();

      expect(component.videoSrc).toBeDefined();
      expect(component.videoSrc).toBe(mockFileReader.result);
      expect(component.fileSize).toBe(file.size);
      expect(component.uploadForm.get('title')?.value).toBe(file.name);
      done();
    }, 0);
  });

  it('should trigger file input', () => {
    spyOn(component.fileInput.nativeElement, 'click');
    component.triggerFileInput();
    expect(component.fileInput.nativeElement.click).toHaveBeenCalled();
  });

  it('should upload video successfully', async () => {
    const file = new File([''], 'test.mp4', { type: 'video/mp4' });
    const event = { target: { files: [file] } } as unknown as Event;

    const mockFileReader = {
      result: 'data:video/mp4;base64,',
      readAsDataURL: function (this: FileReader) {
        if (this.onload) {
          this.onload({
            target: { result: this.result },
          } as ProgressEvent<FileReader>);
        }
      },
      onload: null as unknown as (
        this: FileReader,
        ev: ProgressEvent<FileReader>
      ) => unknown,
    } as Partial<FileReader> as FileReader;

    spyOn(window, 'FileReader').and.returnValue(mockFileReader);

    component.onFileSelected(event);

    component.uploadForm.setValue({
      title: 'Test Title',
      description: 'Test Description',
    });
    videoService.uploadVideo.and.returnValue(Promise.resolve(of({})));

    await component.uploadVideo();
    fixture.detectChanges();

    setTimeout(() => {
      expect(alertService.showSuccess).toHaveBeenCalledWith(
        'Video uploaded successfully'
      );
      expect(component.isLoading).toBeFalse();
      expect(component.videoSrc).toBeNull();
      expect(component.fileSize).toBe(0);
      expect(component.uploadForm.get('title')?.value).toBe('');
      expect(component.uploadForm.get('description')?.value).toBe('');
    }, 100);
  });

  it('should show error if upload fails', async () => {
    const file = new File([''], 'test.mp4', { type: 'video/mp4' });
    const event = { target: { files: [file] } } as unknown as Event;

    const mockFileReader = {
      result: 'data:video/mp4;base64,',
      readAsDataURL: function (this: FileReader) {
        if (this.onload) {
          this.onload({
            target: { result: this.result },
          } as ProgressEvent<FileReader>);
        }
      },
      onload: null as unknown as (
        this: FileReader,
        ev: ProgressEvent<FileReader>
      ) => unknown,
    } as Partial<FileReader> as FileReader;

    spyOn(window, 'FileReader').and.returnValue(mockFileReader);

    component.onFileSelected(event);

    component.uploadForm.setValue({
      title: 'Test Title',
      description: 'Test Description',
    });
    videoService.uploadVideo.and.returnValue(
      Promise.reject({ error: { message: 'Upload failed' } })
    );

    await component.uploadVideo();
    fixture.detectChanges();

    setTimeout(() => {
      expect(alertService.showError).toHaveBeenCalledWith('Upload failed');
      expect(component.isLoading).toBeFalse();
    }, 100);
  });

  it('should show error if form is invalid', async () => {
    component.uploadForm.setValue({ title: '', description: '' });
    component.fileInput.nativeElement.files = null;

    await component.uploadVideo();
    fixture.detectChanges();

    expect(alertService.showError).toHaveBeenCalledWith(
      'Please fill in all fields and select a video.'
    );
    expect(component.isLoading).toBeFalse();
  });
});
