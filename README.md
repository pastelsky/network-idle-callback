# networkIdleCallback
<img src="https://img.shields.io/npm/v/network-idle-callback.svg" /> <img src="https://img.shields.io/npm/l/network-idle-callback.svg" />


`networkIdleCallback` works similar to [`requestIdleCallback`](https://developers.google.com/web/updates/2015/08/using-requestidlecallback), detecting and notifying you when network activity goes idle in your current tab.

It can be used to load low priority resources such as analytics, or for preloading assets required in the future.

<b><a htarget="_blank" ref="https://pastelsky.github.io/network-idle-callback">DEMO</a></b>

## Installation
```bash
npm install network-idle-callback
```

## Usage
### Setup
`networkIdleCallback` uses a serviceworker to detect network activity. The easiest way to begin monitoring network activity is by importing the script into your serviceworker, and wrapping your fetch calls as such -

```js
// via CDN
importScripts('https://unpkg.com/network-idle-callback@1.0.0/lib/request-monitor.js')

// or if you process your sw through a bundler
import 'network-idle-callback/lib/request-monitor'

self.addEventListener('fetch', function (event) {
  self.requestMonitor.listen(event) // Listen to outgoing network requests
 
  const fetchPromise = fetch(event.request)
    .then((response) => {
      self.requestMonitor.unlisten(event) // Unlisten to successful requests
      return response
    })
    .catch((e) => {
      self.requestMonitor.unlisten(event) // Unlisten to failed requests
    })

  e.respondWith(fetchPromise)
});
```
and that's it. You're good to start using the callback - 

```js
import { networkIdleCallback } from 'network-idle-callback'

networkIdleCallback(() => {
  console.log('Execute low network priority tasks here.')
}, { timeout: 1000 })
```
The callback will be passed a params object containing - 

1. `didTimeout` (_boolean_) - Indicates whether the callback was called due to expiration of the deadline.

### Changing timeouts
There are a couple of ways in which the networkIdleCallback can be customized - 

1. **Idle Deadline** : (_default 0ms_) It is recommended to specify a deadline — the maximum time to wait for network idle, after the expiry of which the callback will be executed regardless of network activity.
``` js
networkIdleCallback(() => {
  console.log('Execute low network priority tasks here.')
}, { timeout: 1000 /* here */ })
```

2. **Network activity cooldown** - By default, `networkIdleCallback` waits for a period of 200ms after network activity seizes to trigger the callbacks. If you want to reduce this _debounce_ time, in your serviceworker, you can set - 

```js
self.requestMonitor.minIdleTime = 0 // or any other value
```

### Cancelling a callback
Just like `requestIdleCallback`, calling `networkIdleCallback` returns a unique identifier, which can be used to cancel the execution of the callback - 

```js
import { networkIdleCallback, cancelNetworkCallback } from 'network-idle-callback'

const id = networkIdleCallback(() => {
  console.log('Execute low network priority tasks here.')
}, { timeout: 1000 })

// Cancel the callback
cancelNetworkCallback(id)
```

## Browser compatibility
`networkIdleCallback` should work in all browsers that support serviceworkers. For browsers that don't, the callback will be still be called, but immediately, without any delay.

## FAQ's

**1. Does `networkIdleCallback` take into account network activity arising from other clients?**

Since a serviceworker can only listen to network activity arising from the domains it was registered with, without the support of a browser primitive, there is currently no way to detect network activity from other domains, or apps other than your web browser. 

However, more often than not, this is the behavior you expect, as you're only concerned with prioritizing resource loading in the context of the current tab.

**2. What happens if my serviworker is installed, but not activated?**

In the absence of a activated service worker, the callbacks will be executed immediately. If you can, calling `skipWaiting()` in the activation phase will skip the activation delay.

**3. When exactly does the `networkIdleCallback` execute ?**

<img src="https://github.com/pastelsky/network-idle-callback/blob/master/diagram.svg" alt="Lifecycle" width="500" />

