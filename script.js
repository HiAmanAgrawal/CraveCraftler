document.addEventListener("DOMContentLoaded", function () {
  // Selecting DOM elements
  var randomImageElement = document.querySelector("#randomMeal");
  var randomNameElement = document.querySelector(".mealName");

  let searchButtonElement = document.querySelector("#searchButton");
  let searchResultsElement = document.querySelector("#resultsBox");
  let searchInputElement = document.getElementById("searchBar");
  let randomPickElement = document.getElementById("randomPick");

  var info = document.getElementById("info");
  var resultsElement = document.getElementById("results");

  // Function to create a meal element
  function createMealElement(meal) {
    var searchMealDiv = document.createElement("div");
    searchMealDiv.className = "searchMeal";

    var randomImageDiv = document.createElement("div");
    randomImageDiv.className = "randomImage";
    var mealImage = document.createElement("img");
    mealImage.src = meal.strMealThumb;
    mealImage.alt = meal.strMeal;
    randomImageDiv.appendChild(mealImage);

    searchMealDiv.appendChild(randomImageDiv);

    var mealNameDiv = document.createElement("div");
    mealNameDiv.className = "mealName";
    mealNameDiv.textContent = meal.strMeal;

    var statsDiv = document.createElement("div");
    statsDiv.className = "stats";

    var ratingDiv = document.createElement("div");
    ratingDiv.className = "rating";
    var starImage = document.createElement("img");
    starImage.src = "./assets/star.png";
    starImage.alt = "star";
    starImage.width = "10px";
    var ratingValue = document.createElement("u");
    ratingValue.textContent = generateRandomRating(4, 5);
    ratingDiv.appendChild(starImage);
    ratingDiv.appendChild(ratingValue);

    var lineDiv = document.createElement("div");
    lineDiv.className = "line";

    var viewsDiv = document.createElement("div");
    viewsDiv.className = "views";
    var viewsText = document.createElement("p");
    viewsText.textContent = "(" + generateRandomRating(4, 5) + "k views)";
    viewsDiv.appendChild(viewsText);

    statsDiv.appendChild(ratingDiv);
    statsDiv.appendChild(lineDiv);
    statsDiv.appendChild(viewsDiv);

    var recipeButtonDiv = document.createElement("div");
    recipeButtonDiv.className = "recipeButton";
    var recipeButton = document.createElement("button");
    recipeButton.className = "recipeText";
    recipeButton.textContent = ">Recipe";
    recipeButtonDiv.appendChild(recipeButton);
    searchMealDiv.appendChild(mealNameDiv);
    searchMealDiv.appendChild(statsDiv);
    recipeButtonDiv.appendChild(recipeButton);
    searchMealDiv.appendChild(recipeButtonDiv);
    // Function to randomly pick a cooking line and author
    function displayRandomCookingQuote() {
      // Array of cooking quotes and authors
      const cookingQuotes = [
        {
          quote:
            "Ignite Your Culinary Passion – Where Every Meal Becomes a Masterpiece!",
          author: "- Culinary Proverbs",
        },
        {
          quote:
            "Elevate Your Kitchen Experience – Unleashing Flavors, Crafting Memories.",
          author: "- Gourmet Gurus",
        },
        {
          quote:
            "Savor the Art of Cooking – Your Journey to Culinary Excellence Starts Here.",
          author: "- Epicurean Explorers",
        },
        {
          quote:
            "Cooking Beyond Boundaries – Where Innovation Meets Tradition on Your Plate.",
          author: "- Flavor Alchemists",
        },
        {
          quote:
            "Discover Culinary Bliss – Turning Everyday Ingredients into Extraordinary Experiences.",
          author: "- Gastronomy Geniuses",
        },
        {
          quote:
            "Spice Up Your Life – Transforming Ordinary Meals into Culinary Adventures.",
          author: "- Kitchen Visionaries",
        },
        {
          quote:
            "Cooking Unleashed – Elevate Your Kitchen, Delight Your Palate, Ignite Your Passion.",
          author: "- Culinary Mavericks",
        },
        {
          quote:
            "Crafting Culinary Magic – Where Every Dish Tells a Story of Flavorful Wonders.",
          author: "- Taste Taleweavers",
        },
        {
          quote:
            "Embrace the Joy of Cooking – Transforming Kitchens, Nourishing Souls.",
          author: "- Culinary Connoisseurs",
        },
        {
          quote:
            "Your Culinary Journey Begins – Infusing Every Meal with Passion and Panache.",
          author: "- Flavor Pioneers",
        },
      ];

      // Randomly picking a cooking quote
      const randomIndex = Math.floor(Math.random() * cookingQuotes.length);
      const selectedQuote = cookingQuotes[randomIndex];

      // Display the quote in the specified HTML format
      const quoteElement = document.getElementById("quote");
      quoteElement.innerHTML = `
    "${selectedQuote.quote}"
    <div id="author">
      ${selectedQuote.author}
    </div>
  `;
    }

    // Call the function to display a random cooking quote
    displayRandomCookingQuote();

    // Attach additional information to the meal element
    searchMealDiv.setAttribute("data-instructions", meal.strInstructions);
    searchMealDiv.setAttribute("data-youtube", meal.strYoutube);

    // Event listener for the Recipe button
    recipeButton.addEventListener("click", () => {
      openModal(meal);
    });

    return searchMealDiv;
  }

  // Fetch random meal
  fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to fetch data from the API");
      }
    })
    .then((data) => {
      data.meals.forEach((meal) => {
        const mealElement = createMealElement(meal);
        randomImageElement.appendChild(mealElement);
      });
    });

  // Display meals based on search
  searchButtonElement.addEventListener("click", () => {
    randomPickElement.style.display = "none";
    searchResultsElement.style.display = "block";

    const category = searchInputElement.value;
    if (category.trim() === "") {
      return;
    }

    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.meals) {
          // Display the results and show information
          resultsElement.style.display = "flex";
          const resultCount = data.meals.length;
          info.innerHTML = `<p>We have found <span class="impData">${resultCount}</span> result's based on your search <span class="impData">"${category}":</span></p>`;
          data.meals.forEach((meal) => {
            const mealElement = createMealElement(meal);
            resultsElement.appendChild(mealElement);
          });
        } else {
          // Display a message for no results
          info.innerHTML = `<h3>No results found for "${category}". Spice up a fresh search!</h3>
        <img src="https://media1.giphy.com/media/l41lFw057lAJQMwg0/giphy.webp?cid=dda24d501syytcx2emm7nhrt9vb54huxgpaljvsmzl7j1bo6&ep=v1_gifs_gifId&rid=giphy.webp&ct=g">`;
          resultsElement.style.display = "none";
        }
      });
  });

  // Function to open the modal and populate content
  function openModal(meal) {
    const modal = document.getElementById("recipeModal");
    const modalContent = document.getElementById("modalContent");

    // Fetch additional details using the lookup API
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const detailedMeal = data.meals[0];

        // Populate modal content with meal information
        modalContent.innerHTML = `
                <h2>${detailedMeal.strMeal}</h2>
                <div id="container">
                <div id="imageAndIngredients">
                <img src="${detailedMeal.strMealThumb}" alt="${
          detailedMeal.strMeal
        }" style="max-width: 100%;">
                <p  id="ingredients"><strong class="headings">Ingredients:</strong> ${getIngredients(
                  detailedMeal
                )}</p>
                </div>
                <div id="insrtructionsAndButton">
                <p id="instructions"><strong class="headings">Instructions:</strong></br> ${createListFromParagraph(
                  detailedMeal.strInstructions
                )}</p>
                <div id="button">
                <img src="./assets/youtube.png" id="ytIcon">
                <a href="${detailedMeal.strYoutube}" >Watch Tutorial!</a>
                <div>
                </div>
                </div>
            `;

        modal.style.display = "block";
      })
      .catch((error) => {
        console.error("Error fetching detailed meal information:", error);
      });
  }

  // Function to close the modal
  function closeModal() {
    const modal = document.getElementById("recipeModal");
    modal.style.display = "none";
  }

  // Function to get a formatted list of ingredients
  function getIngredients(meal) {
    let ingredientsList = "";
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && measure) {
        ingredientsList += `<br>${measure} ${ingredient}`;
      }
    }
    return ingredientsList;
  }

  document.getElementById("closeModal").addEventListener("click", closeModal);

  window.addEventListener("click", function (event) {
    const modal = document.getElementById("recipeModal");
    if (event.target === modal) {
      closeModal();
    }
  });
});

