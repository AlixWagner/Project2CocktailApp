// Create an init method 

// App Object:
const cocktailApp = {};
// Setting up fetch API urls:
// initial call by users drink choice:
cocktailApp.alcoholUrl = new URL("https://www.thecocktaildb.com/api/json/v2/9973533/filter.php");
cocktailApp.alcoholUrl.search = new URLSearchParams({});
// secondary call for the recipe: 
cocktailApp.recipeUrl = new URL("https://www.thecocktaildb.com/api/json/v1/1/lookup.php");
cocktailApp.recipeUrl.search = new URLSearchParams({});
// call for random alcoholic drink:
cocktailApp.randomUrl = new URL("https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic");
// call if non-alcoholic toggled:
cocktailApp.mocktailUrl = new URL("https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic");
// search url
cocktailApp.searchUrl = new URL("https://www.thecocktaildb.com/api/json/v1/1/search.php");
cocktailApp.searchUrl.search = new URLSearchParams({});
// base url for the submit button - adjusted if non-alcoholic is toggled.
cocktailApp.currentUrl = cocktailApp.randomUrl;

// ESTABLISHING VARIABLES, etc. ---
cocktailApp.currentDrink;
cocktailApp.drinksArray = [];
cocktailApp.ingredients = [];
cocktailApp.measurements = [];
cocktailApp.tellMeButton = document.querySelector(".submit");
cocktailApp.revealButton = document.querySelector(".reveal");
cocktailApp.randomButton = document.querySelector(".randomize");
cocktailApp.resultsContainer = document.querySelector(".results");
cocktailApp.drinkReveal = document.querySelector(".resultsContainer");
cocktailApp.buttonContainer = document.querySelector(".buttonContainer");
cocktailApp.recipeContainer = document.querySelector(".recipe");
cocktailApp.ingredientList = document.querySelector(".ingredientList");
cocktailApp.instructionList = document.querySelector(".instructionList");
cocktailApp.alcoholSelector = document.querySelector("#alcoholSelect");
cocktailApp.secondAlcoholSelector = document.querySelector("#otherAlcoholSelect");
cocktailApp.secondAlcoholLabel = document.querySelector(".otherAlcoholLabel");
cocktailApp.toggle = document.querySelector(".toggle");
cocktailApp.searchInput = document.querySelector(".searchInputField");
cocktailApp.searchForm = document.querySelector(".navMainSearch");
cocktailApp.searchButton = document.querySelector(".searchButton");
cocktailApp.drinkName = document.querySelector(".drinkName");
cocktailApp.drinkImage = document.querySelector(".drinkImage");
cocktailApp.span = document.querySelector(".scrollToTop");
cocktailApp.error = document.querySelector(".error");

