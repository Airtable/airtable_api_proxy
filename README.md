# Airtable API proxy demo

This demo sets up a simple API proxy that returns all records from Art
Gallery template example and allows anyone on the internet to toggle
whether a particular artist is on display.

In this demo, clicking anywhere on the artist row toggles "On
Display?" checkbox in the base. You can [play with a live demo on heroku](https://agile-mesa-75029.herokuapp.com/).

This set up is useful if you'd like to provide read or write access to
Airtable data w/o exposing your API key, adding your own caching layer
so you're not limited by the rate limits, adding your own
authentication and authorization and many more use cases.

To run the example:
 * create an [Airtable account](https://airtable.com/signup),
 * create an [API key](https://airtable.com/account),
 * [duplicate](https://support.airtable.com/hc/en-us/articles/202584499) the [Art Gallery template](https://airtable.com/templates/featured/art-gallery-example)
 * get it's Base ID (e.g. by clicking "help -> api docs". The Base ID would be in the URL
and in all of the examples).

Then run `bundler` to install all the dependencies

    bundle

And start up the proxy with your API key and Base ID.

    export AIRTABLE_API_KEY=keyA3f3...  # your API key here
    export AIRTABLE_BASE_ID=app22ddr    # your Base ID here
    bundle exec rackup -p 9292 config.ru

Navigate to [localhost:9292](http://localhost:9292) for your proxy server.

# Running on heroku

Login to heroku

    heroku login

Create an app

    heroku create

Push your app to heroku

    git push heroku master

Configure the app

    heroku config:set AIRTABLE_API_KEY='keyASD' # Your API key here
    heroku config:set AIRTABLE_BASE_ID='app33f' # Your Base ID here

Go to the app

    heroku open

# TADA!

You should see something like this:

![example UI](https://static.airtable.com/i/api_proxy_demo/ui_example.png)

Now when someone clicks on any record, it will toggle the "On Display?" field and update your Airtable base in real time.

![Update example](https://static.airtable.com/i/api_proxy_demo/update_example.gif)

# Live demo

[Live demo](https://l.airtable.com/art_gallery_proxy_demo) is hosted on heroku. Feel free to click around.
