import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, of } from "rxjs";
import { UserChat } from "./model/user-chat";
import { Message } from "./model/message";
import { Profile } from "./model/profile";

@Injectable({
  providedIn: "root",
})
export class AppService {
  constructor(private http: HttpClient) {}
  loggedInPersonId = 3;
  private dataChangedSubject = new Subject<void>();

  getPersonalChat(id: number) {
    return of(
      this.userChatHistory.messages.filter(
        (ele) =>
          (ele.sender == this.userChatHistory.id && ele.receiver == id) ||
          (ele.sender == id && ele.receiver == this.userChatHistory.id)
      )
    );
  }

  getProfileList() {
    return of(this.friendProfiles);
  }

  sendMessage(msg: Message): void {
    this.userChatHistory.messages.push(msg);
    this.notifyDataChanged();
  }

  private notifyDataChanged(): void {
    this.dataChangedSubject.next();
  }

  onDataChanged(): Observable<void> {
    return this.dataChangedSubject.asObservable();
  }

  getFriends(){
    return of(this.userChatHistory.friends)
  }

  friendProfiles: Profile[] = [
    {
      id: 1,
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVA_HrQLjkHiJ2Ag5RGuwbFeDKRLfldnDasw&usqp=CAU",
    },
    {
      id: 2,
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQix0aJcHrZfDqlr0N-xaLne6C5Il5-57DIUw&usqp=CAU",
    },
    {
      id: 4,
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCczoMDFIc77qVeqtnJ26h8Yen0WXNfyLTIg&usqp=CAU",
    },
    {
      id: 5,
      imageUrl: "https://bike.dabbalstock.com/photos/photo-1702197640276.jpg",
    },
    {
      id: 6,
      imageUrl: "https://bike.dabbalstock.com/photos/photo-1702197640276.jpg",
    },
  ];

  userChatHistory: UserChat = {
    id: 3,
    name: "User1",
    friends: [1, 2, 4, 5, 6],
    messages: [
      {
        sender: 4,
        receiver: 3,
        type: "text",
        message: `Hi Jake, how are you? I saw on the app that we've crossed paths several times this week 😊`,
      },
      {
        sender: 3,
        receiver: 4,
        type: "text",
        message: `Haha truly! Nice to meet you Grace! What about a cup of coffee today evening? ☕️`,
      },
    ],
  };
}
