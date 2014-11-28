Cached Firebase
---------------

Cache Firebase data for offline storage.

* Uses localForage for performance (non-blocking async localStorage)
* Uses Promises

```javascript
var CachedRef = require('cached-firebase');

var url = 'https://xxxx.firebaseio.com/your/url';

var ref = new CachedRef(url,{
	timeout: 60000 // timeout before promise rejects
	value: null // initial value
	key: '...' // key in localStorage
})

ref.isReady // loaded from localForage?
ref.isReady.then(function(cachedValue){ ... });

ref.isLoaded // loaded from Firebase?
ref.loaded.then(function(firebaseValue){ ... });

ref.value; // current value
ref.set(); // saves current value

CachedRef.TIMEOUT = 60000; // default timeout

```

## TODO

* Documentation
* Export CommonJS to global build (webpack)
* Check if bower installation works