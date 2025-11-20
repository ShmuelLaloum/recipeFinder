document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const results = document.getElementById("results");

    function showToast(message) {
        Toastify({
            text: message,
            duration: 3000, 
            gravity: "bottom", 
            position: "center",
            backgroundColor: "#333",
            stopOnFocus: true,
        }).showToast();
    }

    async function fetchMeals(searchTerm) {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
            const data = await response.json();
            return data.meals;
        } catch (error) {
            showToast("שגיאה בטעינת הנתונים"+error);
            return null;
        }
    }

    function displayMeals(meals) {
        results.innerHTML = "";   

        if (!meals || meals.length === 0) {
            showToast("לא נמצאו תוצאות");
            return;
        }

    meals.forEach(meal => {
    const card = document.createElement("div");
    card.classList.add("recipe-card");

    let isOpen = false;

    card.innerHTML = `
        <h3>${meal.strMeal}</h3>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <p>קטגוריה: ${meal.strCategory}</p>
    `;

    card.addEventListener("click", () => {
        if (!isOpen) {
            let ingredients = "";
            for (let i = 1; i <= 20; i++) {
                const ingredient = meal[`strIngredient${i}`];
                const measure = meal[`strMeasure${i}`];
                if (ingredient && ingredient.trim() !== "") {
                    ingredients += `${ingredient} - ${measure}<br>`;
                }
            }

            card.innerHTML = `
                <h3>${meal.strMeal}</h3>
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <p>קטגוריה: ${meal.strCategory}</p>
                <h4>מרכיבים:</h4>
                <p>${ingredients}</p>
                <h4>הוראות:</h4>
                <p>${meal.strInstructions}</p>
            `;
            isOpen = true;
        } else {
            card.innerHTML = `
                <h3>${meal.strMeal}</h3>
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <p>קטגוריה: ${meal.strCategory}</p>
            `;
            isOpen = false;
        }
        });

    results.appendChild(card);
        });

    }

    searchBtn.addEventListener("click", async () => {
    const term = searchInput.value.trim();
    if (!term) {
        showToast("אנא הזן מאכל");
        return;
    }

    results.innerHTML = "<p>טוען מתכונים...</p>";

    const meals = await fetchMeals(term);
    displayMeals(meals);
    });

});
