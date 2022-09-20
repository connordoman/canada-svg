document.addEventListener("DOMContentLoaded", (event) => {
    const FLAG_URL_STUB = "../res/img/flags/Flag_of_";
    const WIKI_URL_STUB = "https://en.wikipedia.org/wiki/";

    const PROVINCE_ABBR = [
        "BC",
        "AB",
        "SK",
        "MB",
        "ON",
        "QC",
        "NB",
        "NS",
        "PE",
        "NL",
        "YT",
        "NT",
        "NU",
    ];

    const PROVINCE_NAMES = [
        "British Columbia",
        "Alberta",
        "Saskatchewan",
        "Manitoba",
        "Ontario",
        "Quebec",
        "New Brunswick",
        "Nova Scotia",
        "Prince Edward Island",
        "Newfoundland and Labrador",
        "Yukon",
        "Northwest Territories",
        "Nunavut",
    ];

    const PROVINCE_DESCRIPTIONS = [
        "British Columbia is a western Canadian province with a landscape of mountains, forests and rugged coastline. In the north, Vancouver Island and the Gulf Islands are popular recreation destinations. The city of Vancouver is a major seaport surrounded by mountains, and also has thriving art, theatre and music scenes. Victoria, on the southern tip of Vancouver Island, is the provincial capital.",
        "Alberta is a western Canadian province with terrain encompassing the Rocky Mountains, prairies and desert badlands. Calgary, the provincial capital, is a business and cultural hub with a vibrant downtown. The city of Edmonton, on the North Saskatchewan River, is home to the Royal Alberta Museum, displaying local and indigenous history. Banff National Park, in the Rocky Mountains, is a popular year-round destination for skiing, hiking and wildlife viewing.",
        "Saskatchewan is a prairie and boreal forest province in western Canada, with numerous lakes and rivers. It's known for its diverse geography, from the northern boreal forest and grasslands to the southern prairies. Regina, the capital, is home to the Royal Saskatchewan Museum, with exhibits on natural history and First Nations culture. The province is also home to the northern town of La Ronge, a gateway to the boreal forest and the northern lights.",
        "Manitoba is a prairie and boreal forest province in western Canada, with numerous lakes and rivers. It's known for its diverse geography, from the northern boreal forest and grasslands to the southern prairies. Winnipeg, the capital, is home to the Royal Manitoba Museum, with exhibits on natural history and First Nations culture. The province is also home to the northern town of La Ronge, a gateway to the boreal forest and the northern lights.",
        "Ontario is a central Canadian province with diverse geography. It's home to the vast, forested Lake Superior basin, the Niagara Escarpment, a popular destination for rock-climbing and hiking, and the North Channel, a 30,000-island boating route. Toronto, the provincial capital, is a dynamic metropolis with a core of soaring skyscrapers, all dwarfed by the iconic, free-standing CN Tower.",
        "Quebec is a large province in eastern Canada, bordered by Ontario to the west and the Atlantic Ocean to the east. It's known for its French-speaking culture, which was established by settlers from France. Quebec City, the provincial capital, is home to the Château Frontenac, a grand hotel overlooking the St. Lawrence River. The city is also known for its winter carnival, held each February.",
        "New Brunswick is a Canadian province on the Atlantic coast. It's known for its French-speaking culture, which was established by settlers from France. The province's capital, Fredericton, is home to the Beaverbrook Art Gallery, with a collection of Canadian art. The city of Saint John, on the Bay of Fundy, is known for its historic architecture and the Reversing Rapids, where the tides flow upstream.",
        "Nova Scotia is a Canadian province on the Atlantic coast. It's known for its French-speaking culture, which was established by settlers from France. The province's capital, Halifax, is home to the Maritime Museum of the Atlantic, with exhibits on the region's history. The city is also known for its Victorian architecture, including the Halifax Citadel, a star-shaped fort built in the 1800s.",
        "Prince Edward Island is a Canadian province on the Atlantic coast. It's known for its French-speaking culture, which was established by settlers from France. The province's capital, Charlottetown, is home to the Confederation Centre of the Arts, with a theatre and art gallery. The city is also known for its Victorian architecture, including the Charlottetown Conference Centre, a star-shaped fort built in the 1800s.",
        "Newfoundland and Labrador is a Canadian province on the Atlantic coast. It's known for its French-speaking culture, which was established by settlers from France. The province's capital, St. John's, is home to the Confederation Centre of the Arts, with a theatre and art gallery. The city is also known for its Victorian architecture, including the Charlottetown Conference Centre, a star-shaped fort built in the 1800s.",
        "Yukon is a Canadian territory in the western Arctic. It's known for its rugged landscape of mountains, glaciers and rivers. The capital, Whitehorse, is a gateway to the Klondike Gold Rush National Historic Site, a museum and park commemorating the 1898 gold rush. The territory is also home to the Yukon Wildlife Preserve, a refuge for caribou, moose and grizzly bears.",
        "Northwest Territories is a Canadian territory in the western Arctic. It's known for its rugged landscape of mountains, glaciers and rivers. The capital, Whitehorse, is a gateway to the Klondike Gold Rush National Historic Site, a museum and park commemorating the 1898 gold rush. The territory is also home to the Yukon Wildlife Preserve, a refuge for caribou, moose and grizzly bears.",
        "Nunavut is a Canadian territory in the western Arctic. It's known for its rugged landscape of mountains, glaciers and rivers. The capital, Whitehorse, is a gateway to the Klondike Gold Rush National Historic Site, a museum and park commemorating the 1898 gold rush. The territory is also home to the Yukon Wildlife Preserve, a refuge for caribou, moose and grizzly bears.",
    ];

    let provinces = {};

    let map = document.getElementById("canada-map");
    let provCard = document.getElementById("currentProvince");
    let provName = document.getElementById("provinceName");
    let provDesc = document.getElementById("provinceDescription");
    let provLink = document.getElementById("provinceLink");
    let provFlag = document.getElementById("provinceFlag");

    var selected = "";
    var lastProv = 0;

    class Province {
        static selected = "";
        static command = "";
        constructor(id, name, desc, svgDoc) {
            this.id = id;
            this.name = name;
            this.desc = desc;
            this.linkStr = this.name.replace(/\s/g, "_");
            this.svg = document.createElement("object");
            this.prepareSVGFlag();

            if (svgDoc != null) {
                this.element = svgDoc.getElementById(id);
            }
        }

        onMouseOver() {
            if (this.id !== Province.selected) {
                this.element.style.fill = "#ccc";
                this.element.style.cursor = "pointer";
            }
        }

        onMouseOut() {
            if (this.id !== Province.selected)
                this.element.style.fill = "#d3d3d3";
        }

        onClick() {
            if (this.id === Province.selected) {
                return;
            } else if (Province.selected !== "") {
                provinces[Province.selected].element.style.fill = "#d3d3d3";
            }
            provName.innerHTML = this.name;
            provDesc.innerHTML = this.desc;
            provCard.style.display = "block";
            provLink.href = WIKI_URL_STUB + this.linkStr;
            provLink.innerHTML = `Learn more about ${this.name}`;
            Province.selected = this.id;
            this.element.style.fill = "#c22";
            this.setSVGFlag();
        }

        addListeners() {
            this.element.addEventListener("mouseover", (e) =>
                this.onMouseOver(e)
            );
            this.element.addEventListener("mouseout", (e) =>
                this.onMouseOut(e)
            );
            this.element.addEventListener("click", (e) => this.onClick(e));
        }

        prepareSVGFlag() {
            this.svg.setAttribute("type", "image/svg+xml");
            this.svg.setAttribute(
                "data",
                FLAG_URL_STUB + `${this.linkStr}.svg`
            );
            this.svg.style.height = "96px";

            //Province.command += `scour -i province_flags/Flag_of_${this.linkStr}.svg -o new_province_flags/Flag_of_${this.linkStr}.svg --enable-viewboxing\n`;
        }

        setSVGFlag() {
            provFlag.textContent = "";
            provFlag.appendChild(this.svg);
        }
    }

    map.addEventListener("load", () => {
        let svgDoc = map.contentDocument;

        for (let i = 0; i < PROVINCE_ABBR.length; i++) {
            let prov = new Province(
                PROVINCE_ABBR[i],
                PROVINCE_NAMES[i],
                PROVINCE_DESCRIPTIONS[i],
                svgDoc
            );

            prov.addListeners();

            provinces[prov.id] = prov;
        }

        //console.log(Province.command);
    });
});
