document.addEventListener("DOMContentLoaded", function () {
    const bgTypeSelect = document.getElementById("sidebar-bg-type");
    const solidColorContainer = document.getElementById("solid-color-container");
    const gradientContainer = document.getElementById("gradient-color-container");
    const gradientContainer2 = document.getElementById("gradient-color-container-2");
    const solidColorInput = document.querySelector("input[name='appearance[sidebar_solid_color]']");
    const gradientColor1 = document.getElementById("gradient-color-1");
    const gradientColor2 = document.getElementById("gradient-color-2");
    // const primaryColor = document.getElementById("primary_color");
    // console.log(primaryColor.value);




    // Function to toggle display of color inputs based on selection
    function toggleColorInputs() {
        if (bgTypeSelect.value === "gradient") {
            solidColorContainer.style.display = "none"; // Hide solid color input
            gradientContainer.style.display = "flex"; // Show first gradient color
            gradientContainer2.style.display = "flex"; // Show second gradient color
            updateSidebarGradient(); // Apply gradient
        } else {
            solidColorContainer.style.display = "flex"; // Show solid color input
            gradientContainer.style.display = "none"; // Hide gradient color inputs
            gradientContainer2.style.display = "none";
            updateSidebarSolid(); // Apply solid color
        }
    }

    // Apply solid color dynamically
    function updateSidebarSolid() {
        if (solidColorInput.value) {
            document.documentElement.style.setProperty('--sidebar-background-color', solidColorInput.value);
        }
    }

    // Apply gradient colors dynamically
    function updateSidebarGradient() {
        if (gradientColor1.value && gradientColor2.value) {
            document.documentElement.style.setProperty('--sidebar-background-color',`linear-gradient(178.98deg, ${gradientColor1.value} -453.29%, ${gradientColor2.value} 91.53%)`);
        }
    }

    function updatePrimaryColor() {
        // var elements=   document.getElementsByClassName('primary_color');
        //  elements.setProperty('background_color',primaryColor.value);

    }

    // Event Listeners
    bgTypeSelect.addEventListener("change", toggleColorInputs);
    solidColorInput.addEventListener("input", updateSidebarSolid);
    gradientColor1.addEventListener("input", updateSidebarGradient);
    gradientColor2.addEventListener("input", updateSidebarGradient);
    // primaryColor.addEventListener("input", updatePrimaryColor);

    // Initialize state on page load
    toggleColorInputs();
});
$(document).ready(function () {
    $('#primary_color').on('change', function () {
        const selectedColor = $(this).val();
        document.documentElement.style.setProperty('--primary-color',selectedColor);
    });
});
$(document).ready(function () {
    $('#primary_color').on('change', function () {
        const selectedColor = $(this).val();
        document.documentElement.style.setProperty('--primary-color',selectedColor);
    });
});