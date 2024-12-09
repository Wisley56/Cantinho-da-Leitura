
document.addEventListener("DOMContentLoaded", () => {
    const swiper = new Swiper(".swiper-container", {
        slidesPerView: 3,
        spaceBetween: 20,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
            },
            480: {
                slidesPerView: 1,
            },
        },
    });
});

// Função para listar livros no carrossel
async function fetchBooks() {
  try {
    const response = await fetch('/api/books');
      if (!response.ok) throw new Error("Erro ao buscar livros.");

    const books = await response.json();

    const swiperWrapper = document.querySelector('.swiper-wrapper');
    swiperWrapper.innerHTML = '';

    books.forEach(book => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      slide.textContent = `${book.title} - ${book.author}`;
      swiperWrapper.appendChild(slide);
    });

    swiper.update();
    showToast("Livros carregados com sucesso!");
  } catch (error) {
    showToast(error.message, "error");
  }
}
  

    // Chamar a API ao carregar a página para preencher o carrossel
    fetchBooks();

    // Função para pesquisar livros
searchCard.querySelector('button').addEventListener('click', async () => {
  const query = searchCard.querySelector('input').value;

  try {
      const response = await fetch(`/api/books?title=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Erro ao pesquisar livro.");

      const result = await response.json();
      showToast(`Resultado: ${result.length} livro(s) encontrado(s).`);
  } catch (error) {
      showToast(error.message, "error");
  }
});
  

    // Função para adicionar livro
addBookCard.querySelector('button').addEventListener('click', async () => {
  const title = addBookCard.querySelector('input[placeholder="Título"]').value;
  const author = addBookCard.querySelector('input[placeholder="Autor"]').value;
  const year = addBookCard.querySelector('input[placeholder="Ano de Publicação"]').value;
  const genre = addBookCard.querySelector('input[placeholder="Gênero"]').value;

  try {
      const response = await fetch('/api/books', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, author, year, genre }),
      });

      if (!response.ok) throw new Error("Erro ao adicionar livro.");
      
      showToast("Livro adicionado com sucesso!");
      fetchBooks(); // Atualiza o carrossel
  } catch (error) {
      showToast(error.message, "error");
  }
});

async function removeBook(id) {
  try {
      const response = await fetch(`/api/books/${id}`, {
          method: 'DELETE',
      });

      if (!response.ok) throw new Error("Erro ao remover livro.");
      
      showToast("Livro removido com sucesso!");
      fetchBooks(); // Atualiza o carrossel
  } catch (error) {
      showToast(error.message, "error");
  }
}


function showToast(message, type = "success") {
  const toastContainer = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  toastContainer.appendChild(toast);

  // Remove o toast após 3 segundos
  setTimeout(() => {
      toast.classList.add("hide");
      setTimeout(() => toast.remove(), 500); // Espera a transição
  }, 3000);
}

//////////////////
document.querySelectorAll('.carousel-item').forEach(item => {
  item.addEventListener('click', () => {
      document.getElementById('bookModal').style.display = 'flex';
      document.getElementById('modalBookTitle').textContent = item.dataset.title;
      document.getElementById('modalBookAuthor').textContent = `Autor: ${item.dataset.author}`;
      document.getElementById('modalBookYear').textContent = `Ano: ${item.dataset.year}`;
      document.getElementById('modalBookGenre').textContent = `Gênero: ${item.dataset.genre}`;
      document.getElementById('modalBookDescription').textContent = item.dataset.description;
  });
});

document.querySelector('.close').addEventListener('click', () => {
  document.getElementById('bookModal').style.display = 'none';
});

document.getElementById('addToLibraryButton').addEventListener('click', () => {
  // Aqui você pode adicionar lógica para integração com o back-end
  alert('Livro adicionado à biblioteca com sucesso!');
  document.getElementById('bookModal').style.display = 'none';
});
