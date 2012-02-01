Sliding.js
========================================

**Please be lenient. I'm currently working on the plugin.**

Live Example : http://lab.victorcoulon.fr/javascript/sliding.js/example/

This plugin allows you to create a web page with multiple fixed panels that unroll with an amusing effect. You can use the keyboard instead the scroll to navigate.

I made this plugin for the upcomming website of my friend [Etienne Ledemay](http://artographik.fr/).

Feel free to fork the project on github or ping me on [twitter](http://twitter.com/_victa) for any comments.

Documentation
-------------

### Basic Usage

Usage is very straightforward, simply include sliding.js file in the page, along with jQuery.

    <script src="js/libs/jquery.js"></script>  
    <script src="js/libs/sliding.js"></script>

And don't forget to add the base stylesheet

    <link rel="stylesheet" href="sliding.css">

Then call ``$('.slidingpanels').sliding();`` to launch the plugin. You can add a set of optional options.

### Options

Valid options for sliding.js are:

* ``scrollSpeed`` - Adjust the scroll speed (default ``400``)
* ``scrollButtons`` - Bind event on "up" or "down" button (default ``null``)

### Example

Setup the correct element structure:

    <ol class="yourpanelslist">
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
        $('.yourpanelslist').sliding({
            scrollSpeed: 600,
            scrollButtons: {
                up: $('#up'),
                down: $('#down')
            }
        });
    });

Credits
-------------

### Author
[Victor Coulon](http://victorcoulon.fr) or ping me on twitter http://twitter.com/_victa

### Inspiration

* http://editsquarterly.com/
* http://www.dbworks.pro/
* http://www.deuxhuithuit.com/en/
* http://www.madebygrave.com/

### Licence
Licence MIT