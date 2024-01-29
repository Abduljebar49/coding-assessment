import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import {
  ButtonsModule,
  ImageCardModule,
  CircleProgressModule,
} from "nextsapien-component-lib";

@NgModule({
  declarations: [],
  imports: [CommonModule, ButtonsModule, ImageCardModule, CircleProgressModule],
  exports: [ButtonsModule, ImageCardModule, CircleProgressModule],
})
export class EssentialsModule {}
