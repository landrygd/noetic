import { IdToObjectsPipe } from './id-to-objects.pipe';

describe('IdToObjectsPipe', () => {
  it('create an instance', () => {
    const pipe = new IdToObjectsPipe();
    expect(pipe).toBeTruthy();
  });
});
