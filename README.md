# networkIdleCallback
`networkIdleCallback` works similar to [`requestIdleCallback`](https://developers.google.com/web/updates/2015/08/using-requestidlecallback), detecting and notifying you when network activity goes idle in your current tab.

## Installation
```bash
npm install network-idle-callback
```

## Usage
```js
import networkIdleCallback from 'network-idle-callback'

networkIdleCallback(() => {
  console.log('Execute low network priority tasks here.')
}, { timeout: 1000 })
```
