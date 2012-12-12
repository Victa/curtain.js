Curtain.js (The plugin is no longer maintained)
========================================

This plugin allows you to create a web page with multiple fixed panels that unroll with an amusing effect. Exactly like a curtain rises.
 
To navigate, you can use your keyboard instead the scrollbar or mousewheel to navigate into the document. 
But that's not all, there is more features! For example, you can easily add a fixed element or multiple "steps" element inside a pannel.

Feel free to fork the project on github or ping me on [twitter](http://twitter.com/_victa) for any comments.

<a href='http://www.pledgie.com/campaigns/17333'><img alt='Click here to lend your support to: Curtain.js and make a donation at www.pledgie.com !' src='http://www.pledgie.com/campaigns/17333.png?skin_name=chrome' border='0' /></a>

## Demonstrations

* [Demo website](http://curtain.victorcoulon.fr)

### Site using Curtain.js

* [http://sports.espn.go.com/espn/eticket/story?page=Dock-Ellis](http://sports.espn.go.com/espn/eticket/story?page=Dock-Ellis)
* [http://womenandtech.com/](http://womenandtech.com/)


## Documentation

### Basic Usage

Usage is very straightforward, simply include curtain.js file in the page, along with jQuery.

```html
<script src="js/libs/jquery.js"></script>  
<script src="js/libs/curtain.js"></script>
```

And don't forget to add the base stylesheet

```html
<link rel="stylesheet" href="curtain.css">
```
Then call ``$('.curtains').curtain();`` to launch the plugin. You can add a set of optional options.

### Options

Valid options for curtain.js are:

* ``scrollSpeed`` - Adjust the scroll speed (default ``400``)
* ``menu`` - Bind event on "up" or "down" button (default ``null``)
* ``curtainLinks`` - If you want add a ``<a>`` (or multiple) link to a specific panel simply add a class name to this option. Take a look of the example bellow.(default ``'.curtain-links'``)
* ``enableKeys`` - Enable/Disable keyboard navigation (default ``true``)
* ``easing`` -  Change this option to specify the easing function used by jQuery animate calls. (defaults ``swing``) (You muse use jQuery easing plugin or similar to have more easing functions)

### Example

Setup the correct element structure:

```html
<ol class="curtains">
    <li class="cover"> 
        your content
    </li>
    <li>
        <div class="fixed"> <!-- if you need a "fixed" content -->
            a fixed content
        </div>
        [...]
    </li>
    <li class="cover">
       [...]
    </li>
    <li >
        <ul>
            <li class="step"> ... </li> <!-- Add the class "step" to an element to  -->
            <li class="step"> ... </li> <!-- make a break at this point with keyboard controls  -->
        </ul>
    </li>
</ol>
```

Then, you can launch the plugin:

```js
$(function () {
    $('.curtains').curtain({
        scrollSpeed: 400
    });
});

```
## Features

### Add a "next" and "prev" link

Insert your menu in your html document. You must use ``href="#up"`` and ``href="#down"``.

```html
<ul class="menu">
    <li><a href="#up">↑</a></li>
    <li><a href="#down">↓</a></li>
</ul>
```

Then, you can launch the plugin and specify the class of your menu.

```js
$(function () {
    $('.curtains').curtain({
        scrollSpeed: 400,
        controls: '.menu'
    });
});
```

### Add a link to a specific panel

Simply add an id attribute to your panel:

```html
<ol class="curtains">
    <li id="myfirstpanel" class="cover"> 
        your content
    </li>
    [...]
</ol>
```

Then you can add a link anywhere to your first panel like:

```html
<ol class="curtains">
    [...]
    <li class="cover">
       <a href="#myfirstpanel" class="curtain-links">Go to first panel</a>
    </li>
</ol>
```


Then, you can launch the plugin and specify the class of your links.

```js
$(function () {
    $('.curtains').curtain({
        scrollSpeed: 400,
        curtainLinks: '.curtain-links'
    });
});
```

### Add callbacks to slide change events

You can fire a callback when the slide changes

```js
$('.curtains').curtains({
    nextSlide: function() { console.log('next slide'); },
    prevSlide: function() { console.log('previous slide')}
});
```


## Compatibility

* Safari
* Firefox
* Chrome
* IE8/IE9
* iOs (iPhone/iPad) __but the curtain effect is disabled__
* Android (Chrome/Opera) __but the curtain effect is disabled__


## Roadmap

* Remove panels dynamically
* Better android default browser support
* scroll horizontally

## Credits

### Author
[Victor Coulon](http://victorcoulon.fr) or ping me on twitter http://twitter.com/_victa

### Contributors

* [Jordan Jefferson](https://github.com/jordanj77)
* [Francis Thomas](http://francisthomas.fr/)
* [John Brown](http://www.thisisjohnbrown.com/)


### Inspirations


* http://editsquarterly.com/
* http://www.interviewmagazine.com
* http://www.dbworks.pro/
* http://www.deuxhuithuit.com/en/
* http://www.madebygrave.com/
* http://www.boston.com/bigpicture/

### Licence
Licence MIT
