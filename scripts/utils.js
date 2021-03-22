/**
 Adds an option to a select(HTML) element.
 @param {HTMLElement} select_element The select eletement.
 @param {string} option_str The text of the option.
 @param {Object} [option_attr] The options to be copied into the option element created.
 @returns {HTMLElement} The option element created.
 */
function addOptionStrToSelectElement(select_element, option_str, option_attr){
    if (!option_attr) option_attr = {};
    var doc = select_element.ownerDocument;
    var opt = doc.createElement("option");
    opt.text = option_str;
    for (var prop in option_attr){
        if (option_attr.hasOwnProperty(prop)){
            opt[prop] = option_attr[prop];
        }
    }
    doc = null;
    if (select_element.add.length === 2){
        select_element.add(opt, null); // standards compliant
    } else{
        select_element.add(opt); // IE only
    }
    return opt;
}


function createItemPlaylistRecordToSelectedElement(itemListElement, {title, time}){
    const item = document.createElement("div");
    item.classList.add('item');

    let leftPart, rightPart;
    {
        leftPart = document.createElement('div');
        leftPart.classList.add('left-part');

        const iconInfo = document.createElement('i');
        'fa fa-info-circle info-icon'.split(' ').forEach(className => iconInfo.classList.add(className));
        leftPart.appendChild(iconInfo);

        const titleSpan = document.createElement('span');
        titleSpan.innerText = title;
        titleSpan.classList.add('title');
        leftPart.appendChild(titleSpan);
    }

    {
        rightPart = document.createElement('div');
        rightPart.classList.add('right-part');

        const timeSpan = document.createElement('span');
        timeSpan.innerText = time;
        timeSpan.classList.add('time');
        rightPart.appendChild(timeSpan);

        const iconOptions = document.createElement('i');
        'fa fa-ellipsis-v options-icon'.split(' ').forEach(className => iconOptions.classList.add(className));
        rightPart.appendChild(iconOptions);
    }

    item.appendChild(leftPart);
    item.appendChild(rightPart);

    return item;
}


function createItemTopTopicRecordToSelectedElement(itemListElement, {title, time}, totalMinutes, totalBars){
    const item = document.createElement("div");
    item.classList.add('top-item');

    const barItem = document.createElement("div");
    barItem.classList.add('bar-item');

    const barItemCover = document.createElement("div");
    barItemCover.classList.add('bar-item-cover');
    const relativeHeight = totalBars / 1.5; // relative to the height in pixels that I chose in the styles..
    let height = Math.floor((getTimeInMinutes(time) / totalMinutes) * 100 * relativeHeight);

    if(height > 100){
        height = 100;
        barItemCover.style.borderTopLeftRadius = '8px';
        barItemCover.style.borderTopRightRadius = '8px';
    }

    if(height < 5){
        height = 5;
    }

    barItemCover.style.height =  `${height}%`;

    const titleItem = document.createElement("div");
    titleItem.classList.add('bar-title');
    titleItem.innerText = title;

    barItem.appendChild(barItemCover);
    item.appendChild(barItem);
    item.appendChild(titleItem);

    return item;
}

function getTimeInMinutes(time = ''){
    let minutes = 0;

    let [h, m] = time.split(':');
    h = +h;
    m = +m;

    if(!m) {
        m = h;
        h = 0;
    }

    if(m){
        minutes += m;
    }
    if(h) {
        minutes += h * 60;
    }

    return minutes;
}
