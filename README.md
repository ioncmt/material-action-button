ion-action-button / material-action-button
=================

This module is a floating button for ionic and angular

```
bower install material-action-button
```

The $actionButton removes itself from the DOM when the view changes.

Create one:

Inject in your controller or directive:

```
.controller('exmapleCtrl', function($scope, $actionButton) {
```

Call for the creation:

```
$actionButton.create(options);
```

Options:

The example bellow shows all the options

* removeOnStateChange:If set to false, the element won't be removed from the dom automatically after view change.
* mainAction: is an object that will represent the button when the menu is closed
* buttons: will be the list of button displayed, we will detailled the content of a button object, if not provided only the main action will be active

Button and MainAction are following the same structure

* icon: Uses ionicons icons, but you can provide your own set with CSS class.
* backgroundColor: the color of the background.
* textColor: color of the text inside the button.
* onClick: function that will be called when element is clicked.
* label: displayed in front of the menu element (Not took into account for the main Action).
* letter: will replace the icon if you don't have.

Full exemple:

```javascript
.controller('exmapleCtrl', function($scope, $actionButton) {
  //you create a new action button.
  var actionButton = $actionButton.create({
    mainAction: {
      icon: 'ion-android-create',//Uses ionicons icons.
      backgroundColor: 'blue',
      textColor: ' white',
      onClick: function() {
        console.log('clicked main BUTTON');
      }
    },
    buttons: [{
      //if this array is empty or the buttons key non existant
      //there will be no secondary actions.
      //If there are secondary actions, the main action is overwritten to show
      //the open and close sub menu


      //shows pin icons with a 'find' label

      icon: 'ion-android-pin',
      label: 'Find',
      backgroundColor: 'red',
      iconColor: 'white',
      onClick: function() {
        console.log('clicked pin');
      }
    }, {
      //shows a label and icon defaults to first letter of label
      label: 'Ben Sparrow',
      onClick: function() {
        console.log('clicked O');
      }
    }, {
      //shows a label and icon is the letter configured
      label: 'Max Lynx',
      letter: 'O',
      onClick: function() {
        console.log('clicked Testing');
      }
    }]
  });  
})
```

API
----

It also provides a simple API:

* show() - Shows the button. Return promise.

* hide() - Hides the button. Return promise.

* visible() - Return boolean. True if visible, false if not.

CSS Customisation
-----------------

ion-action-button comes with a less file that is generating the css file
@containerBackgroungColor for the background color of the backdrop when menu is open
