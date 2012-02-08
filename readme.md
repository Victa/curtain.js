Curtain.js
========================================

This plugin allows you to create a web page with multiple fixed panels that unroll with an amusing effect. Exactly like a curtain rises.
 
To navigate, you can use your keyboard instead the scrollbar or mousewheel to navigate into the document. 
But that's not all, there is more features! For example, you can easily add a fixed element or multiple "steps" element inside a pannel.

I created this plugin for the upcoming website of my friend [Etienne](http://artographik.fr/). And I decided to deliver this one as an open source project.
I would like you to note that the transition effect between two panels is extensively inspired by http://editsquarterly.com
We were also such inspired by the following websites:

* http://www.interviewmagazine.com
* http://dbworks.pro
* http://www.deuxhuithuit.com/en
* http://madebygrave.com
* http://www.boston.com/bigpicture/

Feel free to fork the project on github or ping me on [twitter](http://twitter.com/_victa) for any comments.

Demonstrations
-------------

* [Demo website](http://curtain.victorcoulon.fr)
* [Artographik](http://artographik.fr/) (upcomming website)

Documentation
-------------

### Basic Usage

Usage is very straightforward, simply include curtain.js file in the page, along with jQuery.

    <script src="js/libs/jquery.js"></script>  
    <script src="js/libs/curtain.js"></script>

And don't forget to add the base stylesheet

    <link rel="stylesheet" href="curtain.css">

Then call ``$('.curtains').curtain();`` to launch the plugin. You can add a set of optional options.

### Options

Valid options for curtain.js are:

* ``scrollSpeed`` - Adjust the scroll speed (default ``400``)
* ``menu`` - Bind event on "up" or "down" button (default ``null``)

### Example

Setup the correct element structure:

    <ul class="menu">
        <li><a href="#up">↑</a></li>
        <li><a href="#down">↓</a></li>
    </ul>

    <ol class="curtains">
        <li class="cover"> 
            your content
        </li>
        <li>
             <div class="fixed"> <!-- if you need a "fixed" content -->
                a fixed content
            </div>
            ...
        </li>
        <li class="cover">
            ...
        </li>
        <li >
            <ul>
                <li class="step"> ... </li> <!-- Add the class "step" to an element to  -->
                <li class="step"> ... </li> <!-- make a break at this point with keyboard controls  -->
            </ul>
        </li>
    </ol>
  
Then, you can launch the plugin:

    $(function () {
        $('.curtains').curtain({
            scrollSpeed: 600,
            menu: $('.menu')
        });
    });

Compatibility
-------------
Tested in:
* iOs 5.0.1 (iPhone + iPad) *but the curtain effect is disabled*
* Safari 5+
* Firefox 9+
* Chrome 17+

Credits
-------------

### Author
[Victor Coulon](http://victorcoulon.fr) or ping me on twitter http://twitter.com/_victa

### Inspirations

* http://editsquarterly.com/
* http://www.interviewmagazine.com
* http://www.dbworks.pro/
* http://www.deuxhuithuit.com/en/
* http://www.madebygrave.com/
* http://www.boston.com/bigpicture/

### Licence
Licence MIT