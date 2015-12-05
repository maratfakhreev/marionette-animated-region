describe('layoutView', function() {
  this.timeout(5000);
  this.slow(3000);

  beforeEach(function() {
    var self = this;

    this.itemMarkup = '<div id="item_view"><p>Heirloom tattooed scenester YOLO leggings normcore. 8-bit lo-fi distillery, street art forage beard mixtape waistcoat.</p></div>';

    this.ItemView = Marionette.ItemView.extend({
      template: _.template(self.itemMarkup)
    });

    this.layoutMarkup = '<div id="example_region"></div>';

    this.LayoutView = Marionette.LayoutView.extend({
      template: _.template(self.layoutMarkup),
      regions: {
        exampleRegion: {
          selector: '#example_region',
          regionClass: AnimatedRegion,
          animation: {
            showAnimation: [
              {
                properties: 'transition.slideDownBigIn',
                options: { stagger: 300 }
              }
            ],
            hideAnimation: [
              {
                properties: 'transition.slideUpBigOut',
                options: { stagger: 300 }
              }
            ]
          }
        }
      }
    });

    this.layoutView = new this.LayoutView();
  });

  describe('on instantiation', function() {
    it('should instantiate the specified region', function() {
      expect(this.layoutView).to.have.property('exampleRegion');
    });

    it('regionClass should be an AnimatedRegion', function() {
      expect(this.layoutView.regions.exampleRegion.regionClass).to.equal(AnimatedRegion);
    });

    it('should have animation property', function() {
      expect(this.layoutView.exampleRegion).to.have.property('animation');
    });

    it('should have $el property is equal to region selector', function() {
      expect(this.layoutView.exampleRegion.el).is.equal(this.layoutView.regions.exampleRegion.selector);
    });
  });

  describe('on render', function() {
    beforeEach(function() {
      this.layoutView.render();
      this.layoutView.exampleRegion.show(new this.ItemView());
    });

    it('should layout region has been rendered', function() {
      expect(this.layoutView.$el.find('#example_region').length).to.not.equal(0);
    });

    it('should item view has been rendered', function() {
      expect(this.layoutView.$el.find('#item_view').length).to.not.equal(0);
    });
  });

  describe('on empty', function() {
    beforeEach(function() {
      this.layoutView.render();
      this.layoutView.exampleRegion.show(new this.ItemView());
      this.layoutView.exampleRegion.empty();
    });

    it('should item view has been removed', function(done) {
      var self = this;

      setTimeout(function() {
        expect(self.layoutView.$el.find('#item_view').length).to.equal(0);
        done();
      }, 1000);
    });
  });

  describe('after render', function() {
    beforeEach(function() {
      var self = this;

      this.hasShown = false;
      this.layoutView.listenTo(AnimatedRegion, 'region:shown', function() {
        self.hasShown = true;
      });
      this.layoutView.render();
    });

    it('should trigger region:show', function(done) {
      var self = this;

      this.layoutView.exampleRegion.show(new self.ItemView());

      setTimeout(function() {
        expect(self.hasShown).to.be.true;
        done();
      }, 1000);
    });
  });

  describe('after empty', function() {
    beforeEach(function() {
      var self = this;

      this.hasRemoved = false;
      this.layoutView.listenTo(AnimatedRegion, 'region:removed', function() {
        self.hasRemoved = true;
      });
      this.layoutView.render();
    });

    it('should trigger region:removed', function(done) {
      var self = this;

      this.layoutView.exampleRegion.show(new self.ItemView());
      this.layoutView.exampleRegion.empty();

      setTimeout(function() {
        expect(self.hasRemoved).to.be.true;
        done();
      }, 1000);
    });
  });
});
