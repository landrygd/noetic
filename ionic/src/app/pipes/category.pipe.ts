import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'category'
})
export class CategoryPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    switch (value) {
      case 'action':
        return 'Action';
      case 'adventure':
        return 'Aventure';
      case 'fanfiction':
        return 'Fan-fiction';
      case 'fantastic':
        return 'Fantastique';
      case 'fiction':
        return 'Fiction générale';
      case 'horror':
        return 'Horreur';
      case 'humor':
        return 'Humour';
      case 'mystery':
        return 'Mystérieux';
      case 'nonfiction':
        return 'Non-fiction';
      case 'romance':
        return 'Romance';
      case 'scifi':
        return 'Science fiction';
      case 'thriller':
        return 'Thriller';
      default:
        return 'Non catégorisé';
    }
  }

}
