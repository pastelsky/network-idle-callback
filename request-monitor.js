self.addEventListener('message', function handler(event) {
  if (event.data === 'NETWORK_IDLE_ENQUIRY') {
    event.ports[0].postMessage(
      self.requestMonitor.isIdle ?
        'NETWORK_IDLE_ENQUIRY_RESULT_IDLE' :
        'NETWORK_IDLE_ENQUIRY_RESULT_NOT_IDLE',
    );
  }
});

if (self.requestMonitor) {
  throw new Error('ServiceWorker already has a method named `requestMonitor`. Rename the method for network idle callback to work.')
} else {
  self.requestMonitor = {
    requestSet: {},
    isIdle: true,
    idleTimeoutId: null,
    minIdleTime: 200,

    listen({ clientId, request }) {
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
      if (this.idleTimeoutId) {
        clearTimeout(this.idleTimeoutId)
      }

      this.idleTimeoutId = setTimeout(() => {
        if (fn) fn()
        this.isIdle = true
      }, this.minIdleTime)
    },

    unlisten({ clientId, request }) {
      if (!clientId) {
        this.setIdleAfterTimeout()
        return
      }

      this.requestSet[clientId].delete(request)

      if (!clientId) {
        return
      }

      if (this.requestSet[clientId].size === 0) {
        this.setIdleAfterTimeout(() => {
          const matchedClient = self.clients.get(clientId)

          if (!matchedClient) return

          matchedClient.then((client) => {
            client.postMessage('NETWORK_IDLE_CALLBACK')
          })
        })
      }
    },
  }
}

