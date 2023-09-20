const socket = io()

const addToCartButtons = document.querySelectorAll(".addToCart");
const articleContainer = document.getElementById("article-container")

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