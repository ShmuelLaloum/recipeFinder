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

            function createCollapsedView() {
                while (card.firstChild) card.removeChild(card.firstChild);

                const title = document.createElement("h3");
                title.textContent = meal.strMeal;

                const img = document.createElement("img");
                img.src = meal.strMealThumb;
                img.alt = meal.strMeal;

                const category = document.createElement("p");
                category.textContent = `קטגוריה: ${meal.strCategory}`;

                card.appendChild(title);
                card.appendChild(img);
                card.appendChild(category);
            }

            function createExpandedView() {
                while (card.firstChild) card.removeChild(card.firstChild);

                const title = document.createElement("h3");
                title.textContent = meal.strMeal;

                const img = document.createElement("img");
                img.src = meal.strMealThumb;
                img.alt = meal.strMeal;

                const category = document.createElement("p");
                category.textContent = `קטגוריה: ${meal.strCategory}`;

                const ingredientsTitle = document.createElement("h4");
                ingredientsTitle.textContent = "מרכיבים:";

                const ingredientsContainer = document.createElement("div");
                for (let i = 1; i <= 20; i++) {
                    const ingredient = meal[`strIngredient${i}`];
                    const measure = meal[`strMeasure${i}`];
                    if (ingredient && ingredient.trim() !== "") {
                        const line = document.createElement("p");
                        line.textContent = `${ingredient} - ${measure}`;
                        ingredientsContainer.appendChild(line);
                    }
                }

                const instructionsTitle = document.createElement("h4");
                instructionsTitle.textContent = "הוראות:";

                const instructions = document.createElement("p");
                instructions.textContent = meal.strInstructions;

                card.appendChild(title);
                card.appendChild(img);
                card.appendChild(category);
                card.appendChild(ingredientsTitle);
                card.appendChild(ingredientsContainer);
                card.appendChild(instructionsTitle);
                card.appendChild(instructions);
            }

            createCollapsedView();

            card.addEventListener("click", () => {
                if (!isOpen) {
                    createExpandedView();
                    isOpen = true;
                } else {
                    createCollapsedView();
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

        results.innerHTML = "";
        const loading = document.createElement("p");
        loading.textContent = "טוען מתכונים...";
        results.appendChild(loading);

        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
            const data = await response.json();
            const meals = data.meals;

            results.innerHTML = "";   

            if (!meals) {
                showToast("לא נמצאו תוצאות");
                return;
            }

            displayMeals(meals);

        } catch (error) {
            results.innerHTML = "";
            showToast("שגיאה בטעינת הנתונים: " + error);
        }
    });

});
