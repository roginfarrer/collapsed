import 'cypress-storybook/cypress';

describe('My First Test', function() {
  it('Does not do much!', function() {
    expect(true).to.equal(true);
  });
});

describe('My First Test', function() {
  it('Does not do much!', function() {
    expect(true).to.equal(false);
  });
});

describe('My First Test', function() {
  it('clicks the link "type"', function() {
    cy.visit('https://example.cypress.io');

    cy.contains('type').click();
  });
});

describe('RC', () => {
  // Note the use of `before`
  before(() => {
    // Visit the storybook iframe page once per file
    cy.visitStorybook();
  });

  // Note the use of `beforeEach`
  beforeEach(() => {
    // The first parameter is the category. This is the `title` in CSF or the value in `storiesOf`
    // The second parameter is the name of the story. This is the name of the function in CSF or the value in the `add`
    // This does not refresh the page, but will unmount any previous story and use the Storybook Router API to render a fresh new story
    cy.loadStory('React-Collapsed', 'Uncontrolled');
  });

  it('toggles open and close the panel', () => {
    cy.contains('Close').should('exist');
    cy.contains('Open').should('not.exist');
    cy.contains('In the morning').should('be.visible');

    cy.contains('Close').click();

    cy.contains('Close').should('not.exist');
    cy.contains('Open').should('exist');
    cy.contains('In the morning').should('not.be.visible');
  });
});
