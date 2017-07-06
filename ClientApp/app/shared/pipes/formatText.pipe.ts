import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formattext'
})
export class FormatTextPipe implements PipeTransform {
    transform(value: string, args: any[]): string {
        let result = "";
        result = value.replace(/(?:\r\n|\r|\n)/g, '<br />');
        return result;
    }
}
