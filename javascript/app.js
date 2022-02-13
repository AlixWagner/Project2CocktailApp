// JS -

//     Create an app object(cocktailConnoisseur)

// Initialize preset data in the dedicated properties
// apiURL
// apiKey

// eventhandler submit button:
//     prevent default
//     get input from alcohol input
//     use input to create search parameters and Fetch from API
//     take returned API response object
//     create JSON object
//     Use function to randomly select one returned Drink from the list
//     Access JSON object for cocktail
//         id
//         name
//     print returned data to page

// eventhandler try again button:
//     prevent default
//     Use function to randomly select another returned Drink from the list
//     Access JSON object for cocktail
//         id
//         name
//     print returned data to page

// eventhandler Make This Drink button:
//     prevent default
//     get id from selected drink
//     use input to create search parameters and Fetch from API
//     take returned API response object
//     create JSON object
//     Access JSON object for cocktail
//         ingredients
//         measurements
//         instructions
//     print returned data to page

// Create an init method 

// App Object:
const cocktailApp = {};
// Setting up fetch API urls:
// initial call by users drink choice:
cocktailApp.alcoholUrl = new URL("https://www.thecocktaildb.com/api/json/v1/1/filter.php")
cocktailApp.alcoholUrl.search - new URLSearchParams({});
// secondary call for the recipe: 
cocktailApp.recipeUrl = new URL("https://www.thecocktaildb.com/api/json/v1/1/lookup.php")
cocktailApp.recipeUrl.search = new URLSearchParams({});
// call for random alcoholic drink:
cocktailApp.randomUrl = new URL("https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic")
// call if non-alcoholic toggled:
cocktailApp.mocktailUrl = new URL("https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic")
// base url for the submit button - adjusted if non-alcoholic is toggled. 
cocktailApp.currentUrl = cocktailApp.randomUrl;

// establishing variables, etc. ---
cocktailApp.currentDrink;
cocktailApp.ingredients = [];
cocktailApp.measurements = [];
cocktailApp.tellMeButton = document.querySelector(".submit");
cocktailApp.revealButton = document.querySelector(".reveal");
cocktailApp.randomButton = document.querySelector(".randomize");
// establishing methods ---
// method to filter through an array for all ingredients/measurements and return only those with values:
cocktailApp.parseArray = function (baseArray, pushArray, inclusion, object) {
    const currentArray = baseArray.filter((each) => each.includes(inclusion));
    currentArray.forEach((currentItem) => {
        if (object[currentItem]) {
            pushArray.push(object[currentItem])
        }
    });
}

// eventListeners for all our buttons:
cocktailApp.tellMeButton.addEventListener("click", function (event) {
    event.preventDefault();
    const userAlcohol = document.querySelector("#alcohol-select").value;
    if (userAlcohol) {
        cocktailApp.alcoholUrl.search = new URLSearchParams({
            i: userAlcohol
        });
        fetch(cocktailApp.alcoholUrl)
            .then((response) => {
                return response.json();
            }).then((jsonResult) => {
                const drinksArray = Array.from(jsonResult.drinks);
                const randomDrink = drinksArray[Math.floor(Math.random() * drinksArray.length)];
                console.log(drinksArray);
                console.log(randomDrink.strDrink);
                cocktailApp.currentDrink = randomDrink.idDrink
                cocktailApp.recipeUrl.search = new URLSearchParams({
                    i: cocktailApp.currentDrink
                });
            });
    } else {
        fetch(cocktailApp.currentUrl)
            .then((response) => {
                return response.json();
            }).then((jsonResult) => {
                const drinksArray = Array.from(jsonResult.drinks);
                const randomDrink = drinksArray[Math.floor(Math.random() * drinksArray.length)];
                console.log(drinksArray);
                console.log(randomDrink.strDrink);
                cocktailApp.currentDrink = randomDrink.idDrink
                cocktailApp.recipeUrl.search = new URLSearchParams({
                    i: cocktailApp.currentDrink
                });
            });
    }
    console.log('beepboop');
})

cocktailApp.revealButton.addEventListener("click", function () {
    fetch(cocktailApp.recipeUrl)
        .then((response) => {
            return response.json();
        }).then((jsonResult) => {
            const newArray = Object.keys(jsonResult.drinks[0]);
            console.log(jsonResult.drinks[0])
            cocktailApp.parseArray(newArray, cocktailApp.ingredients, "strIngredient", jsonResult.drinks[0]);
            cocktailApp.parseArray(newArray, cocktailApp.measurements, "strMeasure", jsonResult.drinks[0]);
            console.log(cocktailApp.measurements);
            console.log(cocktailApp.ingredients);
        });
});