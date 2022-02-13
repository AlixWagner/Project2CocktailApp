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
cocktailApp.alcoholUrl = new URL("https://www.thecocktaildb.com/api/json/v1/1/filter.php");
cocktailApp.alcoholUrl.search - new URLSearchParams({});
// secondary call for the recipe: 
cocktailApp.recipeUrl = new URL("https://www.thecocktaildb.com/api/json/v1/1/lookup.php");
cocktailApp.recipeUrl.search = new URLSearchParams({});
// call for random alcoholic drink:
cocktailApp.randomUrl = new URL("https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic");
// call if non-alcoholic toggled:
cocktailApp.mocktailUrl = new URL("https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic");
// base url for the submit button - adjusted if non-alcoholic is toggled. 
cocktailApp.currentUrl = cocktailApp.randomUrl;

// establishing variables, etc. ---
cocktailApp.currentDrink;
cocktailApp.ingredients = [];
cocktailApp.measurements = [];
cocktailApp.tellMeButton = document.querySelector(".submit");
cocktailApp.revealButton = document.querySelector(".reveal");
cocktailApp.randomButton = document.querySelector(".randomize");
cocktailApp.alcoholSelector = document.querySelector("#alcohol-select");
cocktailApp.toggle = document.querySelector(".toggle");
cocktailApp.drinkName = document.querySelector(".drinkName");

// establishing methods ---
// method to filter through an array for all ingredients/measurements and return only those with values:
cocktailApp.parseArray = function (baseArray, pushArray, inclusion, object) {
    const currentArray = baseArray.filter((each) => each.includes(inclusion));
    currentArray.forEach((currentItem) => {
        if (object[currentItem]) {
            pushArray.push(object[currentItem])
        };
    });
};



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
                // CONSIDER: add "drinksArray" to the global scope to be used again in the "That's Not It" button 
                // CONSIDER: would need to empty array before use
                // either array = []; OR array.length = 0;
                const drinksArray = Array.from(jsonResult.drinks);
                const randomDrink = drinksArray[Math.floor(Math.random() * drinksArray.length)];
                console.log(drinksArray);
                // print drink name to page:
                cocktailApp.drinkName.textContent = randomDrink.strDrink;
                cocktailApp.currentDrink = randomDrink.idDrink;
                // adjust searchParams for current drink recipe:
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
                cocktailApp.currentDrink = randomDrink.idDrink;
                cocktailApp.recipeUrl.search = new URLSearchParams({
                    i: cocktailApp.currentDrink
                });
            });
    };
    // show results section
})

cocktailApp.toggle.addEventListener("click", function() {
    // if :checked 
    //      set to mocktail;
    //      disable alcohol selector;
    // else 
    //      set to cocktail
    if (cocktailApp.toggle.checked) {
        console.log("yes");
        cocktailApp.currentUrl = cocktailApp.mocktailUrl;
        cocktailApp.alcoholSelector.disabled = true;
        // ADD: set alcoholSelector value to null (otherwise will still hold a value if an alcohol is chosen before toggle is clicked)
    } else {
        cocktailApp.currentUrl = cocktailApp.randomUrl;
        cocktailApp.alcoholSelector.disabled = false;
    }
    // in CSS: move toggle;
    // in CSS: grey out alcohol selector;
});

cocktailApp.revealButton.addEventListener("click", function () {
    fetch(cocktailApp.recipeUrl)
        .then((response) => {
            return response.json();
        }).then((jsonResult) => {
            const drinkDetails = jsonResult.drinks[0];
            const newArray = Object.keys(drinkDetails);
            console.log(jsonResult.drinks[0]);

            // Reset the ingredients and measurements arrays
            cocktailApp.ingredients = [];
            cocktailApp.measurements = [];

            cocktailApp.parseArray(newArray, cocktailApp.ingredients, "strIngredient", drinkDetails);
            cocktailApp.parseArray(newArray, cocktailApp.measurements, "strMeasure", drinkDetails);
            // print instructions to page
            document.querySelector('.instructionList').textContent = drinkDetails.strInstructions;
            // print ingredients & measurements to page

            const ingredientList = document.querySelector(".ingredientList");

            // Reset the ingredient list
            while (ingredientList.firstChild) {
                ingredientList.firstChild.remove()
            }

            cocktailApp.ingredients.forEach((ingredient, index) => {
                const measurement = cocktailApp.measurements[index];

                const listElement = document.createElement('li');

                const measurementSpan = document.createElement('span');
                measurementSpan.textContent = measurement;
                measurementSpan.classList.add('measurements');

                listElement.appendChild(measurementSpan);

                const ingredientText = document.createTextNode(` ${ingredient}`);

                listElement.appendChild(ingredientText);


                // <li><span class="measurements">2 oz</span> Rum</li>

                ingredientList.appendChild(listElement);
            })

            console.log(cocktailApp.measurements);
            console.log(cocktailApp.ingredients);

            // hide buttonContainer
            // show recipe section
        });
});

// ADD EVENT LISTENER FOR RANDOMIZE BUTTON: 
// Gives new drink based on current selections
// CONSIDER: using a global scope drinksArray

