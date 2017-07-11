import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'danishcurrency'
})
export class DanishCurrencyPipe implements PipeTransform {
    transform(value: string, args: any[]): string {
        let valueToReturn = '';
        let substring1;
        value = value + '';

        if (value.indexOf('.') > -1) {
            value = value.replace('.', '');
        }
        if (value.length > 3) {
            for (let i = value.length; 2 < i; i = i - 3) {
                substring1 = '';
                substring1 = value.slice(i - 3, i);
                if (substring1.length == 3) {
                    valueToReturn = "." + substring1 + valueToReturn;
                }
                if (i - 3 == 2) {
                    substring1 = value.slice(0, 2);
                    valueToReturn = substring1 + valueToReturn;
                }
                else if (i - 3 == 1) {
                    substring1 = value.slice(0, 1);
                    valueToReturn = substring1 + valueToReturn;
                }
            }
            return valueToReturn;
        }
        else {
            return value;
        }
        

    }
}
