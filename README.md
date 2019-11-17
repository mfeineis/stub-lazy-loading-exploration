# stub-lazy-loading-exploration
Illustrates an approach to lazy loading JS dependencies reverse engineered from facebook's sdk

## TL;DR
Optimizes the time to first contentful paint while providing the site author with a simple API that looks synchronous while lazy loading actual library code behind the scenes.

## What does it do exactly?

* You load a tiny seed file [./src/boot.js]()
* A global namespace for your library is created 
* The global namespace contains a stub of your API's surface so you can use it immediately after the seed file has been executed in a synchronous fashion
* Calls to any function of your API are recorded 
* The seed file adds a script to the page that asynchronously loads the necessary library code to support your API
* The browser is now free to load and display the rest of the static content until the library code is ready to be executed
* The library code fills the seeded stubs with actual logic
* Once the library is completely loaded all recorded API calls to previously stubbed functions will be replayed on top of the real library code
* The page is now fully interactive

## Misc

* The boot file is written in plain ES3 code so you have the chance to service both modern and legacy browsers
* The boot code is optimized to be compiled with Google Closure Compiler in Advanced mode for minimal download fingerprint