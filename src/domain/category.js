export const Category = {
    FIRST: 'FIRST',
    SECOND: 'SECOND',
    THIRD: 'THIRD',
    FOURTH: 'FOURTH',
    FIFTH: 'FIFTH',
    SIXTH: 'SIXTH',
    SEVENTH: 'SEVENTH',
    DONE: 'DONE',
};

export const Intervals = {
    [Category.FIRST]: 1,
    [Category.SECOND]: 2,
    [Category.THIRD]: 4,
    [Category.FOURTH]: 8,
    [Category.FIFTH]: 16,
    [Category.SIXTH]: 32,
    [Category.SEVENTH]: 64,
};

export const getNextCategory = (currentCategory) => {
    const categories = Object.values(Category);
    const index = categories.indexOf(currentCategory);
    if (index === -1 || currentCategory === Category.DONE) return Category.DONE;
    if (index === categories.length - 2) return Category.DONE;
    return categories[index + 1];
};
