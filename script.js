console.log("hello")
let randomAPI = fetch("https://www.themealdb.com/api/json/v1/1/random.php");
var randomImage = document.querySelector(".randomImage");
var randomName = document.querySelector(".mealName");

// Fetch random meal
console.log(randomImage)
console.log(randomName)
randomAPI.then((response) => {
    if (response.ok) {
        console.log("response is working fine")
        return response.json();
    } else {
        throw new Error('Failed to fetch data from the API');
    }
}).then(data => {
    data.meals.forEach(meal => {
        const mealImage = document.createElement('img');
        mealImage.src = meal.strMealThumb;

        const mealName = document.createElement('p');
        mealName.textContent = meal.strMeal;

        randomName.appendChild(mealName);
        randomImage.appendChild(mealImage);

        mealImage.addEventListener('click', () => {
            displayIngredients(meal.strMeal);
        });
    });
})