window.addEventListener("DOMContentLoaded", () => {
    const backblaze = {
            name: "backblaze",
            min: 7.00,
            storage: 0.005,
            transfer: 0.01,
            price: null
        },
        bunny = {
            name: "bunny",
            max: 10,
            transfer: 0.01,
            price: null
        },
        scaleway = {
            name: "scaleway",
            free: 75,
            transfer: 0.02,
            price: null
        },
        vultr = {
            name: "vultr",
            min: 5,
            storage: 0.01,
            transfer: 0.01,
            price: null
        };

    let minValue,
        selectedRadio;

    const checkedRadioButton = (name) => {
        const radioButtons = document.querySelectorAll(`input[name="${name}"]`);

        for (const radioButton of radioButtons) {
            if (radioButton.checked) {
                selectedRadio = radioButton.value;
                break;
            }
        }
        return selectedRadio;
    }

    const minPriceItems = () => {
        minValue = Infinity;

        const items = document.querySelectorAll(".graph-container");

        for (let i = 0 ; i < items.length; i++) {
            minValue = +items[i].getAttribute("data-price") <= minValue ? +items[i].getAttribute("data-price") : minValue;
        }

        items.forEach(item => {
            item.getAttribute("data-price") == minValue ? item.classList.add("active") : item.classList.remove("active");
        })

    }

    const price = (provider) => {

        const div = document.querySelector(`#${provider.name}`);
        const container = div.querySelector(`#${provider.name}-container`);
        const cost = document.querySelector(`#${provider.name}-cost`);
        const storageValue = document.querySelector("#storage").value;
        const transferValue = document.querySelector("#transfer").value;


        if (provider.name === "backblaze" || provider.name === "vultr") {
            let price = (storageValue * provider.storage + transferValue * provider.transfer);

            if (price < provider.min) price = provider.min;
            provider.price = price.toFixed(2);

            container.style.width = `${(price) * 2}%`;
            cost.innerText = price.toFixed(2);
            container.setAttribute("data-price", provider.price);
        }

        if (provider.name === "bunny") {
            checkedRadioButton("radio-bunny");

            let price = (storageValue * selectedRadio + transferValue * provider.transfer);

            if (price > provider.max) price = provider.max;
            provider.price = price.toFixed(2);

            container.style.width = `${(price) * 2}%`;
            cost.innerText = (price).toFixed(2);
            container.setAttribute("data-price", provider.price);
        }

        if (provider.name === "scaleway") {
            checkedRadioButton("radio-scaleway");

            let price = ((storageValue - provider.free) <= 0 ? 0 : (storageValue - provider.free) * selectedRadio) + ((transferValue - provider.free) <= 0 ? 0 : (transferValue - provider.free) * provider.transfer);
            provider.price = price.toFixed(2);

            price = price.toFixed(2);

            container.style.width = `${price * 2}%`;
            cost.innerText = price;
            container.setAttribute("data-price", provider.price);
        }

        minPriceItems();
    };

    price(backblaze);
    price(bunny);
    price(scaleway);
    price(vultr);

    minPriceItems();

    document.querySelectorAll(".radio-button").forEach(item => {
        item.addEventListener("click", () => {
            price(bunny);
            price(scaleway);
            checkedRadioButton("radio-bunny");
            checkedRadioButton("radio-scaleway");
        });
    });

    document.querySelectorAll(".slider").forEach(item => {

        item.addEventListener("input", () => {

            const sliders = document.querySelector(`#${item.getAttribute("id")}-value`);
            sliders.innerText = item.value;

            price(backblaze);
            price(bunny);
            price(scaleway);
            price(vultr);

            minPriceItems();
        });
    });
});