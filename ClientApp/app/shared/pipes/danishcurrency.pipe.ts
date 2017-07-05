import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'danishcurrency'
})
export class DanishCurrencyPipe implements PipeTransform {
    transform(value: string, args: any[]): any {

    }
}
