const socket = io()

const addToCartButtons = document.querySelectorAll(".addToCart");

Array.from(addToCartButtons).forEach((button) => {
  button.addEventListener('click', () => {
    const product = button.parentElement;
    const productData = {
      title: product.querySelector('.title').innerText,
      description: product.querySelector('.description').innerText,
      category: product.querySelector('.category').innerText,
      price: product.querySelector('.price').innerText,
      stock: product.querySelector('.stock').innerText,
      _id: product.querySelector(".id").innerText
    };
    
    Swal.fire({
      title: 'Product added successfuly!',
      icon: 'success'
    })

    socket.emit('add-to-cart', productData);

  });
});

socket.on('user', (user) => {

  console.log(user)

  Swal.fire({
    title: `Welcome ${user.first_name} ${user.last_name}!`,
    icon: 'success'
  })
})