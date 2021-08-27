import { Pipe, PipeTransform } from "@angular/core";
import { Globalization } from "@ionic-enterprise/globalization/ngx";

@Pipe({
  name: "timezone",
})
export class TimezonePipe implements PipeTransform {
  constructor(private globalization: Globalization) {}

  transform(value: string): any {
    return new Promise(async (resolve) => {
      await this.convertTime(value).then(async (time: any) => {
        resolve(time.value);
      });
    });
  }

  convertTime(time) {
    const options = {
      formatLength: "short",
      selector: "time",
    };
    const newTime = new Date(parseInt(time));
    return new Promise((resolve, reject) => {
      this.globalization
        .dateToString(newTime, options)
        .then((res) => {
          resolve(res);
        })
        .catch((e) => reject(e));
    });
  }
}
