import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "charCountdown",
  pure: false,
})
export class CharCountdownPipe implements PipeTransform {
  transform(text: string, args: number) {
    return text != undefined ? (args || 190) - text.length : args;
  }
}
