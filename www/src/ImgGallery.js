import React, { Component } from 'react';
import './ImgGallery.css'

export default class ImgGallery extends Component {
  state = {
    count: 20,
  }

  componentDidMount() {
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].intersectionRatio > 0) {
        this.setState({ count: this.state.count + 20 })
      }
    });

    this.observer.observe(this.sentinel);
  }

  render() {
    return (
      <section className="img-gallery">
        {
          Array(this.state.count).fill(0).map((_, index) => (
            <img src={ `https://source.unsplash.com/600x600/?modern,minimal,${index}` }
                 className="img-gallery__img" />
          ))
        }
        <div
          ref={ s => (this.sentinel = s) }
          className="img-gallery__sentinel"
        />
      </section>
    );
  }
}