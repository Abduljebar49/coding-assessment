import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { Observable, of } from "rxjs";

import { AppComponent } from "./app.component";
import { EssentialsModule } from "./modules/essentials/essentials.module";
import { THEMES_LIST } from "./theme/symbols";
import { ThemeModule } from "./theme/theme.module";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { MessageBodyComponent } from "./message-body/message-body.component";
import { PickerModule } from '@ctrl/ngx-emoji-mart';

@NgModule({
  declarations: [AppComponent, MessageBodyComponent],
  imports: [
    BrowserModule,
    ThemeModule.forRoot({
      themes: THEMES_LIST,
      active: {
        useFactory: () => of("dark") as Observable<string>,
      },
    }),
    EssentialsModule,
    FormsModule,
    HttpClientModule,
    PickerModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
