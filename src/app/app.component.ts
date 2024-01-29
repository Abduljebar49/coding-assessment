import { Component, OnInit } from "@angular/core";

import { ThemeService } from "./theme/theme.service";
import { Profile } from "./model/profile";
import { Message } from "./model/message";
import { Subject, takeUntil } from "rxjs";
import { AppService } from "./app.service";
import Swiper from "swiper";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "coding-assessment";
  currentSlide = 2;

  personId = 3;
  friendId = 4;
  messages: Message[] = [];
  profiles: Profile[] = [];



  private unsubscribe$ = new Subject<void>();
  constructor(
    public readonly themeService: ThemeService,
    private service: AppService
  ) {}

  ngOnInit(): void {
    this.themeService.init("dark");
    this.loadProfileMessages();

    this.service.onDataChanged().subscribe(() => {
      this.service.getPersonalChat(this.friendId).subscribe((ele) => {
        this.messages = ele;
      });
    });
    this.getProfiles();
  }

  ngAfterViewInit() {
    new Swiper(".mySwiper", {
      slidesPerView: "auto",
      spaceBetween: 10,
      freeMode: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  }

  loadProfileMessages() {
    this.service.getPersonalChat(this.friendId).subscribe((ele) => {
      this.messages = ele;
    });
  }

  getProfiles() {
    this.service.getProfileList().subscribe((data: Profile[]) => {
      this.profiles = data;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getPersonalChat(id: number) {
    return this.service.getPersonalChat(id).pipe(takeUntil(this.unsubscribe$));
  }


  profileSelected(profile: Profile, index: number) {
    this.friendId = profile.id;
    this.loadProfileMessages();
    this.changeSlide(index);
  }

  changeSlide(slideIndex: number) {
    this.currentSlide = slideIndex;
  }

  onProfileChange($event){
    if(this.friendId != $event){
      this.friendId = $event;
      this.loadProfileMessages();
    }
  }
}
