document.addEventListener("DOMContentLoaded", function () {
  var randomImage = document.querySelector("#randomMeal");
  var randomName = document.querySelector(".mealName");

  let searchButton = document.querySelector("#searchButton");
  let searchResults = document.querySelector("#resultsBox");
  let searchInput = document.getElementById("searchBar");
  let randomPick = document.getElementById("randomPick");

  var mealGrid = document.getElementById("results");

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
    ratingValue.textContent = "4.3";
    ratingDiv.appendChild(starImage);
    ratingDiv.appendChild(ratingValue);

    var lineDiv = document.createElement("div");
    lineDiv.className = "line";

    var viewsDiv = document.createElement("div");
    viewsDiv.className = "views";
    var viewsText = document.createElement("p");
    viewsText.textContent = "(4.8k views)";
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
        randomImage.appendChild(mealElement);
      });
    });

  // Display meals based on search
  searchButton.addEventListener("click", () => {
    randomPick.style.display = "none";
    searchResults.style.display = "block";

    const category = searchInput.value;
    if (category.trim() === "") {
      return;
    }

    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
      .then((response) => response.json())
      .then((data) => {
        data.meals.forEach((meal) => {
          const mealElement = createMealElement(meal);
          mealGrid.appendChild(mealElement);
        });
      });
  });

  // Function to open the modal and populate content
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
                <p id="instructions"><strong class="headings">Instructions:</strong></br> ${
                  createListFromParagraph(detailedMeal.strInstructions)
                }</p>
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

  // Close modal when the close button is clicked
  document.getElementById("closeModal").addEventListener("click", closeModal);

  // Close modal when clicking outside the modal
  window.addEventListener("click", function (event) {
    const modal = document.getElementById("recipeModal");
    if (event.target === modal) {
      closeModal();
    }
  });
});
function createListFromParagraph(paragraph) {
  if (typeof paragraph !== 'string') {
    // If paragraph is not a string, return an empty string or handle the error accordingly
    return '';
  }

  // Split the paragraph into sentences using periods as the delimiter
  const sentences = paragraph.split('.');

  // Remove empty strings from the array (caused by consecutive periods)
  const nonEmptySentences = sentences.filter(sentence => sentence.trim() !== '');

  // Use Array.map to create an array of <li> elements
  const listItems = nonEmptySentences.map(sentence => `<li>${sentence.trim()}</li>`);

  // Join the array of <li> elements into a single string
  const listHtml = `<ol>${listItems.join('')}</ol>`;

  return listHtml;
}