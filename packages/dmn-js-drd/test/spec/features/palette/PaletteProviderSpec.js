'use strict';

require('../../../TestHelper');

/* global bootstrapModeler, inject */

var modelingModule = require('lib/features/modeling'),
    paletteModule = require('lib/features/palette'),
    coreModule = require('lib/core');

var domQuery = require('min-dom/lib/query');


describe('features/palette', function() {

  var diagramXML = require('../../../fixtures/dmn/input-data.dmn');

  var testModules = [ coreModule, modelingModule, paletteModule ];

  beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));


  it('should provide DMN modeling palette', inject(function(canvas, palette) {

    // when
    var paletteElement = domQuery('.djs-palette', canvas._container);
    var entries = domQuery.all('.entry', paletteElement);

    // then
    expect(entries.length).to.equal(5);
  }));

});
