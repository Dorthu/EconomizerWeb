# Economizer Web - Frontend for Fuel Economizer

This is an angular, mobile-focused frontend for my Fuel Economizer project.  This will be developed in
parallel with the webservices to allow their easy use.

## Want to try it?

You can host it yourself, of course, but you're more than welcome to use my instance [here on dorthu.com](http://economizer.dorthu.com).
During this really really in-development, so there's no self-service registration yet; please contact me if you
want to try it out super early!

## I really want to host it myself!

Cool!  You're going to need to change the configuration a bit (app/util.js); right now it looks at the URL it was served from
to decide what endpoints to hit.  If you want to hit my prod endpoints, just make sure to remove the localhost lines,
if you're hosting the webservices yourself as well, just set base to your base URL and you should be good to go!