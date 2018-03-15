self.addEventListener('message', function handler(event) {
  console.log('[ServiceWorker] message', event.data)
  if (event.data === 'NETWORK_IDLE_ENQUIRY') {
    event.ports[0].postMessage(
      self.requestMonitor.isIdle ?
        'NETWORK_IDLE_ENQUIRY_RESULT_IDLE':
        'NETWORK_IDLE_ENQUIRY_RESULT_NOT_IDLE'
  );
  }
});

if(self.requestMonitor) {
  throw new Error('ServiceWorker already has a method named `requestMonitor`. Rename the method for network idle callback to work.')
} else {
  self.requestMonitor = {
    requestSet: {},
    isIdle: true,
    idleTimeoutId: null,
    minIdleTimeout: 200,

    add({ clientId, request }) {
      clearTimeout(this.idleTimeoutId)
      this.isIdle = false

      if (!clientId)
        return

      if (this.requestSet[clientId]) {
        this.requestSet[clientId].add(request)
      } else {
        this.requestSet[clientId] = new Set([request])
      }
    },

    setIdleAfterTimeout(fn) {
      console.log('will set idle after ' + this.minIdleTimeout)
      if (this.idleTimeoutId) {
        clearTimeout(this.idleTimeoutId)
      }

      this.idleTimeoutId = setTimeout(() => {
        if (fn) fn()
        console.log('is idle now')
        this.isIdle = true
      }, this.minIdleTimeout)
    },

    remove({ clientId, request }) {
      if (!clientId) {
        this.setIdleAfterTimeout()
        return
      }

      this.requestSet[clientId].delete(request)

      if (!clientId) {
        console.log('page load finished')
        return
      }

      if (this.requestSet[clientId].size === 0) {
        this.setIdleAfterTimeout(() => {
          console.log('posting message to', clientId)
          self.clients.get(clientId).then((client) => {
            client.postMessage('NETWORK_IDLE_CALLBACK')
          })
        })
      }
    },
  }
}

