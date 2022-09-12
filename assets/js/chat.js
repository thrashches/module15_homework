class Messenger {
    // Класс мессенджера
    ws = undefined;
    noResponseData = ''

    constructor() {
        this.createWebSocket();
    }

    createWebSocket() {
        // Создание сокета и обработка сообщений
        this.ws = new WebSocket('wss://echo-ws-service.herokuapp.com/');
        this.ws.onopen = () => {
            this.writeStatus('Connected', 'green');
        }
        this.ws.onclose = () => {
            this.writeStatus('Disconnected', 'red');
        }
        this.ws.onerror = (event) => {
            this.writeStatus(`Error: ${event.data}`, 'warning');
        }
        this.ws.onmessage = (event) => {
            if (event.data.includes(this.noResponseData) && this.noResponseData.length) {
                console.log(event.data);
            }
            else {
                this.printMessage(event.data, 'server');
            }
        }
    }

    writeStatus(status, color) {
        // Метод для отображения состояния сокета
        const statusElem = document.createElement('p');
        statusElem.innerText = status;
        statusElem.classList.add(color);
        const statusWrapper = document.getElementById('statusWrapper');
        statusWrapper.appendChild(statusElem);
    }

    sendWithNoResponse(data) {
        // Отправка сообщения с игнорированием ответа
        this.noResponseData = data;
        this.ws.send(data);
    }

    printMessage(text, from) {
        // Метод для отображения сообщений
        const messageElem = document.createElement('div');
        messageElem.classList.add('message-row');
        if (from === 'client') {
            messageElem.classList.add('message-row__client');
        }
        else if (from === 'server') {
            messageElem.classList.add('message-row__server');
        }
        const textElem = document.createElement('p');
        textElem.innerText = text;
        messageElem.appendChild(textElem);
        const messages = document.getElementById('messages');
        messages.appendChild(messageElem);
    }

    sendMessage(text) {
        // Метод для отправки сообщения на сервер
        this.ws.send(text);
        this.printMessage(text, 'client');
    }

    printGeo(url) {
        // Отображает ссылку на карту
        const linkElement = document.createElement('a');
        linkElement.innerText = 'Geo'
        linkElement.setAttribute('href', url);
        const messageElem = document.createElement('div');
        messageElem.classList.add('message-row');
        messageElem.classList.add('message-row__client')
        messageElem.appendChild(linkElement);
        const messages = document.getElementById('messages');
        messages.appendChild(messageElem);
        this.sendWithNoResponse(url);
    }
}

function getGeo() {
    // Получает координаты, возвращает ссылку на OSM
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((event) => {
            const latitude = event.coords.latitude;
            const longitude = event.coords.longitude;
            const url = `https://www.openstreetmap.org/#map=13/${latitude}/${longitude}`;
            messenger.printGeo(url);
        })
    }
    else {
        messenger.writeStatus('Службы геолокации недоступны!', 'warning');
    }
}


const messenger = new Messenger();


sendBtn.addEventListener('click', () => {
    // Кнопка отправить
    const messageInput = document.getElementById('messageInput');
    const text = messageInput.value;
    messenger.sendMessage(text);
    messageInput.value = '';
})

connectBtn.addEventListener('click', () => {
    // Кнопка Connect
    messenger.createWebSocket();
})

geoBtn.addEventListener('click', () => {
    // Кнопка Geo
    getGeo();
})