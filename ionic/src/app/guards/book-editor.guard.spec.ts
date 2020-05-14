import { TestBed, async, inject } from '@angular/core/testing';

import { BookEditorGuard } from './book-editor.guard';

describe('BookEditorGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BookEditorGuard]
    });
  });

  it('should ...', inject([BookEditorGuard], (guard: BookEditorGuard) => {
    expect(guard).toBeTruthy();
  }));
});
