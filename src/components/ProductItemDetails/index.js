// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const constantsList = {
  starting: 'starting',
  successful: 'successful',
  failing: 'failing',
  loading: 'loading',
}

class ProductItemDetails extends Component {
  state = {
    fetchingStatus: constantsList.starting,
    selectedItem: {},
    similarItemsList: [],
    count: 1,
  }

  componentDidMount() {
    this.getTheResults()
  }

  getTheResults = async () => {
    this.setState({fetchingStatus: constantsList.loading})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const token = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const {title, price, availability, brand, description, rating} = data
      const imageUrl = data.image_url
      const totalReviews = data.total_reviews
      const selectedItemDetails = {
        id,
        title,
        price,
        availability,
        brand,
        description,
        rating,
        imageUrl,
        totalReviews,
      }

      const similarItems = data.similar_products

      const updatedSimilarItems = similarItems.map(each => ({
        title: each.title,
        brand: each.brand,
        price: each.price,
        rating: each.rating,
        id: each.id,
        imageUrl: each.image_url,
      }))
      this.setState({
        selectedItem: {...selectedItemDetails},
        similarItemsList: [...updatedSimilarItems],
        fetchingStatus: constantsList.successful,
      })
    } else {
      this.setState({fetchingStatus: constantsList.failing})
    }
  }

  onDecrease = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prev => ({count: prev.count - 1}))
    }
  }

  onIncrease = () => {
    this.setState(prev => ({count: prev.count + 1}))
  }

  renderTheSelectedItem = () => {
    const {selectedItem, count, similarItemsList, fetchingStatus} = this.state
    console.log(fetchingStatus)
    const {
      title,
      price,
      availability,
      brand,
      description,
      rating,
      imageUrl,
      totalReviews,
    } = selectedItem
    return (
      <div className="product-item-details-container">
        <div className="top-part">
          <img src={imageUrl} alt="product" className="main-image-top" />
          <div className="item-text-part">
            <h1>{title}</h1>
            <p className="price">Rs {price}/-</p>
            <div className="rating-line">
              <div className="rating-box">
                <p>{rating} </p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-image"
                />
              </div>

              <p>{totalReviews} Reviews</p>
            </div>
            <p>{description}</p>
            <p>
              <b>Available: </b>
              {availability}
            </p>
            <p>
              <b>Brand: </b>
              {brand}
            </p>
            <hr />
            <div className="plus-minus-line">
              <button
                type="button"
                className="plus-minus-button"
                onClick={this.onDecrease}
                testid="minus"
              >
                <BsDashSquare className="icon" />
              </button>
              <p className="count">{count}</p>
              <button
                type="button"
                className="plus-minus-button"
                onClick={this.onIncrease}
                testid="plus"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="add-to-cart-button">
              ADD TO CART
            </button>
          </div>
        </div>
        <div>
          <h1>Similar Products</h1>
          <ul className="similar-items-container">
            {similarItemsList.map(each => (
              <SimilarProductItem details={each} key={each.id} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  continueShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  failingView = () => {
    console.log('failing view occurred')
    return (
      <div className="products-error-view-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
          className="products-failure-img"
        />
        <h1 className="product-failure-heading-text">Product Not Found</h1>
        <button
          type="button"
          className="continue-shopping-button"
          onClick={this.continueShopping}
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  loadingView = () => {
    console.log('loading view occurred')
    return (
      <div className="products-loader-container">
        <Loader
          type="ThreeDots"
          color="#0b69ff"
          height="50"
          width="50"
          testid="loader"
        />
      </div>
    )
  }

  renderAllItems = () => {
    const {fetchingStatus} = this.state

    switch (fetchingStatus) {
      case constantsList.successful:
        return this.renderTheSelectedItem()
      case constantsList.failing:
        return this.failingView()
      case constantsList.loading:
        return this.loadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderAllItems()}
      </>
    )
  }
}

export default ProductItemDetails
