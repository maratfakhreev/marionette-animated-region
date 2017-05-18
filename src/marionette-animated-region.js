(factory => {
  if (typeof require === 'function' && typeof exports === 'object') {
    // Define as CommonJS export:
    module.exports = factory(
      window.jQuery = window.$ = require('jquery'),
      require('underscore'),
      require('backbone.radio'),
      require('backbone.marionette'),
      require('../../velocity-animate/velocity'),
      require('../../velocity-animate/velocity.ui')
    );
  } else if (typeof define === 'function' && define.amd) {
    // Define as AMD:
    define([
      'jquery',
      'underscore',
      'backbone.radio',
      'backbone.marionette',
      '../../velocity-animate/velocity',
      '../../velocity-animate/velocity.ui'
    ], factory);
  } else {
    // Browser:
    window.AnimatedRegion = factory(
      window.jQuery = window.$,
      window._,
      window.Backbone.Radio,
      window.Marionette
    );
  }
})(($, _, Radio, Marionette) => {
  const regionChannel = Radio.channel('region');

  function iterateOverAnimations(animations, callback) {
    /* eslint-disable */
    if (!animations.length) {
      throw new Error('You must define showAnimation or hideAnimation objects. Ex: exRegion: { animation: { showAnimation: [{ //properties and options }, { ... }] } }');
    }
    /* eslint-enable */
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
    view.off('destroy', this.empty, this);
    this.triggerMethod('before:empty', this, view);
    this._restoreEl();
    delete this.currentView;

    if (!view._isDestroyed) {
      this.removeView(view, options);
      delete view._parent;
    }

    this.triggerMethod('empty', this, view);

    return this;
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
          regionChannel.trigger('region:shown', this);
        });
      } else {
        this.$el.css({ display: 'block' });
      }
    }

    empty(options = { allowMissingEl: true }) {
      const view = this.currentView;

      if (!view) {
        if (this._ensureElement(options)) {
          this.detachHtml();
        }

        return this;
      }

      const shouldDestroy = !options.preventDestroy;

      if (!shouldDestroy) {
        console.warn('Deprecation warning: The preventDestroy option is deprecated. Use Region#detachView');
      }

      this.$el.velocity('stop');

      if (this.animation && this.animation.hideAnimation) {
        iterateOverAnimations.call(this, this.animation.hideAnimation, () => {
          emptyRegion.call(this, view, options);
          this.$el.removeAttr('style');
          regionChannel.trigger('region:removed', this);
        });
      } else {
        emptyRegion.call(this, view, options);
      }

      return this;
    }
  }

  return AnimatedRegion;
});
