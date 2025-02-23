import { Component, ElementRef, ViewChild, AfterViewInit, forwardRef, Input, OnChanges, SimpleChanges, TemplateRef } from '@angular/core';
import SignaturePad from 'signature_pad';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconName, NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pngx-signature-pad',
  templateUrl: './signature-pad.component.html',
  styleUrls: ['./signature-pad.component.scss'],
  imports: [NgxBootstrapIconsModule, NgbPopoverModule, CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SignaturePadComponent),
      multi: true
    }
  ]
})
export class SignaturePadComponent implements AfterViewInit, ControlValueAccessor, OnChanges {
  @ViewChild('canvas') canvasRef: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;

  @Input() title: string = "Signature Pad"; // Default value
  @Input() icon: IconName = "vector-pen"; // Default value
  @Input() dotSize: number = 2; // Default value
  @Input() minWidth: number = 0.5; // Default value
  @Input() maxWidth: number = 2.5; // Default value
  @Input() throttle: number = 16; // Default value (ms) for throttling
  @Input() minDistance: number = 5; // Default value (pixels) for minDistance
  @Input() backgroundColor: string = 'rgba(0,0,0,0)'; // Default transparent background
  @Input() penColor: string = 'black'; // Default black pen
  @Input() velocityFilterWeight: number = 0.7; // Default value
  @Input() canvasContextOptions: CanvasRenderingContext2DSettings = {}; // Default options


  private signaturePad: SignaturePad;
  private onChange: (value: string) => void = () => { };
  private onTouched: () => void;

  constructor() {

  }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;

    // Set up the signature pad options including throttle, minDistance, and backgroundColor
    const options = {
      dotSize: this.dotSize,
      minWidth: this.minWidth,
      maxWidth: this.maxWidth,
      throttle: this.throttle, // Throttle option for drawing
      minDistance: this.minDistance, // Minimum distance between points
      backgroundColor: this.backgroundColor, // Background color option
      penColor: this.penColor,
      velocityFilterWeight: this.velocityFilterWeight,
      canvasContextOptions: this.canvasContextOptions
    };

    this.signaturePad = new SignaturePad(canvas, options);
    this.resizeCanvas();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.signaturePad) {
      const options = {
        dotSize: this.dotSize,
        minWidth: this.minWidth,
        maxWidth: this.maxWidth,
        throttle: this.throttle,
        minDistance: this.minDistance,
        backgroundColor: this.backgroundColor,
        penColor: this.penColor,
        velocityFilterWeight: this.velocityFilterWeight,
        canvasContextOptions: this.canvasContextOptions
      };

      this.signaturePad.clear();
      this.signaturePad = new SignaturePad(this.canvasRef.nativeElement, options);
    }
  }

  clearSignature(): void {
    this.signaturePad.clear();
    this.onChange!('');
  }

  saveSignature(): void {
    const signature = this.signaturePad.toDataURL();
    this.onChange!(signature);
  }

  writeValue(value: string): void {
    if (value) {
      const img = new Image();
      img.src = value;
      img.onload = () => {
        const canvas = this.canvasRef.nativeElement;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);
      };
    } else {
      this.signaturePad.clear();
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.signaturePad.off();
    } else {
      this.signaturePad.on();
    }
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext('2d').scale(ratio, ratio);
    this.signaturePad.clear();
  }

  // Handle file upload (PNG)
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (file && file.type === 'image/png') {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const img = new Image();
        img.src = e.target?.result as string;

        img.onload = () => {
          const canvas = this.canvasRef.nativeElement;
          const context = canvas.getContext('2d');
          context.clearRect(0, 0, canvas.width, canvas.height); // Clear any previous drawing
          context.drawImage(img, 0, 0); // Draw the uploaded image
        };
      };

      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid PNG file.');
    }
  }
}
