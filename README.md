## Backbone.Marionette animated region based on Velocity.js

Animared region for Backbone.Marionette views based on Velocity.js animation library

[![Build Status](https://travis-ci.org/maratfakhreev/marionette-animated-region.svg?branch=master)](https://travis-ci.org/maratfakhreev/marionette-animated-region)

Marionette-animated-region is convinient animated plugin based on [Velocity.js](http://velocityjs.org). It provides you to create beautiful animation effects for your Marionette views.

### How to install:

```bash
npm install marionette-animated-region
```

First include Marionette and it dependencies and velocity.js lib.

**Browser:**
```javascript
<script>...</script>
<script src="backbone.marionette.js" type="text/javascript"></script>
<script src="velocity.js"></script>
<script src="velocity.ui.js"></script>
<script src="marionette-animated-region.js" type="text/javascript"></script>
```

**Common JS:**
```javascript
require('marionette-animated-region');
```

### How to use:

The main goodies that Marionette-animated-region uses only region properties and can work as simple Marionette region if you do not define animation. So it's flexible, fast and maximum safety.

```javascript
  var LayoutView = Marionette.LayoutView.extend({
    regions: {
      animatedRegion: {
        selector: '#region_selector',
        regionClass: AnimatedRegion,
        animation: {
          showAnimation: [...],
          hideAnimation: [...]
        }
      }
    }
  });
```

To use animation you must define `animation` object. It can includes two arrays of effects, you can define only showAnimation or hideAnimation or both. Each element of the array should be [Velocity.js](http://velocityjs.org) animation object.

**Basic example:**
```javascript
  var LayoutView = Marionette.LayoutView.extend({
    //...

    regions: {
      exampleRegion: {
        selector: '#region_selector',
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
    },

    onRender: function() {
      // this view will render with animation
      this.animatedRegion.show(new Marionette.ItemView());
      // and after 2 second remove with animation
      _.delay(_.bind(function() { this.exampleRegion.empty(); }, this), 2000);
    }
  });

  new LayoutView({ el: $('#layout_view') }).render();
```

It's possible to determine set of effects, like:
```javascript
  //...
  showAnimation: [
    {
      properties: 'transition.slideRightBigIn',
      options: { stagger: 500 }
    },
    {
      properties: {
        rotateZ: '180deg'
      }
    },
    {
      properties: {
        rotateZ: '90deg'
      }
    },
    //...
  ],
  //...
```

### Events and Callback methods:

Marionette-animated-region includes show and destroy callbacks. In some situations you may need to perform some action only after the animation will take place. So in your event aggregator or Marionette instance you can provide listeners for `AnimatedRegion`. You may listen two `region:shown` and `region:removed` actions.

```javascript
  //...
  initialize: function() {
    this.listenTo(AnimatedRegion, 'region:shown', function(region) {
      // region variable contains region which has beed rendered,
      // you can manipulate it
      if (region.options.name) {
        console.log(region.options.name + ' has been rendered');
      }
    });

    this.listenTo(AnimatedRegion, 'region:removed', function(region) {
      console.log(region);
    });
  },
  //...
```

### Thanks to:

* The Marionette team for [backbone.marionette.js](http://marionettejs.com)
* The Julian Shapiro and Velocity team for [velocity.js](http://julian.com/research/velocity/)

** Working examples you can find [here](https://github.com/maratfakhreev/marionette-animated-region/tree/master/examples) **
