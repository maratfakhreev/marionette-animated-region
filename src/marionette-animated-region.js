((factory) => {
  if (typeof require === 'function' && typeof exports === 'object') {
    // Define as CommonJS export:
    module.exports = factory(
      window.jQuery = window.$ = require('jquery'),
      require('backbone'),
      require('backbone.marionette'),
      require('../node_modules/velocity-animate/velocity'),
      require('../node_modules/velocity-animate/velocity.ui')
    );
  }
  else if (typeof define === 'function' && define.amd) {
    // Define as AMD:
    define([
      'jquery',
      'backbone',
      'backbone.marionette',
      '../node_modules/velocity-animate/velocity',
      '../node_modules/velocity-animate/velocity.ui'
    ], factory);
  }
  else {
    // Browser:
    window.AnimatedRegion = factory(
      window.jQuery = window.$,
      window.Backbone,
      window.Marionette
    );
  }
})(($, Backbone, Marionette) => {
  function iterateOverAnimations(animations, callback) {
    if (!animations.length) throw new Error('You must define showAnimation or hideAnimation objects. Ex: exRegion: { animation: { showAnimation: [{ //properties and options }, { ... }] } }');

    for (let i = 0, length = animations.length - 1; i <= length; i++) {
      const animation = animations[i];

      $.Velocity.animate(
        this.$el,
        animation.properties,
        animation.options
      ).then(() => {
        if (i === length) callback();
      });
    }
  }

  function emptyRegion(view, options) {
    const emptyOptions = options || {};
    const preventDestroy = !!emptyOptions.preventDestroy;

    view.off('destroy', this.empty, this);
    this.triggerMethod('before:empty', view);

    if (!preventDestroy) this._destroyView();

    this.triggerMethod('empty', view);
    delete this.currentView;

    if (preventDestroy) this.$el.contents().detach();
  }

  class AnimatedRegion extends Marionette.Region {
    initialize(options) {
      this.animation = options.animation;
    }

    attachHtml(view) {
      this.$el
        .css({ display: 'none' })
        .html(view.el)
        .velocity('stop');

      if (this.animation && this.animation.showAnimation) {
        iterateOverAnimations.call(this, this.animation.showAnimation, () => {
          AnimatedRegion.trigger('region:shown', this);
        });
      }
      else {
        this.$el.css({ display: 'block' });
      }
    }

    empty(options) {
      const view = this.currentView;

      if (!view) return;

      this.$el.velocity('stop');

      if (this.animation && this.animation.hideAnimation) {
        iterateOverAnimations.call(this, this.animation.hideAnimation, () => {
          emptyRegion.call(this, view, options);
          this.$el.removeAttr('style');
          AnimatedRegion.trigger('region:removed', this);
        });
      }
      else {
        emptyRegion.call(this, view, options);
      }

      return this;
    }
  }

  _.extend(AnimatedRegion, Backbone.Events);

  return AnimatedRegion;
});