// ESTABLISHING METHODS ---
// method to filter through an array for all ingredients/measurements and return only those with values:
cocktailApp.parseArray = function (baseArray, pushArray, inclusion, object) {
    const currentArray = baseArray.filter((each) => each.includes(inclusion));
    currentArray.forEach((currentItem) => {
        if (object[currentItem]) {
            pushArray.push(object[currentItem])
        };
    });
};
// method to reset recipe container:
cocktailApp.resetRecipeContainer = function () {
    document.querySelector('.instructionList').textContent = "";
    const ingredientList = document.querySelector(".ingredientList");
    // loop to clear ingredient ul 
    while (ingredientList.firstChild) {
        ingredientList.firstChild.remove()
    }
    // reset image preview
};
// method to soften elements entry onto page:
cocktailApp.fadeIn = function(element, interval) {  
    let opacity = 0
    element.style.opacity = opacity;
    if (element === cocktailApp.drinkReveal) {
        element.style.display = 'flex';
    } else {
        element.style.display = 'block';
    }
    const fade = setInterval(function () {
        if (opacity >= 1) {
            clearInterval(fade);
        }
        opacity = opacity + 0.1
        element.style.opacity = opacity;
    }, interval);
};
// method to soften the alcohol elements entry to page:
cocktailApp.selectorFadeIn = function (element, interval) {
    let opacity = 0
    element.style.opacity = opacity;
    const fade = setInterval(function () {
        if (opacity >= 1) {
            clearInterval(fade);
        }
        opacity = opacity + 0.1
        element.style.opacity = opacity;
    }, interval);
};
// method to soften elements entry onto page:
cocktailApp.fadeOut = function (element, interval) {
    let opacity = 1
    element.style.opacity = opacity;
    const fade = setInterval(function () {
        if (opacity <= 0) {
            clearInterval(fade);
            element.style.display = 'none';
        }
        opacity = opacity - 0.1
        element.style.opacity = opacity;
    }, interval);
};
// method to soften the alcohol elements entry onto page:
cocktailApp.selectorFadeOut = function (element, interval) {
    let opacity = 1
    element.style.opacity = opacity;
    const fade = setInterval(function () {
        if (opacity <= 0) {
            clearInterval(fade);
        }
        opacity = opacity - 0.1
        element.style.opacity = opacity;
    }, interval);
};
// method to print drink name and image to page:
cocktailApp.showDrinkPreview = function(drink) {
    while (cocktailApp.drinkImage.firstChild) {
        cocktailApp.drinkImage.firstChild.remove()
    }
    const imagePreview = document.createElement('img');
    imagePreview.setAttribute('src', `${drink.strDrinkThumb}/preview`)
    document.querySelector('.drinkImage').appendChild(imagePreview);
    cocktailApp.drinkName.textContent = drink.strDrink;
    cocktailApp.currentDrink = drink.idDrink;
    cocktailApp.fadeIn(cocktailApp.resultsContainer, 1);
    cocktailApp.fadeIn(cocktailApp.buttonContainer, 1);
    cocktailApp.fadeIn(cocktailApp.drinkReveal, 20);
    cocktailApp.fadeIn(cocktailApp.drinkName, 20);
    cocktailApp.drinkName.scrollIntoView({behavior: "smooth"});
    // adjust searchParams for current drink recipe:
    cocktailApp.recipeUrl.search = new URLSearchParams({
        i: cocktailApp.currentDrink
    });
}
// method to take user input and find a random drink:
cocktailApp.chooseDrink = function (event) {
    event.preventDefault();
    cocktailApp.fadeOut(cocktailApp.recipeContainer, 5);
    cocktailApp.fadeOut(cocktailApp.ingredientList, 5);
    cocktailApp.fadeOut(cocktailApp.instructionList, 5);
    // establish users alcohol choices:
    const userAlcohol = cocktailApp.alcoholSelector.value;
    const secondUserAlcohol = cocktailApp.secondAlcoholSelector.value;
    // if user has selected an alcohol:
    if (userAlcohol && secondUserAlcohol) {// selected 2 options
        cocktailApp.alcoholUrl.search = new URLSearchParams({
            i: `${userAlcohol},${secondUserAlcohol}`
        });
        fetch(cocktailApp.alcoholUrl)
            .then((response) => {
                return response.json();
            }).then((jsonResult) => {
                if (jsonResult.drinks === "None Found") {
                    cocktailApp.fadeIn(cocktailApp.error);
                    cocktailApp.error.scrollIntoView({ behavior: "smooth" });
                } else {
                    cocktailApp.fadeOut(cocktailApp.error, 5);
                    cocktailApp.drinksArray = [];
                    // create an array from returned json
                    cocktailApp.drinksArray = Array.from(jsonResult.drinks);
                    // get random drink from the array
                    const randomDrink = cocktailApp.drinksArray[Math.floor(Math.random() * cocktailApp.drinksArray.length)];
                    // print drink name & image preview to page:
                    cocktailApp.showDrinkPreview(randomDrink);
                }
            });
    } else if (userAlcohol) {// selected 1 option
        cocktailApp.fadeOut(cocktailApp.error, 5);
        // add that alcohol as a search parameter
        cocktailApp.alcoholUrl.search = new URLSearchParams({
            i: userAlcohol
        });
        fetch(cocktailApp.alcoholUrl)
            .then((response) => {
                return response.json();
            }).then((jsonResult) => {
                cocktailApp.drinksArray = [];
                // create an array from returned json
                cocktailApp.drinksArray = Array.from(jsonResult.drinks);
                // get random drink from the array
                const randomDrink = cocktailApp.drinksArray[Math.floor(Math.random() * cocktailApp.drinksArray.length)];
                // print drink name & image preview to page:
                cocktailApp.showDrinkPreview(randomDrink);
            });
    } else { // if no alcohol was selected by the user:
        cocktailApp.fadeOut(cocktailApp.error, 5);
        fetch(cocktailApp.currentUrl)
            .then((response) => {
                return response.json();
            }).then((jsonResult) => {
                cocktailApp.drinksArray = [];
                // create an array from returned json
                cocktailApp.drinksArray = Array.from(jsonResult.drinks);
                // get random drink from the array
                const randomDrink = cocktailApp.drinksArray[Math.floor(Math.random() * cocktailApp.drinksArray.length)];
                console.log(cocktailApp.drinksArray);
                // print drink name & image preview to page:
                cocktailApp.showDrinkPreview(randomDrink);
            });
    };
    // clear any recipe info currently open:
    cocktailApp.resetRecipeContainer();
};
// ESTABLISHING EVENT LISTENERS ---
// eventListeners for our drink search buttons:
cocktailApp.tellMeButton.addEventListener("click", cocktailApp.chooseDrink);
cocktailApp.randomButton.addEventListener("click", cocktailApp.chooseDrink);
// eventListener for non-alcoholic toggle
cocktailApp.toggle.addEventListener("click", function() {
    // smoothly hide any current recipe info
    cocktailApp.fadeOut(cocktailApp.recipeContainer, 5);
    cocktailApp.fadeOut(cocktailApp.ingredientList, 5);
    cocktailApp.fadeOut(cocktailApp.instructionList, 5);
    cocktailApp.fadeOut(cocktailApp.error, 5);
    cocktailApp.fadeOut(cocktailApp.resultsContainer, 5);
    if (cocktailApp.toggle.checked) {
        // set current drink to non-alcoholic
        cocktailApp.currentUrl = cocktailApp.mocktailUrl;
        // make sure user can't add alcohol selection
        cocktailApp.alcoholSelector.disabled = true;
        cocktailApp.secondAlcoholSelector.disabled = true;
        // ensure that if any alcohol was selected it's unselected:
        cocktailApp.alcoholSelector.value = "";
        cocktailApp.secondAlcoholSelector.value = "";
        // check if 2nd alcohol selector is visible - if so hide
        if (cocktailApp.secondAlcoholLabel.style.opacity > 0) {
            cocktailApp.selectorFadeOut(cocktailApp.secondAlcoholLabel, 5)
            cocktailApp.selectorFadeOut(cocktailApp.secondAlcoholSelector, 5)
        }
    } else {
        // set current drink back to alcoholic
        cocktailApp.currentUrl = cocktailApp.randomUrl;
        // re-enable alcohol selectors for users
        cocktailApp.alcoholSelector.disabled = false;
        cocktailApp.secondAlcoholSelector.disabled = false;
    }
});
// eventListener for alcohol selector:
cocktailApp.alcoholSelector.addEventListener("change", function() {
    // smoothly hide any current recipe info
    cocktailApp.fadeOut(cocktailApp.recipeContainer, 5);
    cocktailApp.fadeOut(cocktailApp.ingredientList, 5);
    cocktailApp.fadeOut(cocktailApp.instructionList, 5);
    cocktailApp.fadeOut(cocktailApp.error, 5);
    cocktailApp.fadeOut(cocktailApp.resultsContainer, 5);
    // show second alcohol alcohol selector when user has selected an alcohol
    if (cocktailApp.alcoholSelector.value) {
        cocktailApp.selectorFadeIn(cocktailApp.secondAlcoholLabel, 10)
        cocktailApp.selectorFadeIn(cocktailApp.secondAlcoholSelector, 10)
    } else {// hide second alcohol selector when no alcohol selected
        cocktailApp.selectorFadeOut(cocktailApp.secondAlcoholLabel, 5)
        cocktailApp.selectorFadeOut(cocktailApp.secondAlcoholSelector, 5)
        cocktailApp.secondAlcoholSelector.value = "";
    } 
});
// eventListener for second alcohol selector:
cocktailApp.secondAlcoholSelector.addEventListener("change", function () {
    // smoothly hide any current recipe info
    cocktailApp.fadeOut(cocktailApp.recipeContainer, 5);
    cocktailApp.fadeOut(cocktailApp.ingredientList, 5);
    cocktailApp.fadeOut(cocktailApp.instructionList, 5);
    cocktailApp.fadeOut(cocktailApp.error, 5);
    cocktailApp.fadeOut(cocktailApp.resultsContainer, 5);
})
// eventListener for Let's Make This button:
cocktailApp.revealButton.addEventListener("click", function () {
    // when drink is chosen hide buttons before showing recipe
    cocktailApp.fadeOut(cocktailApp.buttonContainer, 1);
    fetch(cocktailApp.recipeUrl)
        .then((response) => {
            return response.json();
        }).then((jsonResult) => {
            const drinkDetails = jsonResult.drinks[0];
            // make an array from the returned object so that we can loop through them:
            const newArray = Object.keys(drinkDetails);
            console.log(jsonResult.drinks[0]);
            // Reset the ingredients and measurements arrays
            cocktailApp.ingredients = [];
            cocktailApp.measurements = [];
            // establish ingredients and measurements for current drink:
            cocktailApp.parseArray(newArray, cocktailApp.ingredients, "strIngredient", drinkDetails);
            cocktailApp.parseArray(newArray, cocktailApp.measurements, "strMeasure", drinkDetails);
            // reset recipe container content:
            cocktailApp.resetRecipeContainer();
            // print instructions to page
            document.querySelector('.instructionList').textContent = drinkDetails.strInstructions;
            // print ingredients & measurements to page
            const ingredientList = document.querySelector(".ingredientList");
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
            // TimeOut for styling purposes ---
            // Allows button container to leave page before instructions load in to avoid content jumping on the page
            setTimeout(function() {
                cocktailApp.fadeIn(cocktailApp.recipeContainer, 10);
                cocktailApp.fadeIn(cocktailApp.instructionList, 15);
                cocktailApp.fadeIn(cocktailApp.ingredientList, 15);
                cocktailApp.recipeContainer.scrollIntoView({ behavior: "smooth" });
            }, 100)
            // hide buttonContainer
            // show recipe section
        });
});
// eventListener for search form submit:
cocktailApp.searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    cocktailApp.fadeOut(cocktailApp.recipeContainer, 5);
    cocktailApp.fadeOut(cocktailApp.ingredientList, 5);
    cocktailApp.fadeOut(cocktailApp.instructionList, 5);
    const searchTerm = cocktailApp.searchInput.value.replaceAll(" ", "_");
    cocktailApp.searchUrl.search = new URLSearchParams({
        s: searchTerm
    });
    fetch(cocktailApp.searchUrl).then((response) => {
        return response.json();
    }).then((jsonResult) => {
        if (jsonResult.drinks === null) {
            cocktailApp.fadeOut(cocktailApp.resultsContainer, 5);
            cocktailApp.fadeIn(cocktailApp.error);
            cocktailApp.error.scrollIntoView({ behavior: "smooth" }); 
        } else {
            cocktailApp.fadeOut(cocktailApp.error, 5);
            const drink = jsonResult.drinks[0];
            // Update UI to show the drink recipe
            cocktailApp.showDrinkPreview(drink);
        }
    });
});
