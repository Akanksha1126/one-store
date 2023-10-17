export function capitalizeFirstLetter(str) {
    // converting first letter to uppercase
    const capitalized = str.charAt(0).toUpperCase() + str.slice(1);

    return capitalized;
}

export function timestampToDate(timestamp) {
    var options = {  year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(parseInt(timestamp) * 1000).toLocaleString("en-US", { timeZone: 'UTC' });
}
