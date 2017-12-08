import { CollectionPage } from './app.po';

describe('collection App', () => {
  let page: CollectionPage;

  beforeEach(() => {
    page = new CollectionPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
