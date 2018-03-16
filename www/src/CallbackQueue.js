import React, { Component } from 'react'
import cx from 'classnames'
import { networkIdleCallback } from 'network-idle-callback'
import './CallbackQueue.css'

export default class CallbackQueue extends Component {
  state = {
    callbacks: [],
    timeout: 5000,
  }

  removeCallbackById = (id) => {
    const newCallbacks = [...this.state.callbacks]

    newCallbacks.forEach(cb => {
      if (cb.id === id) {
        cb.isCalled = true
        cb.removedTime = Date.now()
      }
    })

    this.setState({ callbacks: newCallbacks })

    setTimeout(() => {
      this.setState({ callbacks: this.state.callbacks.filter(cb => cb.id !== id) })
    }, 3000)
  }

  handleAddClick = () => {
    const { callbacks, timeout } = this.state
    const topCallback = callbacks[0]

    const newCallbacks = [...callbacks]
    const id = topCallback ? topCallback.id + 1 : 0
    newCallbacks.unshift({
      id,
      timeout,
      isCalled: false,
      addedTime: Date.now(),
      fn: networkIdleCallback(() => {
        this.removeCallbackById(id)
      }, { timeout }),
    })
    this.setState({ callbacks: newCallbacks })
  }

  render() {
    const { callbacks, timeout } = this.state
    return (
      <div className="callback-queue">
        <h1> networkIdleCallback<span>()</span></h1>
        <p className="callback-queue__explaination">
          Simulate network activity by scrolling down the page.
        </p>
        <p className="callback-queue__explaination">
          Callbacks added to the queue will wait for network idle before executing.
        </p>

        <label className="callback-queue__timeout-input">
          <span>Timeout (ms)</span>
          <p> Maximum time to wait for idle network</p>
          <input
            min={ 0 }
            step={ 5 }
            type="number"
            value={ timeout }
            onChange={ e => this.setState({ timeout: e.target.value }) }
          />
        </label>
        <button className="callback-queue__add-btn" onClick={ this.handleAddClick }>
          Add callback
        </button>
        <div className="callback-queue__vis">
          <div className="callback-queue__placeholder-container">
            { Array(8).fill(0).map((_, index) => (
              <div key={ index } className="callback-queue__placeholder" />
            )) }
          </div>
          <div className="callback-queue__callback-container">
            { callbacks.map(({ id, timeout, isCalled, addedTime, removedTime }) => (
              <div
                key={ id }
                className={ cx(
                  "callback-queue__callback", {
                    "callback-queue__callback--called": isCalled,
                  }) }
              >
                <div
                  style={ { animationDuration: `${timeout}ms` } }
                  className="callback-queue__callback-fill"
                />
                { removedTime && (
                  <div className="callback-queue__callback-time">
                    +{ removedTime - addedTime }ms
                  </div>
                ) }
                { isCalled ? `Callback Executed` : `Callback ${ id }` }
              </div>
            )) }
          </div>
        </div>
      </div>
    );
  }
}
