declare const categories: {
    categories: ({
        "Art and culture": {
            "Indian Art Forms": {
                "Indian Paintings": string[];
                "Dances in India": string[];
                Music: string[];
                Puppetry: string[];
                Pottery: string[];
                "Drama/Theatre": string[];
                "Martial Arts": string[];
                "Visual Art": string[];
                "Bhakti & Sufi Movements": string[];
            };
            Literature: {
                "Classical Sanskrit Literature": string[];
                "Ancient Buddhist Literature": never[];
                "Ancient Jainism Literature": never[];
                "Early Dravidian Literature (eg Sangam Period)": never[];
                "Medieval Literature": never[];
                "Trends in Medieval Literature": never[];
                "Modern Indian Literature": never[];
            };
            Architecture: {
                "Harappan Architecture": never[];
                "Mauryan Architecture": never[];
                "Post-Mauryan Period Gupta Period": never[];
                "Temple Architecture": string[];
                "Cave Architecture": string[];
                "Medieval and Indo-Islamic Architecture": string[];
                "Colonial Architecture & Modern Architecture": string[];
                "Contribution of Buddhism & Jainism to the Development of Indian Architecture": never[];
                "Rock Cut Architecture": string[];
            };
        };
        "Ancient History": {
            "Pre-Historic": string[];
            "Indus Valley Civilization (IVC)": string[];
            "Vedic Society": string[];
            "Pre-Mauryan Period": string[];
            "Jainism and Buddhism": string[];
            "Mauryan Empire": string[];
            "Post-Mauryan India": string[];
        };
        "Medieval History"?: undefined;
        "Modern History"?: undefined;
        "Post-independence India"?: undefined;
        "World History"?: undefined;
        "Indian Society"?: undefined;
        "World and Indian Geography"?: undefined;
        "Distribution of Key Natural Resources across the world"?: undefined;
        "Factors responsible for the location of primary, secondary, and tertiary sector industries in various parts of the world"?: undefined;
        "Important Geophysical Phenomena"?: undefined;
    } | {
        "Medieval History": {
            "Delhi Sultanate": string[];
            "Struggle for Empire in North India (Afghans, Rajputs and Mughals)": never[];
            Mughals: string[];
            "Sur Dynasties": never[];
            "Maratha Empire": never[];
            "Deccan Sultanate": string[];
        };
        "Art and culture"?: undefined;
        "Ancient History"?: undefined;
        "Modern History"?: undefined;
        "Post-independence India"?: undefined;
        "World History"?: undefined;
        "Indian Society"?: undefined;
        "World and Indian Geography"?: undefined;
        "Distribution of Key Natural Resources across the world"?: undefined;
        "Factors responsible for the location of primary, secondary, and tertiary sector industries in various parts of the world"?: undefined;
        "Important Geophysical Phenomena"?: undefined;
    } | {
        "Modern History": {
            "Important Modern History Events Before 1857": string[];
            "Revolt of 1857": string[];
            "Growth of Nationalism in India (1858-1905)": string[];
            "Growth of Militant Nationalism & Revolutionary Activities (1905-1918)": string[];
            "Beginning of Mass Nationalism (1919-1939)": string[];
            "Towards Freedom & Partition (1939-1947)": string[];
        };
        "Art and culture"?: undefined;
        "Ancient History"?: undefined;
        "Medieval History"?: undefined;
        "Post-independence India"?: undefined;
        "World History"?: undefined;
        "Indian Society"?: undefined;
        "World and Indian Geography"?: undefined;
        "Distribution of Key Natural Resources across the world"?: undefined;
        "Factors responsible for the location of primary, secondary, and tertiary sector industries in various parts of the world"?: undefined;
        "Important Geophysical Phenomena"?: undefined;
    } | {
        "Post-independence India": {
            "Nation Building": (string | {
                "Linguistic Regionalism in India": never[];
            })[];
            "Foreign Policy": string[];
            Economy: string[];
            Polity: string[];
            Social: (string | {
                "Indian Women Since Independence": string[];
            })[];
            "Post-Independence Policy of Science And Technology": string[];
        };
        "Art and culture"?: undefined;
        "Ancient History"?: undefined;
        "Medieval History"?: undefined;
        "Modern History"?: undefined;
        "World History"?: undefined;
        "Indian Society"?: undefined;
        "World and Indian Geography"?: undefined;
        "Distribution of Key Natural Resources across the world"?: undefined;
        "Factors responsible for the location of primary, secondary, and tertiary sector industries in various parts of the world"?: undefined;
        "Important Geophysical Phenomena"?: undefined;
    } | {
        "World History": {
            "Beginning of the Modern World": (string | {
                "American War of Independence": string[];
                "French Revolution"?: undefined;
                "Nationalism in Europe"?: undefined;
                "Rise of Capitalism, Colonialism & Imperialism"?: undefined;
            } | {
                "French Revolution": string[];
                "American War of Independence"?: undefined;
                "Nationalism in Europe"?: undefined;
                "Rise of Capitalism, Colonialism & Imperialism"?: undefined;
            } | {
                "Nationalism in Europe": string[];
                "American War of Independence"?: undefined;
                "French Revolution"?: undefined;
                "Rise of Capitalism, Colonialism & Imperialism"?: undefined;
            } | {
                "Rise of Capitalism, Colonialism & Imperialism": string[];
                "American War of Independence"?: undefined;
                "French Revolution"?: undefined;
                "Nationalism in Europe"?: undefined;
            })[];
            "World War I": (string | {
                "Russian Revolution": string[];
            })[];
            "World Between the Two Wars": string[];
            "World War II": string[];
            "Decolonialisation & Redrawal of National Boundaries": string[];
            "Concept, Types & Social Impact of Political Philosophies": string[];
        };
        "Art and culture"?: undefined;
        "Ancient History"?: undefined;
        "Medieval History"?: undefined;
        "Modern History"?: undefined;
        "Post-independence India"?: undefined;
        "Indian Society"?: undefined;
        "World and Indian Geography"?: undefined;
        "Distribution of Key Natural Resources across the world"?: undefined;
        "Factors responsible for the location of primary, secondary, and tertiary sector industries in various parts of the world"?: undefined;
        "Important Geophysical Phenomena"?: undefined;
    } | {
        "Indian Society": {
            "Salient features of Indian Society, Diversity of India": string[];
            "Role of Women and Women\u2019s Organization": (string | {
                "19th Century Social Reform Movements and Early Women's Organisations": string[];
            })[];
            "Population and Associated Issues": string[];
            "Poverty and Developmental Issues": (string | {
                "Consequences of Poverty": string[];
            })[];
            "Urbanization, their problems and their remedies": string[];
            "Effects of Globalization on Indian society": string[];
            "Social Empowerment": string[];
            Communalism: string[];
            Regionalism: string[];
            Secularism: string[];
        };
        "Art and culture"?: undefined;
        "Ancient History"?: undefined;
        "Medieval History"?: undefined;
        "Modern History"?: undefined;
        "Post-independence India"?: undefined;
        "World History"?: undefined;
        "World and Indian Geography"?: undefined;
        "Distribution of Key Natural Resources across the world"?: undefined;
        "Factors responsible for the location of primary, secondary, and tertiary sector industries in various parts of the world"?: undefined;
        "Important Geophysical Phenomena"?: undefined;
    } | {
        "World and Indian Geography": {
            Geomorphology: string[];
            Oceanography: string[];
            Climatology: string[];
            "Soil Geography": string[];
        };
        "Distribution of Key Natural Resources across the world": {
            "Types of Resources": string[];
            "Land Resources": string[];
            "Forest Resources": string[];
            "Water Resources": string[];
            "Agricultural Resources": string[];
            "Mineral & Energy Resources": string[];
        };
        "Factors responsible for the location of primary, secondary, and tertiary sector industries in various parts of the world": {
            "Classification of Industries": never[];
            "Location & Distribution of the Industries on the Basis of": string[];
            "Distribution of Major Industries \u2013 Iron & Steel, IT, Cotton Textile": never[];
            "Agglomeration & Footloose Industries": never[];
        };
        "Important Geophysical Phenomena": {
            Earthquakes: string[];
            Tsunami: string[];
            Volcanoes: string[];
            Cyclone: string[];
            "Factors Causing Changes in Critical Geographical Features": never[];
            "Examples of Changing Geographical Features": string[];
            "Impact of Changing Geographical Features": never[];
            "Physical Geography of India": string[];
            "Human Geography": string[];
            "Economic Geography": string[];
        };
        "Art and culture"?: undefined;
        "Ancient History"?: undefined;
        "Medieval History"?: undefined;
        "Modern History"?: undefined;
        "Post-independence India"?: undefined;
        "World History"?: undefined;
        "Indian Society"?: undefined;
    })[];
};
export default categories;
