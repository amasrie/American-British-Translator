/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]----
 *       (if additional are added, keep them at the very end!)
 */

const chai = require('chai');
const assert = chai.assert;

let Translator;

suite('Functional Tests', () => {
  suiteSetup(() => {
    // DOM already mocked -- load translator then run tests
    Translator = require('../public/translator.js');
  });

  suite('Function ____()', () => {
    /* 
      The translated sentence is appended to the `translated-sentence` `div`
      and the translated words or terms are wrapped in 
      `<span class="highlight">...</span>` tags when the "Translate" button is pressed.
    */
    test("Translation appended to the `translated-sentence` `div`", done => {
      const input = "The car boot sale at Boxted Airfield was called off.";
      const output = "The <span class=\"highlight\">swap meet</span> at Boxted Airfield was called off.";
      Translator.setText(input);
      Translator.setOption(false);
      Translator.translateButton();
      let translation = Translator.getTranslation();
      assert.equal(translation, output);
      done();
    });

    /* 
      If there are no words or terms that need to be translated,
      the message 'Everything looks good to me!' is appended to the
      `translated-sentence` `div` when the "Translate" button is pressed.
    */
    test("'Everything looks good to me!' message appended to the `translated-sentence` `div`", done => {
      const input = "This sentence have no translation.";
      const output = "Everything looks good to me!";
      Translator.setText(input);
      let answer = Translator.translateButton();
      assert.equal(answer, output);
      done();
    });

    /* 
      If the text area is empty when the "Translation" button is
      pressed, append the message 'Error: No text to translate.' to 
      the `error-msg` `div`.
    */
    test("'Error: No text to translate.' message appended to the `translated-sentence` `div`", done => {
      const input = "";
      const output = "Error: No text to translate.";
      Translator.setText(input);
      let answer = Translator.translateButton();
      assert.equal(answer, output);
      done();
    });

  });

  suite('Function ____()', () => {
    /* 
      The text area and both the `translated-sentence` and `error-msg`
      `divs` are cleared when the "Clear" button is pressed.
    */
    test("Text area, `translated-sentence`, and `error-msg` are cleared", done => {
      Translator.clearButton();
      let translation = Translator.getTranslation();
      let area = Translator.getArea();
      let error = Translator.getError();
      assert.equal(translation, "");
      assert.equal(area, "");
      assert.equal(error, "");
      done();
    });

  });

});
