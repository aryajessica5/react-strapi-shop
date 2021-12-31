import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [items, setItems] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [error, setError] = useState('')
  const [total, setTotal] = useState(0)

  const getItems = async () => {
    try {
      const response = await axios.get('http://localhost:1337/api/items');
      setItems(response.data.data);
    } catch (error) {
      setError(error);
    }
  }

  const addToCart = (id) => {
    let item = items.find(it => it.id === id)
    console.log("item", item, 'id', id);
    if (!!item && item.attributes.instock > 0) {
      // add to cart
      setCartItems(cartItems.concat(item))
      // reduce instock quantity
      let updated_items = items.map(it => {
        if (it.id === item.id) {
          it.attributes.instock -= 1
        }
        return it
      })
      setItems(updated_items)
    }
    
    
  }

  const removeFromCart = (id) => {
    let item = cartItems.find((it, index) => index === id)

    if (!!item) {

      // remove from cart by item index
      let updatedCart = cartItems.map((item, index) => index === id ? false : item)
      setCartItems(updatedCart)

      // add item to instock quantity
      let updated_items = items.map(it => {
        if (it.id === item.id) {
          it.attributes.instock += 1
        }
        return it
      })
      setItems(updated_items)
    }
  }

  
  const restock = () => {
    getItems()
    setCartItems([])
  }

  useEffect(() => {
    getItems()
  }, [])

  if (error) {
    return <div>An error occured: {error.message}</div>;
  }

  return (
    <div className="App">
      <div className='container'>
        <div className='row'>
          <div className='col-12 col-sm-7'>
            <h1>
              Product List
            </h1>
            {items.map(item => (
              <Item item={item} addToCart={addToCart} key={item.id} />
            ))}
            <form>
              <div className="input-group my-3">

                <input type="text" className="form-control" placeholder="" aria-label="" value='http://localhost:1337/api/items' onChange={restock} />

                <div className="input-group-prepend">
                  <button className="btn btn-outline-primary" type="button" onClick={restock}>Restock</button>
                </div>
              </div>
            </form>
          </div>
          <div className='col-12 col-sm-5'>
            <h2>Items in Cart</h2>
            {cartItems.map((item, index) => {
              if (!!item) {
                return (
                  <Cart item={item} index={index} removeFromCart={removeFromCart} key={index} />
                )
              }
            })}
            <h2 className='mt-4'>Checkout</h2>
            <div className="media mb-3">
              <div className="media-body">
                <h3>Total ${cartItems.reduce((total, item) => total += item?.attributes?.price || 0, 0)}</h3>
              </div>
              <button className='btn btn-success'>Checkout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



function Item({ item, addToCart }) {
  return (
    <div className="media mt-3 border-bottom">
      <img width="72" src={item.attributes.image} alt={item.attributes.name} />
      <div className="media-body mx-2">
        <h5 className="mt-0 mb-1">{item.attributes?.name}</h5>
        <p><span className=''>${item.attributes.price}</span> <span className='badge badge-success pull-right'>{item.attributes.instock} In stock</span></p>
      </div>
      <button className='btn btn-primary' onClick={() => addToCart(item.id)}>Add to Cart</button>
    </div>
  )
}

function Cart({ item, index, removeFromCart }) {
  return (
    <div className="media mt-3 border-bottom">
      <img width="72" src={item.attributes.image} alt={item.attributes.name} />
      <div className="media-body mx-2">
        <h5 className="mt-0 mb-1">{item.attributes.name}</h5>
        <p>${item.attributes.price}</p>
      </div>
      <button className='btn btn-outline-danger btn-sm' onClick={() => removeFromCart(index)}>Remove</button>
    </div>
  )
}

export default App;
