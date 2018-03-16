import React, { Component } from 'react';
import debounce from 'debounce'

import './ImgGallery.css'

export default class ImgGallery extends Component {
  state = {
    count: 20,
    isLoading: true,
  }

  increasePageSize = debounce(() => {
    this.setState({
      count: this.state.count + 15,
      isLoading: true,
    })
  }, 300, false)

  componentDidMount() {
    this.observer = new IntersectionObserver((entries) => {
      console.log('INTERSECTED', entries[0])
      if (entries[0].intersectionRatio > 0) {
        this.increasePageSize()
      }
    });

    this.observer.observe(this.sentinel);

    navigator.serviceWorker.addEventListener('message', ({ data }) => {
      console.log('setting false dat')
      // This event is a part of the implementation internals
      // Do not use it in your application code.
      if (data === 'NETWORK_IDLE_CALLBACK' || data === 'NETWORK_IDLE_ENQUIRY_RESULT_IDLE') {
        this.setState({ isLoading: false })
      }
    })
  }

  render() {
    const { isLoading } = this.state
    return (
      <section className="img-gallery">
        {
          Array(this.state.count).fill(0).map((_, index) => (
            <img key={ index }
                 src={ `https://source.unsplash.com/900x900/?modern,minimal,${index}` }
                 className="img-gallery__img" />
          ))
        }
        <div
          ref={ s => (this.sentinel = s) }
          className="img-gallery__sentinel"
        />
        { isLoading && (
          <div className="img-gallery__loader">
            Loading
          </div>
        ) }
      </section>
    );
  }
}