// Function to create a list from a paragraph
function createListFromParagraph(paragraph) {
  if (typeof paragraph !== "string") {
    return "";
  }

  const sentences = paragraph.split(".");

  const nonEmptySentences = sentences.filter(
    (sentence) => sentence.trim() !== ""
  );

  const listItems = nonEmptySentences.map(
    (sentence) => `<li>${sentence.trim()}</li>`
  );

  const listHtml = `<ol>${listItems.join("")}</ol>`;

  return listHtml;
}

// Function to toggle the menu
function toggleMenu() {
  console.log("hello");
  var menuElement = document.querySelector(".menu");
  var popupElement = document.getElementById("cover");
  console.log(menuElement);
  menuElement.classList.toggle("open");
  popupElement.style.display =
    popupElement.style.display === "block" ? "none" : "block";
}

// Function to close the popup
function closePopup() {
  var menuElement = document.querySelector(".menu");
  var popupElement = document.getElementById("cover");
  menuElement.classList.remove("open");
  popupElement.style.display = "none";
}

// Function to generate a random rating between min and max
function generateRandomRating(min, max) {
  return (Math.random() * (max - min) + min).toFixed(1);
}

// Event listeners for home button clicks
document.getElementById("home1").addEventListener("click", () => {
  location.reload();
});

document.getElementById("home2").addEventListener("click", () => {
  location.reload();
});
