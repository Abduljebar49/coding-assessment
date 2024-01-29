import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { Message } from "../model/message";
import { ThemeService } from "../theme/theme.service";
import { Subject } from "rxjs";
import { AppService } from "../app.service";
import Swiper from "swiper";
import { Profile } from "../model/profile";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: "app-message-body",
  templateUrl: "./message-body.component.html",
  styleUrls: ["./message-body.component.scss"],
})
export class MessageBodyComponent implements AfterViewInit, OnChanges {
  @ViewChild("swiperContainer", { static: false }) swiperContainer: ElementRef;
  @Output() profileChange = new EventEmitter<number>();
  @Input() slideIndex: number;
  @Input() messages: Message[] = [];
  @Input() profiles: Profile[] = [];
  @Input() personId = 3;
  @Input() friendId = 4;

  private slideChangeSubject = new Subject<number>();
  private slideChangeSubscription;
  swiper: Swiper;

  message: string = "";
  selectedFile: File | null = null;
  filePreviewUrl: string | null = null;
  isImageFile: boolean = false;

  constructor(
    public readonly themeService: ThemeService,
    private service: AppService
  ) {}

  ngAfterViewInit() {
    this.swiper = new Swiper(this.swiperContainer.nativeElement, {
      loop: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      slidesPerView: "auto",
      centeredSlides: true,
      spaceBetween: 4,
      on: {
        slideChange: () => this.onSlideChange(),
      },
    });

    if (this.slideIndex != null) {
      this.swiper.slideToLoop(this.slideIndex);
    }

    this.slideChangeSubscription = this.slideChangeSubject
      .pipe(debounceTime(10))
      .subscribe((activeIndex) => {
        const activeProfileId = this.profiles[activeIndex];
        this.profileChange.emit(activeProfileId.id);
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.slideIndex && this.swiper) {
      this.swiper.slideTo(changes.slideIndex.currentValue);
    }
    this.showEmojiPicker = false;
  }

  ngOnDestroy() {
    if (this.slideChangeSubscription) {
      this.slideChangeSubscription.unsubscribe();
    }
  }

  onSlideChange() {
    if (this.swiper) {
      this.slideChangeSubject.next(this.swiper.realIndex);
    }
  }

  showEmojiPicker = false;

  messageChanges($event: any) {
    this.message = $event;
  }

  addEmoji(event: any) {
    this.message += event.emoji.native;
  }

  toggleEmojiPicker() {
    console.log("toggleImoji : ",this.showEmojiPicker)
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  sendMessage() {
    let msgTemp: Message | undefined;
    if (this.selectedFile && this.selectedFile.type.includes("image")) {
      msgTemp = {
        sender: this.personId,
        type: "image",
        message: this.message,
        fileUrl: this.filePreviewUrl!,
        receiver: this.friendId,
      };
    } else {
      msgTemp = {
        sender: this.personId,
        type: "text",
        message: this.message,
        receiver: this.friendId,
      };
    }
    if (msgTemp) {
      this.service.sendMessage(msgTemp);
      this.clearInputForm();
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.isImageFile = file.type.startsWith("image/");
      if (this.isImageFile) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.filePreviewUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
  }

  slideTo(index: number) {
    this.swiper.slideToLoop(index);
  }

  clearFile() {
    this.selectedFile = null;
    this.filePreviewUrl = null;
  }

  clearInputForm() {
    this.clearFile();
    this.isImageFile = false;
    this.message = "";
  }
}
