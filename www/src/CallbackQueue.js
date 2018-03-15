import React, { Component } from 'react';
import './CallbackQueue.css'

export default class CallbackQueue extends Component {
  state = {
    callbacks: [],
  }

  removeCallbackById = (id) => {
    this.setState({ callbacks: this.state.callbacks.filter(cb => cb.id !== id) })
  }

  handleAddClick = () => {
    const { callbacks } = this.state
    const topCallback = callbacks[0]

    const newCallbacks = [...callbacks]
    const id = topCallback ? topCallback.id + 1 : 0
    newCallbacks.unshift({
      id,
      fn: setTimeout(() => {
        //this.removeCallbackById(id)
      }, 2000),
    })
    this.setState({ callbacks: newCallbacks })
  }

  render() {
    const { callbacks } = this.state
    return (
      <div className="callback-queue">
        <h4> Callback queue </h4>
        <label className="callback-queue__timeout-input">
          Timeout
          <input
            min={ 0 }
            step={ 5 }
            type="number"
          />
        </label>
        <button className="callback-queue__add-btn" onClick={ this.handleAddClick }>
          Add callback
        </button>
        <div className="callback-queue__vis">
          <div className="callback-queue__placeholder-container">
            { Array(10).fill(0).map((_, index) => (
              <div key={ index } className="callback-queue__placeholder" />
            )) }
          </div>
          <div className="callback-queue__callback-container">
            { callbacks.map(({ id }) => (
              <div key={ id } className="callback-queue__callback">
                Callback #{ id }
              </div>
            )) }
          </div>
        </div>
      </div>
    );
  }
}