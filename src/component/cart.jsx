import React, { Component } from 'react';
import Axios from 'axios';
import CartProductList from './cartProductList';
import _ from 'lodash';
import 'bootstrap/dist/css/bootstrap.css';
import PlaceOrder from './placeOrder';
import { connect } from 'react-redux';

class Cart extends Component {
  constructor() {
    super();
    this.state = {
      isLoading : true,
      cartItem : []      
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    Axios.get('http://demo5707519.mockable.io/cart_products').then(response => {
      this.setState({
        isLoading : false,
        cartItem : response.data
      });

      this.props.dispatch({
        type: 'ADD_INITIAL_PRODUCT_DATA',
        cartItem : response.data
      });
      
    })
    .catch(error => {
      console.log('Error fetching and parsing data', error);
    });
  }

  increaseItemQuantity(item, updatedQuantity) {
    if(updatedQuantity <= item.quantity) {
      this.updatedItemQuantity(item, updatedQuantity);
    }
    else {
      alert("No more item available")
    }
  }

  removeFromCart(item, updatedQuantity) {
    if(updatedQuantity === 0) {
      this.removeWholeItem(item);
    }else {
      this.updatedItemQuantity(item, updatedQuantity);
    }
  }

  removeWholeItem(item) {
    let tempCartItem = this.state.cartItem;
    _.remove(tempCartItem, item);
    this.setState({
      cartItem : tempCartItem
    }
    );
  }

  updatedItemQuantity(item, updatedQuantity) {
    let tempCartItem = this.state.cartItem;
    let index = _.findIndex(tempCartItem, item);
    tempCartItem[index]["cart_quantity"] = updatedQuantity ; 
    this.setState({
      cartItem : tempCartItem
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    if(this.state.cartItem.length <= 0) {
      alert("Add some item in the cart");
    }
    else {
      Axios.post('http://demo5707519.mockable.io/place_order', JSON.stringify(this.state.cartIds)).then(
        res => {
          console.log(res);
          this.props.history.push(`/order_placed`);
        }
      );
    }
  }

  render() { 
    const cartProduct = this.state.isLoading ?  <h2>Loading...</h2> : 
                        <div><CartProductList cartProductData={ this.state.cartItem } 
                        removeFromCart={ (item, updatedQuantity) => this.removeFromCart(item, updatedQuantity) } 
                        increaseItemQuantity={ (item, updatedQuantity) => this.increaseItemQuantity(item, updatedQuantity) } />
                        <PlaceOrder submitUrl={ this.handleSubmit } /></div>; 
    return ( 
        <div className="container">
          <h3>Cart List</h3>
          <hr />
            { 
              cartProduct 
            }          
        </div>
     );
  }
}

export default connect()(Cart);
 