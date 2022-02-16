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
cocktailApp.drinksArray = [];
cocktailApp.ingredients = [];
cocktailApp.measurements = [];
cocktailApp.tellMeButton = document.querySelector(".submit");
cocktailApp.revealButton = document.querySelector(".reveal");
cocktailApp.randomButton = document.querySelector(".randomize");
cocktailApp.resultsContainer = document.querySelector(".results");
cocktailApp.buttonContainer = document.querySelector(".buttonContainer");
cocktailApp.recipeContainer = document.querySelector(".recipe");
cocktailApp.ingredientList = document.querySelector(".ingredientList");
cocktailApp.instructionList = document.querySelector(".instructionList");
cocktailApp.alcoholSelector = document.querySelector("#alcoholSelect");
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
// method to reset recipe container:
cocktailApp.resetRecipeContainer = function () {
    document.querySelector('.instructionList').textContent = "";
    const ingredientList = document.querySelector(".ingredientList");
    // loop to clear ingredient ul 
    while (ingredientList.firstChild) {
        ingredientList.firstChild.remove()
    }
    // reset image preview
    const imagePreview = document.querySelector('.drinkImage').firstChild;
    if (imagePreview) {
        imagePreview.remove();
    }
};
// method to soften elements entry onto page:
cocktailApp.fadeIn = function(element, interval) {  
    let opacity = 0
    element.style.opacity = opacity;
    element.style.display = 'block';
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


// method to take user input and find a random drink:
cocktailApp.chooseDrink = function (event) {
    event.preventDefault();
    cocktailApp.fadeOut(cocktailApp.recipeContainer, 5);
    cocktailApp.fadeOut(cocktailApp.ingredientList, 5);
    cocktailApp.fadeOut(cocktailApp.instructionList, 5);
    const userAlcohol = cocktailApp.alcoholSelector.value;
    // if user has selected an alcohol:
    if (userAlcohol) {
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
                // print drink name to page:
                cocktailApp.drinkName.textContent = randomDrink.strDrink;
                cocktailApp.currentDrink = randomDrink.idDrink;
                cocktailApp.fadeIn(cocktailApp.resultsContainer, 1);
                cocktailApp.fadeIn(cocktailApp.buttonContainer, 1);
                cocktailApp.fadeIn(cocktailApp.drinkName, 20);
                cocktailApp.drinkName.scrollIntoView({behavior: "smooth"});
                // adjust searchParams for current drink recipe:
                cocktailApp.recipeUrl.search = new URLSearchParams({
                    i: cocktailApp.currentDrink
                });
            });
    } else { // if no alcohol was selected by the user:
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
                // print drink name to page:
                cocktailApp.drinkName.textContent = randomDrink.strDrink;
                cocktailApp.currentDrink = randomDrink.idDrink;
                cocktailApp.fadeIn(cocktailApp.resultsContainer, 1);
                cocktailApp.fadeIn(cocktailApp.buttonContainer, 1);
                cocktailApp.fadeIn(cocktailApp.drinkName, 20);
                cocktailApp.drinkName.scrollIntoView({ behavior: "smooth" });
                // adjust searchParams for current drink recipe:
                cocktailApp.recipeUrl.search = new URLSearchParams({
                    i: cocktailApp.currentDrink
                });
            });
    };
    // clear any recipe info currently open:
    cocktailApp.resetRecipeContainer();
};

// eventListeners for all our buttons:
cocktailApp.tellMeButton.addEventListener("click", cocktailApp.chooseDrink);
cocktailApp.randomButton.addEventListener("click", cocktailApp.chooseDrink);
// eventListener for non-alcoholic toggle
cocktailApp.toggle.addEventListener("click", function() {
    cocktailApp.fadeOut(cocktailApp.recipeContainer, 5);
    cocktailApp.fadeOut(cocktailApp.ingredientList, 5);
    cocktailApp.fadeOut(cocktailApp.instructionList, 5);
    cocktailApp.fadeOut(cocktailApp.resultsContainer, 5);
    if (cocktailApp.toggle.checked) {
        cocktailApp.currentUrl = cocktailApp.mocktailUrl;
        cocktailApp.alcoholSelector.disabled = true;
        // ensure that is any alcohol was selected it's unselected:
        cocktailApp.alcoholSelector.value = "";
    } else {
        cocktailApp.currentUrl = cocktailApp.randomUrl;
        cocktailApp.alcoholSelector.disabled = false;
    }
});
// eventListener for alcohol selector:
cocktailApp.alcoholSelector.addEventListener("change", function() {
    cocktailApp.fadeOut(cocktailApp.recipeContainer, 5);
    cocktailApp.fadeOut(cocktailApp.ingredientList, 5);
    cocktailApp.fadeOut(cocktailApp.instructionList, 5);
    cocktailApp.fadeOut(cocktailApp.resultsContainer, 5);
})

// eventListener for Let's Make This button:
cocktailApp.revealButton.addEventListener("click", function () {
    cocktailApp.fadeOut(cocktailApp.buttonContainer, 1);
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
            // establish ingredients and measurements for current drink:
            cocktailApp.parseArray(newArray, cocktailApp.ingredients, "strIngredient", drinkDetails);
            cocktailApp.parseArray(newArray, cocktailApp.measurements, "strMeasure", drinkDetails);
            // reset recipe container content:
            cocktailApp.resetRecipeContainer();
            // show image preview
            const imagePreview = document.createElement('img');
            imagePreview.setAttribute('src', `${drinkDetails.strDrinkThumb}/preview`)
            document.querySelector('.drinkImage').appendChild(imagePreview);


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
