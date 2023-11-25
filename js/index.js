

// Get data
const API_URL = "https://dolarapi.com/v1/dolares";

const cards_panel = document.getElementById("cards_panel");

let buy_rate = 0.0;
let sell_rate = 0.0;

async function getPricesListing() {

    const listing = [];
    let update = "-";

    try{
        const response = await fetch(API_URL);

        if(await response.ok){

            const existing_cards = cards_panel.getElementsByTagName("card");
            if(existing_cards.length != 0){
                existing_cards.forEach( (card) => card.remove());
            }

            listing.push(... await response.json());
            //console.log(listing);

            if(listing.length != 0){  
                listing.forEach((price) => {

                    /*
                    <div id="card_x">
                        <div id="type">Bolsa</div>
                        <div id="ops">
                            <div id="buy">
                                <div id="tilte">Compra</div>
                                <div id="value">U$d 123.456</div>
                            </div>
                            <div id="sell">
                                <div id="title">Venta</div>
                                <div id="value">U$d 123.456</div>
                            </div>
                        </div>
                    </div>
                    */

                    if(price.nombre === "Blue"){
                        //console.log(price);

                        const new_card = document.createElement("card");
                        new_card.id = "card";
                        
                        const type = document.createElement("div");
                        type.id = "type";
                        type.textContent = price.nombre || "-";
    
                        const ops = document.createElement("div");
                        ops.id = "ops";
                        
                        const buy = document.createElement("div");
                        buy.id = "buy";
                        
                        const buy_title = document.createElement("div");
                        buy_title.id = "title";
                        buy_title.textContent = "Compra";
    
                        const buy_value = document.createElement("div");
                        buy_value.id = "value";
                        buy_value.textContent = "AR$" + (price.compra || "-");
                        buy_rate = price.compra;

                        buy.appendChild(buy_title);
                        buy.appendChild(buy_value);
    
                        const sell = document.createElement("div");
                        sell.id = "sell";
                        
                        const sell_title = document.createElement("div");
                        sell_title.id = "title";
                        sell_title.textContent = "Venta";
    
                        const sell_value = document.createElement("div");
                        sell_value.id = "value";
                        sell_value.textContent = "AR$" + (price.venta || "-");
                        sell_rate = price.venta;

                        sell.appendChild(sell_title);
                        sell.appendChild(sell_value);
    
                        ops.appendChild(buy);
                        ops.appendChild(sell);
    
                        new_card.appendChild(type);
                        new_card.appendChild(ops);
    
                        update = new Date(price.fechaActualizacion).toLocaleDateString(
                            'es-AR',
                            {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour12: false,
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit"
                            }
                        ) || "-";
    
                        cards_panel.appendChild(new_card);
                    }


                });
            }
            const update_div = document.getElementById("update");
            update_div.textContent = "Última actualización: " + update; 
            //console.log(update); 
        }
        else{
            throw new Error(await response.error)
        }
    }
    catch(error){
        //console.error("Se ha producido un error:", error)
    }
}

// Live conversions
let ars_out_calculated = 0.0;

const usd_in = document.getElementById("usd_in");
const ars_out = document.getElementById("ars_out");

usd_in.addEventListener("keyup", () => {
    let value = parseFloat(usd_in.value);
    if(value){
        usd_in.classList.remove("input_error");
        ars_out_calculated = value * sell_rate;
    } 
    else{
        usd_in.classList.add("input_error");
        ars_out_calculated = 0.0;
    }

    ars_out.textContent = ars_out_calculated.toString();
});

let usd_out_calculated = 0.0;
const ars_in = document.getElementById("ars_in");
const usd_out = document.getElementById("usd_out");

ars_in.addEventListener("keyup", () => {
    let value = parseFloat(ars_in.value);
    if(value){
        ars_in.classList.remove("input_error");
        usd_out_calculated = value / buy_rate;
    } 
    else{
        ars_in.classList.add("input_error");
        usd_out_calculated = 0.0;
    }

    usd_out.textContent = usd_out_calculated.toString();
});


// Auto-update cada 60segs
window.onload = () => {
    getPricesListing();
    setInterval( () => {
        getPricesListing();     
    }, 60000);
};