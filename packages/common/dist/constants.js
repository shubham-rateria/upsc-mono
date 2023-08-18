import gs1Categories from './data/gs1-categories';
import gs2Categories from './data/gs2-categories';
import gs3Categories from './data/gs3-categories';
import gs4Categories from './data/gs4-categories';
import optionalsCategories from './data/optionals-categories';
export var mapTagTypeToNumber = {
    Agriculture: 17,
    Anthropology: 6,
    Chemistry: 7,
    Economics: 8,
    GS1: 1,
    GS2: 2,
    GS3: 3,
    GS4: 4,
    Geography: 9,
    Hindi: 10,
    Law: 11,
    Management: 12,
    Philosophy: 13,
    'Political Science': 14,
    'Public Administration': 15,
    Sociology: 16,
    Essay: 5,
};
export var mapTagTypeToCategories = {
    GS1: gs1Categories,
    GS2: gs2Categories,
    GS3: gs3Categories,
    GS4: gs4Categories,
    Optionals: optionalsCategories,
};
